import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calculator, ShoppingCart, ChevronUp, ChevronDown } from 'lucide-react';
import { formatCurrency } from '@/lib/quote';
import { SelectedAddon } from '@/lib/rules';
import { addons } from '@/data/addons';
import { Context } from '@/data/assumptions';

interface StickyEstimatorProps {
  estimatedTotal: number;
  selectedAddons: SelectedAddon[];
  autoAppendedItems: SelectedAddon[];
  context: Context;
  basePrice: number;
  onGetPackage: () => void;
  className?: string;
}

export function StickyEstimator({ 
  estimatedTotal, 
  selectedAddons, 
  autoAppendedItems, 
  context, 
  basePrice, 
  onGetPackage, 
  className 
}: StickyEstimatorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className={`
      fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm 
      border-t shadow-lg lg:hidden ${className}
    `}>
      <div className="container mx-auto max-w-6xl p-4">
        {/* Expanded breakdown */}
        {isExpanded && (
          <div className="pb-4 border-b mb-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Base package:</span>
                <span>{formatCurrency(basePrice)}</span>
              </div>
              
              {selectedAddons.length > 0 && (
                <div className="space-y-1">
                  <div className="font-medium">Selected Add-ons:</div>
                  {selectedAddons.map((selection) => {
                    const addon = addons.find(a => a.id === selection.id);
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
              
              {autoAppendedItems.length > 0 && (
                <div className="space-y-1">
                  <div className="font-medium text-yellow-700">Required Add-ons:</div>
                  {autoAppendedItems.map((item) => {
                    const addon = addons.find(a => a.id === item.id);
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
          </div>
        )}

        {/* Main bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Calculator className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="font-semibold">{formatCurrency(estimatedTotal)}</div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="h-6 w-6 p-0"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronUp className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <div className="text-xs text-muted-foreground">Estimated total</div>
            </div>
          </div>
          
          <Button 
            onClick={onGetPackage}
            className="bg-primary hover:bg-primary-hover"
            size="sm"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Get Package
          </Button>
        </div>
      </div>
    </div>
  );
}