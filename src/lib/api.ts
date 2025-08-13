// WordPress + WooCommerce Store API client with nonce handling

import { config } from './config';
import type { WooProduct, WooCart, ValidationResult, ApiHeaders } from '../types';

class WooCommerceAPI {
  private nonce: string | null = null;
  private cartToken: string | null = null;

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Merge existing headers safely
    if (options.headers) {
      Object.entries(options.headers as Record<string, string>).forEach(([key, value]) => {
        headers[key] = value;
      });
    }

    // Include nonce in requests if available
    if (this.nonce) {
      headers['Nonce'] = this.nonce;
    }

    if (this.cartToken) {
      headers['Cart-Token'] = this.cartToken;
    }

    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    // Update nonce if returned in response
    const newNonce = response.headers.get('Nonce');
    const newCartToken = response.headers.get('Cart-Token');
    
    if (newNonce) {
      this.nonce = newNonce;
    }
    
    if (newCartToken) {
      this.cartToken = newCartToken;
    }

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getProducts(params: { 
    category?: string;
    slug?: string;
    per_page?: number;
    include?: number[];
  } = {}): Promise<WooProduct[]> {
    const queryParams = new URLSearchParams();
    
    if (params.category) queryParams.set('category', params.category);
    if (params.slug) queryParams.set('slug', params.slug);
    if (params.per_page) queryParams.set('per_page', params.per_page.toString());
    if (params.include) queryParams.set('include', params.include.join(','));

    const endpoint = `${config.wordpress.storeApiBase}/products?${queryParams}`;
    return this.makeRequest<WooProduct[]>(endpoint);
  }

  async getCart(): Promise<WooCart> {
    const endpoint = `${config.wordpress.storeApiBase}/cart`;
    return this.makeRequest<WooCart>(endpoint);
  }

  async addItemsToCart(items: Array<{
    id: number;
    quantity: number;
    meta?: Record<string, any>;
  }>): Promise<WooCart> {
    const endpoint = `${config.wordpress.storeApiBase}/cart/add-item`;
    
    // Add items one by one (Store API limitation)
    let cart: WooCart | null = null;
    
    for (const item of items) {
      cart = await this.makeRequest<WooCart>(endpoint, {
        method: 'POST',
        body: JSON.stringify({
          id: item.id,
          quantity: item.quantity,
          meta: item.meta || {},
        }),
      });
    }
    
    return cart!;
  }

  async updateCartItem(key: string, quantity: number): Promise<WooCart> {
    const endpoint = `${config.wordpress.storeApiBase}/cart/items/${key}`;
    return this.makeRequest<WooCart>(endpoint, {
      method: 'POST',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeCartItem(key: string): Promise<WooCart> {
    const endpoint = `${config.wordpress.storeApiBase}/cart/items/${key}`;
    return this.makeRequest<WooCart>(endpoint, {
      method: 'DELETE',
    });
  }

  async validateConfiguration(payload: {
    baseProductId: number;
    addons: Array<{ id: string; qty: number }>;
    context: string;
    answers?: Record<string, any>;
  }): Promise<ValidationResult> {
    // TODO: Remove this fallback once WordPress endpoint exists
    const fallbackResult: ValidationResult = {
      normalized: [
        { productId: payload.baseProductId, qty: 1, groupId: 'alarm-package' },
        ...payload.addons.map((addon, index) => ({
          productId: index + 100, // Temporary ID
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
        }, 200), // Base system power
        powerLimit: config.system.limits.powerBudget,
        keypads: payload.addons.filter(a => ['tskp', 'wlkp'].includes(a.id))
          .reduce((sum, a) => sum + a.qty, 1), // Base keypad
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
      console.warn('Validation endpoint not available, using fallback:', error);
      return fallbackResult;
    }
  }
}

// Export singleton instance
export const wooApi = new WooCommerceAPI();

// Initialize cart token on first load
wooApi.getCart().catch(() => {
  // Ignore errors on initial load
});