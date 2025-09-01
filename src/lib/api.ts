// WordPress + WooCommerce Store API client with nonce handling
import { config } from './config';
import type { WooProduct, WooCart, ValidationResult, ApiHeaders } from '../types';

type WooTag = {
  id: number;
  name: string;
  slug: string;
};

class WooCommerceAPI {
  private nonce: string | null = null;

  // Call this once on app start (or before first write)
  async bootstrap(): Promise<void> {
    try { await this.getCart(); } catch { /* ignore */ }
  }

  // Always include credentials (cookies), send latest Nonce, rotate from response
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };

    if (options.headers) {
      for (const [k, v] of Object.entries(options.headers as Record<string, string>)) headers[k] = v;
    }
    if (this.nonce) headers['Nonce'] = this.nonce;

    console.log('🌐 Making API request to:', endpoint);
    console.log('📋 Request headers:', headers);
    console.log('⚙️ Request options:', options);

    try {
      const res = await fetch(endpoint, { ...options, headers, credentials: 'include' });

      console.log('📡 Response status:', res.status, res.statusText);
      console.log('📋 Response headers:', Object.fromEntries(res.headers.entries()));

      // Rotate nonce (Woo sends a fresh one every response)
      const newNonce =
        res.headers.get('Nonce') ||
        res.headers.get('nonce') ||
        res.headers.get('X-WC-Store-API-Nonce') ||
        res.headers.get('x-wc-store-api-nonce');
      if (newNonce) this.nonce = newNonce;

      if (!res.ok) {
        let body: unknown = null;
        try { body = await res.json(); } catch { /* ignore parse errors */ }
        const errorText = body ? JSON.stringify(body) : res.statusText;
        console.error('❌ API Error Response:', errorText);
        const msg = body ? `HTTP ${res.status}: ${JSON.stringify(body)}` : `HTTP ${res.status} ${res.statusText}`;
        throw new Error(msg);
      }

      const data = await res.json();
      console.log('✅ API Response data:', data);
      return data;
    } catch (error) {
      console.error('❌ API request failed:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('🔍 This might be a CORS or network connectivity issue');
        console.error('🔍 Check if the WooCommerce Store API is accessible at:', endpoint);
      }
      throw error;
    }
  }

  async getProducts(params: {
    category?: string;
    tag?: string; // added
    slug?: string;
    per_page?: number;
    include?: number[];
  } = {}): Promise<WooProduct[]> {
    const queryParams = new URLSearchParams();

    console.log('🔍 getProducts called with params:', params);
    
    if (params.category) queryParams.set('category', params.category);
    if (params.tag) queryParams.set('tag', params.tag);
    if (params.slug) queryParams.set('slug', params.slug);
    if (params.per_page) queryParams.set('per_page', params.per_page.toString());
    if (params.include?.length) queryParams.set('include', params.include.join(','));
    
    const endpoint = `${config.wordpress.storeApiBase}/products?${queryParams.toString()}`;
    console.log('📡 Full API endpoint:', endpoint);
    
    try {
      const products = await this.makeRequest<WooProduct[]>(endpoint);
      console.log(`✅ Retrieved ${products.length} products`);
      
      if (products.length === 0) {
        console.warn('⚠️ No products found with these parameters:', params);
        console.warn('🔍 This might mean:');
        console.warn('  - Products don\'t exist in WooCommerce');
        console.warn('  - Category/tag/slug names are incorrect');
        console.warn('  - Products are not published');
        console.warn('  - WooCommerce Store API is not properly configured');
      }
      
      return products;
    } catch (error) {
      console.error('❌ getProducts failed:', error);
      console.error('🔍 Endpoint that failed:', endpoint);
      throw error;
    }
  }

  // --- Tag helpers ---
  private async getProductTags(params: { search?: string; per_page?: number } = {}): Promise<WooTag[]> {
    const qs = new URLSearchParams();
    if (params.search) qs.set('search', params.search);
    if (params.per_page) qs.set('per_page', String(params.per_page));
    const endpoint = `${config.wordpress.storeApiBase}/products/tags${qs.toString() ? `?${qs.toString()}` : ''}`;
    return this.makeRequest<WooTag[]>(endpoint);
  }

  private async resolveTagIdBySlug(slug: string): Promise<number | null> {
    const tags = await this.getProductTags({ search: slug, per_page: 100 });
    const match = tags.find(t => t.slug === slug);
    return match ? match.id : null;
  }

  /** Fetch products with tag/category "addon-only" */
  async getAddonOnlyProducts(perPage = 100): Promise<WooProduct[]> {
    // Try by tag slug
    let products = await this.getProducts({ tag: 'addon-only', per_page: perPage });
    if (products.length > 0) return products;

    // Try by tag ID
    const tagId = await this.resolveTagIdBySlug('addon-only');
    if (tagId) {
      products = await this.getProducts({ tag: String(tagId), per_page: perPage });
      if (products.length > 0) return products;
    }

    // Fallback: try by category slug
    return this.getProducts({ category: 'addon-only', per_page: perPage });
  }

  /** Fetch products with tag/category "alarm-addon" */
  async getAlarmAddonProducts(productType: 'wireless' | 'hardwired' = 'wireless', perPage = 100): Promise<WooProduct[]> {
    try {
      // Safety check for undefined productType
      if (!productType || !config.products[productType]) {
        console.error('❌ Invalid productType:', productType);
        console.error('❌ Available configs:', Object.keys(config.products));
        throw new Error(`Invalid product type: ${productType}`);
      }
      
      console.log(`🔍 Fetching ${productType} addon products from WooCommerce Store API...`);
      const productConfig = config.products[productType];
      
      if (productType === 'wireless') {
        // Use original working wireless API call
        console.log(`📡 Fetching wireless addons with category: ${productConfig.addonCategory}`);
        const products = await this.getProducts({ category: productConfig.addonCategory, per_page: perPage });
        
        if (products.length === 0) {
          console.warn(`⚠️ No wireless addon products found with category: ${productConfig.addonCategory}`);
          console.warn('🔍 Trying fallback: fetch all products and filter by category name');
          
          // Fallback: try to find products with 'addon' or 'alarm' in name/category
          const allProducts = await this.getProducts({ per_page: 100 });
          const fallbackProducts = allProducts.filter(p => 
            p.name.toLowerCase().includes('sensor') ||
            p.name.toLowerCase().includes('detector') ||
            p.name.toLowerCase().includes('keypad') ||
            p.name.toLowerCase().includes('panic') ||
            p.categories.some(cat => cat.name.toLowerCase().includes('addon') || cat.name.toLowerCase().includes('alarm'))
          );
          
          if (fallbackProducts.length > 0) {
            console.log(`✅ Found ${fallbackProducts.length} addon products via fallback search`);
            return fallbackProducts;
          }
        }
        
        return products;
      } else {
        // Use new hardwired API call
        console.log(`📡 Fetching hardwired addons with category: ${productConfig.addonCategory}, tag: ${productConfig.addonTag}`);
        const products = await this.getProducts({ 
          category: productConfig.addonCategory, 
          tag: productConfig.addonTag,
          per_page: perPage 
        });
        
        if (products.length === 0) {
          console.warn(`⚠️ No hardwired addon products found with category: ${productConfig.addonCategory}, tag: ${productConfig.addonTag}`);
        }
        
        return products;
      }
    } catch (error) {
      console.error(`❌ Failed to fetch ${productType} addon products:`, error);
      console.error('🔍 API Endpoint:', `${config.wordpress.storeApiBase}/products`);
      console.error('🔍 Config:', config.products[productType]);
      throw error;
    }
  }

  async getBaseAlarmProduct(productType: 'wireless' | 'hardwired' = 'wireless'): Promise<WooProduct | null> {
    try {
      // Safety check for undefined productType
      if (!productType || !config.products[productType]) {
        console.error('❌ Invalid productType:', productType);
        console.error('❌ Available configs:', Object.keys(config.products));
        throw new Error(`Invalid product type: ${productType}`);
      }
      
      console.log(`🔍 Fetching ${productType} base product from WooCommerce Store API...`);
      const productConfig = config.products[productType];
      
      if (productType === 'wireless') {
        // Use original working wireless API call
        console.log(`📡 Fetching wireless base product with slug: ${productConfig.baseProductSlug}`);
        const products = await this.getProducts({ slug: productConfig.baseProductSlug, per_page: 1 });
        
        if (products.length === 0) {
          console.warn(`⚠️ No wireless base product found with slug: ${productConfig.baseProductSlug}`);
          console.warn('🔍 Trying fallback: fetch all products and filter by name');
          
          // Fallback: try to find by name
          const allProducts = await this.getProducts({ per_page: 50 });
          const fallbackProduct = allProducts.find(p => 
            p.name.toLowerCase().includes('hybrid') && 
            p.name.toLowerCase().includes('wireless') &&
            p.name.toLowerCase().includes('alarm')
          );
          
          if (fallbackProduct) {
            console.log('✅ Found base product via fallback search:', fallbackProduct.name);
            return fallbackProduct;
          }
        }
        
        return products.length > 0 ? products[0] : null;
      } else {
        // Use new hardwired API call
        console.log(`📡 Fetching hardwired base product with category: ${productConfig.baseCategory}, tag: ${productConfig.baseTag}`);
        const products = await this.getProducts({ 
          category: productConfig.baseCategory,
          tag: productConfig.baseTag,
          per_page: 1 
        });
        
        if (products.length === 0) {
          console.warn(`⚠️ No hardwired base product found with category: ${productConfig.baseCategory}, tag: ${productConfig.baseTag}`);
        }
        
        return products.length > 0 ? products[0] : null;
      }
    } catch (error) {
      console.error(`❌ Failed to fetch ${productType} base product:`, error);
      console.error('🔍 API Endpoint:', `${config.wordpress.storeApiBase}/products`);
      console.error('🔍 Config:', config.products[productType]);
      return null;
    }
  }

  async getAutoRequiredProducts(productType: 'wireless' | 'hardwired' = 'wireless', perPage = 100): Promise<WooProduct[]> {
    try {
      // Safety check for undefined productType
      if (!productType || !config.products[productType]) {
        console.error('❌ Invalid productType:', productType);
        console.error('❌ Available configs:', Object.keys(config.products));
        throw new Error(`Invalid product type: ${productType}`);
      }
      
      if (productType === 'wireless') {
        // Use original working wireless API call
        return await this.getProducts({ tag: 'auto-required', per_page: perPage });
      } else {
        // Use new hardwired API call
        const productConfig = config.products[productType];
        return await this.getProducts({ 
          category: productConfig.autoRequiredCategory,
          tag: productConfig.autoRequiredTag,
          per_page: perPage 
        });
      }
    } catch (error) {
      console.error(`Failed to fetch ${productType} auto-required products:`, error);
      return [];
    }
  }

  // Read cart (also bootstraps nonce for guests)
  async getCart(): Promise<WooCart> {
    try {
      console.log('🔍 Fetching cart from WooCommerce Store API...');
      const url = `${config.wordpress.storeApiBase}/cart`;
      console.log('📡 Cart API URL:', url);
      return await this.makeRequest<WooCart>(url);
    } catch (error) {
      console.error('❌ Failed to fetch cart:', error);
      console.error('🔍 Cart API Endpoint:', `${config.wordpress.storeApiBase}/cart`);
      throw error;
    }
  }

  // Add multiple items; ensures nonce first; rotates automatically
  async addItemsToCart(items: Array<{
    id: number;
    quantity: number;
    variation_id?: number;
    variation?: Record<string, string>;
    meta?: Record<string, unknown>;
  }>): Promise<WooCart> {
    if (!this.nonce) await this.getCart(); // bootstrap nonce for guests

    let cart: WooCart | null = null;
    const url = `${config.wordpress.storeApiBase}/cart/add-item`;

    for (const item of items) {
      console.log(`🛒 Adding item: ${item.id} x${item.quantity}`);
      
      // if nonce dropped, refresh once
      if (!this.nonce) await this.getCart();

      const payload: {
          id: number;
          quantity: number;
          meta: Record<string, unknown>;
          variation_id?: number;
          variation?: Record<string, string>;
        } = {
          id: item.id,
          quantity: item.quantity,
          meta: item.meta ?? {}
        };
      
      // Add variation data if provided
      if (item.variation_id) {
        payload.variation_id = item.variation_id;
      }
      
      if (item.variation) {
        payload.variation = item.variation;
      }

      try {
        cart = await this.makeRequest<WooCart>(url, {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        console.log(`✅ Successfully added item: ${item.id}`);
      } catch (error) {
        console.error(`❌ Failed to add item ${item.id}:`, error);
        throw error;
      }
    }
    return cart!;
  }

  async updateCartItem(key: string, quantity: number): Promise<WooCart> {
    if (!this.nonce) await this.getCart();
    const url = `${config.wordpress.storeApiBase}/cart/items/${key}`;
    return this.makeRequest<WooCart>(url, {
      method: 'POST',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeCartItem(key: string): Promise<WooCart> {
    if (!this.nonce) await this.getCart();
    const url = `${config.wordpress.storeApiBase}/cart/items/${key}`;
    return this.makeRequest<WooCart>(url, { method: 'DELETE' });
  }

  async clearCart(): Promise<WooCart> {
    if (!this.nonce) await this.getCart();
    const url = `${config.wordpress.storeApiBase}/cart`;
    return this.makeRequest<WooCart>(url, { method: 'DELETE' });
  }

  async validateConfiguration(payload: {
    baseProductId: number;
    addons: Array<{ id: string; qty: number }>;
    context: string;
    answers?: Record<string, unknown>;
  }): Promise<ValidationResult> {
    const fallbackResult: ValidationResult = {
      normalized: [
        { productId: payload.baseProductId, qty: 1, groupId: 'alarm-package' },
        ...payload.addons.map((addon, index) => ({
          productId: index + 100,
          qty: addon.qty,
          groupId: 'alarm-package'
        }))
      ],
      autoAppended: [],
      capacity: {
        inputsUsed: payload.addons.filter(a => ['outpir', 'smoke', 'glassbreak', 'shock'].includes(a.id))
          .reduce((sum, a) => sum + a.qty, 0),
        inputsLimit: config.system.limits.inputs,
        power: payload.addons.reduce((sum, a) => {
          const power = a.id === 'tskp' ? 90 : a.id === 'outpir' ? 25 : 15;
          return sum + (power * a.qty);
        }, 200),
        powerLimit: config.system.limits.powerBudget,
        keypads: payload.addons.filter(a => ['tskp', 'wlkp'].includes(a.id))
          .reduce((sum, a) => sum + a.qty, 1),
        keypadsLimit: config.system.limits.keypads,
        touchscreens: payload.addons.filter(a => a.id === 'tskp')
          .reduce((sum, a) => sum + a.qty, 0),
        touchscreenThreshold: config.system.limits.touchscreenThreshold,
      },
      notices: [],
      estimatedTotal: config.system.basePrice[payload.context as keyof typeof config.system.basePrice]
    };

    try {
      return await this.makeRequest<ValidationResult>(config.wordpress.validateEndpoint, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch (error) {
      return fallbackResult;
    }
  }
}

export const wooApi = new WooCommerceAPI();

// Initialize nonce and cart
wooApi.bootstrap().catch(() => { /* ignore initial load errors */ });
