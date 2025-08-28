import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShoppingCart, Plus, Info, Eye, Wifi } from 'lucide-react';
import { config } from '@/lib/config';
import { wooApi } from '@/lib/api';
import type { WooProduct, IntercomPageProps } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function IntercomWireless({ rationale }: IntercomPageProps) {
  const [baseProducts, setBaseProducts] = useState<WooProduct[]>([]);
  const [addonProducts, setAddonProducts] = useState<WooProduct[]>([]);
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPopup, setSelectedPopup] = useState<WooProduct | null>(null);
  const { toast } = useToast();

  // Get rationale from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const whyParam = urlParams.get('why');
  const displayRationale = rationale || (whyParam === 'wireless' ? config.intercom.routing.rationale.wireless : '');

  useEffect(() => {
    loadProducts();
    loadCart();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const [base, addons] = await Promise.all([
        wooApi.getIntercomBaseProducts('wireless'),
        wooApi.getIntercomAddonProducts('wireless')
      ]);
      setBaseProducts(base);
      setAddonProducts(addons);
    } catch (error) {
      toast({
        title: "Failed to load products",
        description: "Please refresh the page to try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCart = async () => {
    try {
      const cartData = await wooApi.getCart();
      setCart(cartData);
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  };

  const addToCart = async (productId: number, quantity: number = 1) => {
    try {
      const updatedCart = await wooApi.addItemsToCart([{
        id: productId,
        quantity
      }]);
      setCart(updatedCart);
      toast({
        title: "Added to cart",
        description: "Product has been added to your cart."
      });
    } catch (error) {
      toast({
        title: "Failed to add to cart",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  const formatPrice = (price: string) => {
    return `$${parseFloat(price).toFixed(0)}`;
  };

  const getCartItemCount = () => {
    return cart?.items?.reduce((total: number, item: any) => total + item.quantity, 0) || 0;
  };

  const getCartTotal = () => {
    return cart?.totals?.total_price ? formatPrice(cart.totals.total_price) : '$0';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" 
               style={{ borderColor: config.intercom.brandColors.accent1 }}></div>
          <p className="text-muted-foreground">Loading intercom products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Rationale Banner */}
      {displayRationale && (
        <Alert className="mx-4 mt-4 border-l-4" 
               style={{ borderLeftColor: config.intercom.brandColors.accent1 }}>
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm font-medium">
            {displayRationale}
          </AlertDescription>
        </Alert>
      )}

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge 
            variant="secondary" 
            className="mb-4 px-4 py-2"
            style={{ backgroundColor: config.intercom.brandColors.accent1 + '20', color: config.intercom.brandColors.accent1 }}
          >
            <Wifi className="w-4 h-4 mr-2" />
            Wireless Intercom System
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: config.intercom.brandColors.primary }}>
            Flexible Wireless Communication
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Easy-to-install wireless intercom systems offering maximum flexibility and convenience.
          </p>
        </div>

        {/* Base Package */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Base Package</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {baseProducts.map((product) => (
              <Card key={product.id} className="shadow-md hover:shadow-lg transition-shadow border-l-4" 
                    style={{ borderLeftColor: config.intercom.brandColors.accent1 }}>
                <CardHeader>
                  {product.images?.[0] && (
                    <img 
                      src={product.images[0].src} 
                      alt={product.images[0].alt}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                  )}
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {product.short_description || product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold" style={{ color: config.intercom.brandColors.accent1 }}>
                      {formatPrice(product.price)}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPopup(product)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Details
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => addToCart(product.id)}
                        style={{ backgroundColor: config.intercom.brandColors.accent1 }}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Add-ons Grid */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Available Add-ons</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {addonProducts.map((product) => {
              // Get product type from attributes
              const typeAttr = product.attributes?.find(attr => 
                attr.name.toLowerCase() === config.intercom.attributes.type
              );
              const productType = typeAttr?.options?.[0] || 'accessory';
              
              return (
                <Card key={product.id} className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    {product.images?.[0] && (
                      <img 
                        src={product.images[0].src} 
                        alt={product.images[0].alt}
                        className="w-full h-32 object-cover rounded-md mb-3"
                      />
                    )}
                    <div className="space-y-2">
                      <Badge 
                        variant="secondary" 
                        className="text-xs"
                        style={{ backgroundColor: config.intercom.brandColors.accent1 + '20', color: config.intercom.brandColors.accent1 }}
                      >
                        <Wifi className="w-3 h-3 mr-1" />
                        {productType.replace('-', ' ').toUpperCase()}
                      </Badge>
                      <CardTitle className="text-base leading-tight">{product.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {product.short_description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold" style={{ color: config.intercom.brandColors.accent1 }}>
                        {formatPrice(product.price)}
                      </span>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedPopup(product)}
                          className="px-2"
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => addToCart(product.id)}
                          style={{ backgroundColor: config.intercom.brandColors.accent1 }}
                          className="px-2"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Capacity Hints */}
        <section className="mb-12">
          <Card className="bg-muted/30 border-l-4" style={{ borderLeftColor: config.intercom.brandColors.highlight1 }}>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Info className="w-5 h-5" style={{ color: config.intercom.brandColors.highlight1 }} />
                Capacity Hints
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <p className="font-medium mb-2">Typical Residential Setup:</p>
                  <ul className="space-y-1 ml-4">
                    <li>• 1 Door station at main entrance</li>
                    <li>• 1-2 Indoor monitors</li>
                    <li>• Optional: Additional door station for back entrance</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-2">Small Retail Setup:</p>
                  <ul className="space-y-1 ml-4">
                    <li>• 1 Door station at customer entrance</li>
                    <li>• 1 Monitor at reception/counter</li>
                    <li>• Optional: Additional monitor in back office</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Mini Cart */}
        <div className="fixed bottom-6 right-6 z-50">
          <Card className="shadow-lg" style={{ backgroundColor: config.intercom.brandColors.primary }}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4 text-white">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="font-medium">{getCartItemCount()} items</span>
                </div>
                <div className="text-lg font-bold">{getCartTotal()}</div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm">
                    View Cart
                  </Button>
                  <Button 
                    size="sm"
                    style={{ backgroundColor: config.intercom.brandColors.accent1 }}
                  >
                    Checkout
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Product Details Popup */}
      {selectedPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{selectedPopup.name}</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedPopup(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {selectedPopup.images?.[0] && (
                <img 
                  src={selectedPopup.images[0].src} 
                  alt={selectedPopup.images[0].alt}
                  className="w-full h-64 object-cover rounded-md mb-4"
                />
              )}
              <div className="space-y-4">
                <div dangerouslySetInnerHTML={{ __html: selectedPopup.description }} />
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-2xl font-bold" style={{ color: config.intercom.brandColors.accent1 }}>
                    {formatPrice(selectedPopup.price)}
                  </span>
                  <Button
                    onClick={() => {
                      addToCart(selectedPopup.id);
                      setSelectedPopup(null);
                    }}
                    style={{ backgroundColor: config.intercom.brandColors.accent1 }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}