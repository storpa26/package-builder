import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Calculator, AlertCircle, Loader2 } from 'lucide-react';
import { AddonCard } from './AddonCard';
import { AddonModal } from './AddonModal';
import { CapacityMeter } from './CapacityMeter';
import { addons as staticAddons } from '@/data/addons';
import type { Addon, WooProduct } from '@/types';
import { Context, assumptions } from '@/data/assumptions';
import { SelectedAddon, RulesEngine } from '@/lib/rules';
import { formatCurrency } from '@/lib/quote';
import { wooApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface AddOnsSectionProps {
  context: Context;
  selectedAddons: SelectedAddon[];
  onUpdateAddons: (addons: SelectedAddon[]) => void;
  estimatedTotal: number;
  onAddToQuote: () => void;
}

export function AddOnsSection({ 
  context, 
  selectedAddons, 
  onUpdateAddons, 
  estimatedTotal,
  onAddToQuote 
}: AddOnsSectionProps) {
  const { toast } = useToast();
  const [selectedAddon, setSelectedAddon] = useState<Addon | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addonProducts, setAddonProducts] = useState<Addon[]>([]);
  const [autoRequiredProducts, setAutoRequiredProducts] = useState<Addon[]>([]);
  const [baseProductPrice, setBaseProductPrice] = useState<Record<Context, number> | null>(null);
  const [baseProduct, setBaseProduct] = useState<WooProduct | null>(null);
  const [wooProductMap, setWooProductMap] = useState<Map<string, number>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch addon-only products from WooCommerce
  useEffect(() => {
    const fetchAddonProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch base product for pricing
        const baseProductData = await wooApi.getBaseAlarmProduct();
        if (baseProductData) {
          setBaseProduct(baseProductData);
          const basePrice = parseFloat(baseProductData.prices.price) / (10 ** baseProductData.prices.currency_minor_unit);
          const basePricing = {
            residential: basePrice,
            retail: basePrice * 1.15,
            office: basePrice * 1.15,
            warehouse: basePrice * 1.3
          };
          setBaseProductPrice(basePricing);
        }
        
        // Fetch regular add-on products
        const wooProducts = await wooApi.getAlarmAddonProducts();
        const mappedAddons = mapWooProductsToAddons(wooProducts);
        
        // Fetch auto-required products
        const autoRequiredWooProducts = await wooApi.getAutoRequiredProducts();
        const mappedAutoRequired = mapWooProductsToAddons(autoRequiredWooProducts, true);
        
        setAddonProducts([...mappedAddons, ...mappedAutoRequired]);
        setAutoRequiredProducts(mappedAutoRequired);
        
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to fetch addon products:', err);
        setError('Failed to load add-on products. Please try again later.');
        setIsLoading(false);
        
        // Fallback to static data if API fails
        const autoAppendedAddons = staticAddons.filter(addon => addon.isAutoAppended);
        setAddonProducts([...staticAddons.filter(addon => !addon.isAutoAppended), ...autoAppendedAddons]);
        setAutoRequiredProducts(autoAppendedAddons);
      }
    };

    fetchAddonProducts();
  }, []);

  // Map WooCommerce products to local Addon type
  const mapWooProductsToAddons = (products: WooProduct[], isAutoAppended: boolean = false): Addon[] => {
    return products.map(product => {
      // Check if meta_data exists, if not use an empty array
      const metaData = product.meta_data || [];
      
      // Try to find matching static addon for fallback data
      const staticAddon = staticAddons.find(addon => {
        // First try exact slug match
        if (addon.id === product.slug) return true;
        
        // Then try name-based matching
        const productNameLower = product.name.toLowerCase();
        const addonNameLower = addon.name.toLowerCase();
        
        // Check for key terms
        if (productNameLower.includes('touchscreen') && addonNameLower.includes('touchscreen')) return true;
        if (productNameLower.includes('outdoor') && addonNameLower.includes('outdoor')) return true;
        if (productNameLower.includes('glass') && addonNameLower.includes('glass')) return true;
        if (productNameLower.includes('door') && addonNameLower.includes('door')) return true;
        if (productNameLower.includes('panic') && addonNameLower.includes('panic')) return true;
        if (productNameLower.includes('smoke') && addonNameLower.includes('smoke')) return true;
        if (productNameLower.includes('keypad') && addonNameLower.includes('keypad') && !productNameLower.includes('touchscreen')) return true;
        
        return false;
      });
      
      // Extract addon type from meta data or fallback to static data
      const typeMetaData = metaData.find(meta => meta.key === '_addon_type');
      const type = typeMetaData?.value || staticAddon?.type || 'accessory';
      
      // Extract power consumption from meta data or fallback to static data
      const powerMetaData = metaData.find(meta => meta.key === '_power_milliamps');
      const powerMilliAmps = powerMetaData ? Number(powerMetaData.value) : (staticAddon?.powerMilliAmps || 0);
      
      // Extract whether it consumes input from meta data or fallback to static data
      const consumesInputMeta = metaData.find(meta => meta.key === '_consumes_input');
      const consumesInput = consumesInputMeta ? consumesInputMeta.value === 'yes' : (staticAddon?.consumesInput || false);
      
      // Extract touchscreen property or fallback to static data
      const isTouchscreenMeta = metaData.find(meta => meta.key === '_is_touchscreen');
      const isTouchscreen = isTouchscreenMeta ? isTouchscreenMeta.value === 'yes' : (staticAddon?.isTouchscreen || false);
      
      // Extract min/max quantities or fallback to static data
      const qtyMinMeta = metaData.find(meta => meta.key === '_qty_min');
      const qtyMin = qtyMinMeta ? Number(qtyMinMeta.value) : (staticAddon?.qtyMin || 0);
      
      const qtyMaxMeta = metaData.find(meta => meta.key === '_qty_max');
      const qtyMax = qtyMaxMeta ? Number(qtyMaxMeta.value) : (staticAddon?.qtyMax || 10);
      
      // Extract bullet points from description
 // Replace your current bullets mapping with:
const bullets = product.short_description
  ? extractBullets(product.short_description)
  : [];

// Minimal helper: prefers <li>, falls back to <br>/<p>/plain text
function extractBullets(html: string): string[] {
  const div = document.createElement('div');
  div.innerHTML = html;

  // 1) If Woo used a real list, grab the <li> text
  const liTexts = Array.from(div.querySelectorAll('li'))
    .map(li => (li.textContent || '').trim())
    .filter(Boolean);
  if (liTexts.length) return liTexts;

  // 2) Otherwise convert <br>/<p> to lines and strip tags
  const text = div.innerHTML
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?p[^>]*>/gi, '\n')
    .replace(/&nbsp;/gi, ' ')
    .replace(/<[^>]*>/g, '');
  return text.split(/\n|•|·|-/).map(s => s.trim()).filter(Boolean);
}

      
      // Create pricing object for different contexts
      const priceValue = product.prices.price && !isNaN(parseFloat(product.prices.price)) 
        ? (parseFloat(product.prices.price)/(10**product.prices.currency_minor_unit)) 
        : 0; // Default to 0 if price is invalid
      const unitPrice = {
        residential: priceValue,
        retail: priceValue * 1.15, // 15% markup for retail
        office: priceValue * 1.15,  // 15% markup for office
        warehouse: priceValue * 1.3  // 30% markup for warehouse
      };
      
      // Check for context-specific pricing in meta data
      // Use metaData instead of product.meta_data
      const residentialPriceMeta = metaData.find(meta => meta.key === '_price_residential');
      const retailPriceMeta = metaData.find(meta => meta.key === '_price_retail');
      const officePriceMeta = metaData.find(meta => meta.key === '_price_office');
      const warehousePriceMeta = metaData.find(meta => meta.key === '_price_warehouse');
      
      if (residentialPriceMeta) unitPrice.residential = Number(residentialPriceMeta.value);
      if (retailPriceMeta) unitPrice.retail = Number(retailPriceMeta.value);
      if (officePriceMeta) unitPrice.office = Number(officePriceMeta.value);
      if (warehousePriceMeta) unitPrice.warehouse = Number(warehousePriceMeta.value);
      
      // Map WooCommerce slugs to expected IDs
      let mappedId = product.slug;
      
      // Map auto-appended items
      if (isAutoAppended) {
        if (product.slug === 'input-expander') {
          mappedId = 'expander';
        } else if (product.slug === 'additional-power-supply') {
          mappedId = 'psu';
        }
      } else {
        // Map regular add-ons from WooCommerce slugs to static addon IDs
        const slugToIdMap: Record<string, string> = {
          'outdoor-motion-sensor-pet-friendly': 'outpir',
          'touchscreen-keypad': 'tskp',
          'wireless-smoke-detector': 'smoke',
          'panic-button-portable': 'panic',
          'glass-break-detector': 'glass',
          'door-window-sensor': 'door',
          'additional-keypad': 'keypad2'
        };
        
        mappedId = slugToIdMap[product.slug] || product.slug;
      }

      return {
        id: mappedId,
        name: product.name,
        type: type as 'sensor' | 'keypad' | 'controller' | 'psu' | 'expander' | 'accessory',
        consumesInput,
        powerMilliAmps,
        unitPrice,
        summary: product.short_description || '',
        bullets: bullets.length > 0 ? bullets : ["No details available"],
        qtyMin,
        qtyMax,
        isTouchscreen,
        isAutoAppended
      };
    });
  };

  const rulesEngine = new RulesEngine(addonProducts, baseProductPrice || undefined);
  const validation = rulesEngine.validateSelection(selectedAddons);
  const capacityLimits = rulesEngine.getCapacityLimits(selectedAddons);
  
  // Calculate real-time estimated total
  const calculatedTotal = rulesEngine.calculateTotal(selectedAddons, context);

  // Filter out auto-appended items from the main grid
  const userSelectableAddons = addonProducts.filter(addon => !addon.isAutoAppended);

  const getSelectedQuantity = (addonId: string) => {
    const selected = selectedAddons.find(s => s.id === addonId);
    return selected ? selected.quantity : 0;
  };

  const handleAddonClick = (addon: Addon) => {
    setSelectedAddon(addon);
    setIsModalOpen(true);
  };

  const handleSaveSelection = (quantity: number, include: boolean) => {
    if (!selectedAddon) return;

    const updatedAddons = selectedAddons.filter(s => s.id !== selectedAddon.id);
    if (include && quantity > 0) {
      updatedAddons.push({ id: selectedAddon.id, quantity });
    }

    onUpdateAddons(updatedAddons);
  };

  const getAutoAppendedItems = () => {
    return validation.autoAppendedItems.map(item => {
      const addon = addonProducts.find(a => a.id === item.id);
      return addon ? { addon, quantity: item.quantity, reason: item.reason } : null;
    }).filter(Boolean);
  };

  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true);
      setError(null);

      console.log('🛒 Starting cart operation...');
      console.log('🛒 Selected addons:', selectedAddons);
      console.log('🛒 Validation result:', validation);
      
      // Prepare items for WooCommerce cart
      const cartItems = [];
      
      // Add base product (always included)
      if (baseProduct) {
        console.log('🛒 Adding base product:', baseProduct.id, baseProduct.name);
        cartItems.push({
          id: baseProduct.id,
          quantity: 1,
          meta: {
            context: context,
            package_type: 'base_system',
            product_name: baseProduct.name
          }
        });
      } else {
        throw new Error('Base product not found');
      }
      
      // Add selected add-ons (user selections)
      console.log('🛒 Processing selected add-ons:', selectedAddons);
      console.log('🛒 Available addon products:', addonProducts.map(a => ({ id: a.id, name: a.name, isAutoAppended: a.isAutoAppended })));
      console.log('🛒 WooCommerce product map:', Array.from(wooProductMap.entries()));
      
      for (const selection of selectedAddons) {
        console.log(`🛒 Processing selection: ${selection.id} x${selection.quantity}`);
        const addon = addonProducts.find(a => a.id === selection.id && !a.isAutoAppended);
        console.log(`🛒 Found addon:`, addon ? { id: addon.id, name: addon.name, isAutoAppended: addon.isAutoAppended } : 'NOT FOUND');
        
        if (addon) {
          const wooProductId = wooProductMap.get(selection.id);
          console.log(`🛒 Adding addon: ${addon.name} (ID: ${selection.id} → WooCommerce ID: ${wooProductId})`);
          
          if (wooProductId) {
            cartItems.push({
              id: wooProductId,
              quantity: selection.quantity,
              meta: {
                addon_type: addon.type,
                context: context,
                product_name: addon.name,
                user_selected: true
              }
            });
          } else {
            console.warn(`⚠️ No WooCommerce product ID found for addon: ${selection.id}`);
            // Try hardcoded mapping for regular add-ons
            const hardcodedAddonMap: Record<string, number> = {
              'outpir': 2378, // Outdoor motion sensor
              'tskp': 2381,   // Touchscreen keypad
              'smoke': 2393,  // Smoke detector
              'panic': 2385,  // Panic button
              'glass': 2384,  // Glass break detector
              'door': 2383,   // Door/window sensor
              'keypad2': 2382 // Additional keypad
            };
            
            const hardcodedId = hardcodedAddonMap[selection.id];
            if (hardcodedId) {
              console.log(`🛒 Using hardcoded ID for ${selection.id}: ${hardcodedId}`);
              cartItems.push({
                id: hardcodedId,
                quantity: selection.quantity,
                meta: {
                  addon_type: addon.type,
                  context: context,
                  product_name: addon.name,
                  user_selected: true
                }
              });
            } else {
              console.warn(`⚠️ No hardcoded mapping found for addon: ${selection.id}`);
            }
          }
        } else {
          console.warn(`⚠️ Addon not found in products list: ${selection.id}`);
        }
      }
      
      // Add auto-appended items (system requirements)
      console.log('🛒 Processing auto-appended items:', validation.autoAppendedItems);
      
      for (const item of validation.autoAppendedItems) {
        console.log(`🛒 Processing auto-required: ${item.id} x${item.quantity}`);
        const addon = addonProducts.find(a => a.id === item.id);
        console.log(`🛒 Found auto-required addon:`, addon ? { id: addon.id, name: addon.name } : 'NOT FOUND');
        
        if (addon) {
          const wooProductId = wooProductMap.get(item.id);
          console.log(`🛒 Adding auto-required: ${addon.name} (ID: ${item.id} → WooCommerce ID: ${wooProductId})`);
          console.log(`🛒 Reason: ${item.reason}`);
          
          if (wooProductId) {
            cartItems.push({
              id: wooProductId,
              quantity: item.quantity,
              meta: {
                auto_added: true,
                reason: item.reason,
                context: context,
                product_name: addon.name
              }
            });
          } else {
            console.warn(`⚠️ No WooCommerce product ID found for auto-required: ${item.id}`);
            // For auto-required items, we know the WooCommerce IDs
            let hardcodedId = 0;
            if (item.id === 'expander') {
              hardcodedId = 2389; // Input Expander
            } else if (item.id === 'psu') {
              hardcodedId = 2390; // Additional PSU
            }
            
            if (hardcodedId > 0) {
              console.log(`🛒 Using hardcoded ID for ${item.id}: ${hardcodedId}`);
              cartItems.push({
                id: hardcodedId,
                quantity: item.quantity,
                meta: {
                  auto_added: true,
                  reason: item.reason,
                  context: context,
                  product_name: addon.name
                }
              });
            } else {
              // Try hardcoded mapping for common add-ons
              const hardcodedAddonMap: Record<string, number> = {
                'outpir': 2378, // Outdoor motion sensor
                'tskp': 2381,   // Touchscreen keypad
                'smoke': 2393,  // Smoke detector
                'panic': 2385,  // Panic button
                'glass': 2384,  // Glass break detector
                'door': 2383,   // Door/window sensor
                'keypad2': 2382 // Additional keypad
              };
              
              const mappedId = hardcodedAddonMap[item.id];
              if (mappedId) {
                console.log(`🛒 Using hardcoded addon mapping for ${item.id}: ${mappedId}`);
                cartItems.push({
                  id: mappedId,
                  quantity: item.quantity,
                  meta: {
                    auto_added: true,
                    reason: item.reason,
                    context: context,
                    product_name: addon.name
                  }
                });
              }
            }
          }
        } else {
          console.warn(`⚠️ Auto-required addon not found: ${item.id}`);
        }
      }
      
      console.log('🛒 Final cart items to add:', cartItems);
      
      if (cartItems.length === 0) {
        throw new Error('No valid items to add to cart');
      }
      
      // Add items to WooCommerce cart one by one for better error handling
      let addedCount = 0;
      for (const item of cartItems) {
        try {
          console.log(`🛒 Adding item ${addedCount + 1}/${cartItems.length}:`, item);
          await wooApi.addItemsToCart([item]);
          addedCount++;
          console.log(`✅ Successfully added item ${addedCount}`);
        } catch (itemError) {
          console.error(`❌ Failed to add item:`, item, itemError);
          // Continue with other items rather than failing completely
        }
      }
      
      if (addedCount === 0) {
        throw new Error('Failed to add any items to cart');
      }
      
      // Verify final cart state
      const finalCart = await wooApi.getCart();
      console.log('🛒 Final cart state:', finalCart);
      
      const itemCount = finalCart.items?.length || 0;
      const totalPrice = finalCart.totals?.total_price || '0';
      
      // Show success message
      toast({
        title: "Items Added to Cart!",
        description: `Successfully added ${addedCount} items. Cart total: ${totalPrice}`,
      });
      
      // Redirect to cart page after a short delay
      // setTimeout(() => {
      //   const cartUrl = window.location.origin.includes('localhost') 
      //     ? 'https://cheapalarms.com.au/cart/' 
      //     : '/cart/';
      //   window.location.href = cartUrl;
      // }, 1500);
       
     } catch (err) {
       console.error('❌ Cart operation failed:', err);
       const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
       setError(`Failed to add items to cart: ${errorMessage}`);
       toast({
         title: "Failed to Add Items",
         description: `Error: ${errorMessage}. Please try again.`,
         variant: "destructive",
       });
     } finally {
       setIsAddingToCart(false);
     }
   };

  // Loading state
  if (isLoading) {
    return (
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Add-Ons & Upgrades</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Loading available add-ons...
            </p>
          </div>
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error && addonProducts.length === 0) {
    return (
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Add-Ons & Upgrades</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Customize your security system with additional sensors and features
            </p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-700 mb-2">Failed to Load Add-ons</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
              className="mx-auto"
            >
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Add-Ons & Upgrades</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Customize your security system with additional sensors and features
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {userSelectableAddons.map(addon => (
                <AddonCard
                  key={addon.id}
                  addon={addon}
                  context={context}
                  selectedQuantity={getSelectedQuantity(addon.id)}
                  onClick={() => handleAddonClick(addon)}
                />
              ))}
            </div>

            {/* Auto-appended items */}
            {validation.autoAppendedItems.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-primary" />
                  Required Additions
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getAutoAppendedItems().map(({ addon, quantity, reason }) => (
                    <AddonCard
                      key={`auto-${addon!.id}`}
                      addon={addon!}
                      context={context}
                      selectedQuantity={quantity}
                      isAutoAppended={true}
                      onClick={() => {}}
                    />
                  ))}
                </div>
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-yellow-800">Why these items were added:</p>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      {validation.autoAppendedItems.map((item, index) => (
                        <li key={index}>• {item.reason}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Violations */}
            {validation.violations.length > 0 && (
              <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">Configuration Issues</h4>
                <ul className="space-y-1">
                  {validation.violations.map((violation, index) => (
                    <li key={index} className="text-sm text-red-700">• {violation}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <CapacityMeter limits={capacityLimits} violations={validation.violations} />

            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-primary" />
                  Estimated Total
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {formatCurrency(calculatedTotal)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Including professional installation
                  </p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Base package:</span>
                    <span>{formatCurrency(baseProductPrice ? baseProductPrice[context] : assumptions.basePrice[context])}</span>
                  </div>
                  
                  {selectedAddons.length > 0 && (
                    <div className="space-y-1">
                      <div className="font-medium">Selected Add-ons:</div>
                      {selectedAddons.map((selection) => {
                        const addon = addonProducts.find(a => a.id === selection.id);
                        if (!addon || addon.isAutoAppended) return null;
                        return (
                          <div key={selection.id} className="flex justify-between text-xs pl-2">
                            <span>{addon.name} × {selection.quantity}</span>
                            <span>{formatCurrency(addon.unitPrice[context] * selection.quantity)}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  
                  {validation.autoAppendedItems.length > 0 && (
                    <div className="space-y-1">
                      <div className="font-medium text-yellow-700">Required Add-ons:</div>
                      {validation.autoAppendedItems.map((item) => {
                        const addon = addonProducts.find(a => a.id === item.id);
                        if (!addon) return null;
                        return (
                          <div key={item.id} className="flex justify-between text-xs pl-2 text-yellow-700">
                            <span>{addon.name} × {item.quantity}</span>
                            <span>{formatCurrency(addon.unitPrice[context] * item.quantity)}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <Button 
                  onClick={handleAddToCart}
                  className="w-full bg-primary hover:bg-primary/90"
                  size="lg"
                  disabled={validation.violations.length > 0 || isLoading || isAddingToCart}
                >
                  {isAddingToCart ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Adding to Cart...
                    </>
                  ) : (
                    'Add to Cart'
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Final price may vary based on site conditions and installation requirements
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <AddonModal
          addon={selectedAddon}
          context={context}
          isOpen={isModalOpen}
          currentQuantity={selectedAddon ? getSelectedQuantity(selectedAddon.id) : 0}
          validation={validation}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveSelection}
        />
      </div>
    </section>
  );
}