import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye } from 'lucide-react';
import { config } from '@/lib/config';
import type { WooProduct } from '@/types';

interface IntercomProductCardProps {
  product: WooProduct;
  wiringType: 'wired' | 'wireless';
  onAddToCart: (productId: number) => void;
  onViewDetails: (product: WooProduct) => void;
  size?: 'small' | 'medium' | 'large';
}

export function IntercomProductCard({ 
  product, 
  wiringType, 
  onAddToCart, 
  onViewDetails, 
  size = 'medium' 
}: IntercomProductCardProps) {
  const formatPrice = (price: string) => {
    return `$${parseFloat(price).toFixed(0)}`;
  };

  const getProductType = () => {
    const typeAttr = product.attributes?.find(attr => 
      attr.name.toLowerCase() === config.intercom.attributes.type
    );
    return typeAttr?.options?.[0] || 'accessory';
  };

  const accentColor = wiringType === 'wired' 
    ? config.intercom.brandColors.accent2 
    : config.intercom.brandColors.accent1;

  const cardClasses = {
    small: 'shadow-md hover:shadow-lg transition-shadow',
    medium: 'shadow-md hover:shadow-lg transition-shadow',
    large: 'shadow-md hover:shadow-lg transition-shadow border-l-4'
  };

  const imageClasses = {
    small: 'w-full h-24 object-cover rounded-md mb-2',
    medium: 'w-full h-32 object-cover rounded-md mb-3',
    large: 'w-full h-48 object-cover rounded-md mb-4'
  };

  const titleClasses = {
    small: 'text-sm leading-tight',
    medium: 'text-base leading-tight',
    large: 'text-lg'
  };

  const priceClasses = {
    small: 'text-base font-bold',
    medium: 'text-lg font-bold',
    large: 'text-2xl font-bold'
  };

  return (
    <Card 
      className={cardClasses[size]} 
      style={size === 'large' ? { borderLeftColor: accentColor } : {}}
    >
      <CardHeader className={size === 'small' ? 'pb-2' : size === 'medium' ? 'pb-3' : ''}>
        {product.images?.[0] && (
          <img 
            src={product.images[0].src} 
            alt={product.images[0].alt}
            className={imageClasses[size]}
          />
        )}
        <div className="space-y-2">
          {size !== 'large' && (
            <Badge 
              variant="secondary" 
              className="text-xs"
              style={{ 
                backgroundColor: accentColor + '20', 
                color: accentColor 
              }}
            >
              {getProductType().replace('-', ' ').toUpperCase()}
            </Badge>
          )}
          <CardTitle className={titleClasses[size]}>
            {product.name}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className={size === 'small' ? 'pt-0' : size === 'medium' ? 'pt-0' : ''}>
        <p className={`text-muted-foreground mb-${size === 'large' ? '4' : '3'} line-clamp-${size === 'large' ? '3' : '2'}`}
           style={{ fontSize: size === 'small' ? '0.75rem' : '0.875rem' }}>
          {product.short_description || product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className={priceClasses[size]} style={{ color: accentColor }}>
            {formatPrice(product.price)}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(product)}
              className={size === 'small' ? 'px-2' : ''}
            >
              <Eye className={size === 'small' ? 'w-3 h-3' : 'w-4 h-4'} />
              {size === 'large' && <span className="ml-1">Details</span>}
            </Button>
            <Button
              size="sm"
              onClick={() => onAddToCart(product.id)}
              style={{ backgroundColor: accentColor }}
              className={size === 'small' ? 'px-2' : ''}
            >
              <Plus className={size === 'small' ? 'w-3 h-3' : 'w-4 h-4'} />
              {size === 'large' && <span className="ml-1">Add</span>}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Mini Cart Component
interface MiniCartProps {
  itemCount: number;
  total: string;
  onViewCart: () => void;
  onCheckout: () => void;
  wiringType?: 'wired' | 'wireless';
}

export function MiniCart({ 
  itemCount, 
  total, 
  onViewCart, 
  onCheckout, 
  wiringType = 'wired' 
}: MiniCartProps) {
  const accentColor = wiringType === 'wired' 
    ? config.intercom.brandColors.accent2 
    : config.intercom.brandColors.accent1;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="shadow-lg" style={{ backgroundColor: config.intercom.brandColors.primary }}>
        <CardContent className="p-4">
          <div className="flex items-center gap-4 text-white">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              <span className="font-medium">{itemCount} items</span>
            </div>
            <div className="text-lg font-bold">{total}</div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={onViewCart}>
                View Cart
              </Button>
              <Button 
                size="sm"
                onClick={onCheckout}
                style={{ backgroundColor: accentColor }}
              >
                Checkout
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}