import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Zap, Smartphone } from 'lucide-react';
import { Context, contextLabels } from '@/data/assumptions';
import { formatCurrency } from '@/lib/quote';

interface HeroProps {
  context: Context;
  basePrice: number;
  onGetPackage: () => void;
  onGetQuote: () => void;
}

export function Hero({ context, basePrice, onGetPackage, onGetQuote }: HeroProps) {
  return (
    <section className="relative bg-gradient-to-br from-background via-accent/20 to-background py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-2">
              <Badge variant="secondary" className="text-primary font-medium">
                {contextLabels[context]} Package
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
                Hybrid Wireless Alarm System
                <span className="text-muted-foreground block text-2xl lg:text-3xl font-normal mt-2">
                  (Professionally Installed)
                </span>
              </h1>
            </div>
            
            <p className="text-xl text-muted-foreground max-w-lg">
              Australian-made security with smart wireless sensors, reliable monitoring, 
              and expandable protection that grows with your needs.
            </p>

            <div className="flex items-center gap-4">
              <div className="bg-primary text-primary-foreground px-6 py-3 rounded-lg">
                <span className="text-sm opacity-90">From</span>
                <div className="text-2xl font-bold">{formatCurrency(basePrice)}</div>
                <span className="text-sm opacity-90">installed</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary-hover text-primary-foreground"
                onClick={onGetPackage}
              >
                Get This Package
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary/5"
                onClick={onGetQuote}
              >
                Get a Free Quote
              </Button>
            </div>
          </div>

          <div className="lg:pl-12">
            <div className="bg-card rounded-xl p-8 shadow-lg border">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div className="space-y-3">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold">Trusted Protection</h3>
                    <p className="text-sm text-muted-foreground">Australian conditions tested</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold">Expandable</h3>
                    <p className="text-sm text-muted-foreground">Grows with your needs</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold">Smart Control</h3>
                    <p className="text-sm text-muted-foreground">Monitor from anywhere</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}