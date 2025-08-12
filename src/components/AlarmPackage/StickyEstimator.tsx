import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calculator, ShoppingCart } from 'lucide-react';
import { formatCurrency } from '@/lib/quote';

interface StickyEstimatorProps {
  estimatedTotal: number;
  onGetPackage: () => void;
  className?: string;
}

export function StickyEstimator({ estimatedTotal, onGetPackage, className }: StickyEstimatorProps) {
  return (
    <div className={`
      fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm 
      border-t shadow-lg p-4 lg:hidden ${className}
    `}>
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Calculator className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="font-semibold">{formatCurrency(estimatedTotal)}</div>
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