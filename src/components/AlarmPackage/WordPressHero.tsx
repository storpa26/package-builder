import { Shield, CheckCircle, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Context } from '@/lib/config';

interface HeroProps {
  context: Context;
  basePrice: number;
  onGetPackage: () => void;
  onGetQuote: () => void;
}

export function Hero({ context, basePrice, onGetPackage, onGetQuote }: HeroProps) {
  return (
    <section className="relative bg-background py-16 px-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/20 to-card" />
      
      <div className="container mx-auto max-w-6xl relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5">
                Professional Installation Included
              </Badge>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                Hybrid Wireless Alarm System
                <span className="text-primary block">(Installed)</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-lg">
                Protect what matters most with our expandable wireless security system. 
                Professional installation, 2-year workmanship warranty, and 24/7 monitoring ready.
              </p>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="px-4 py-2 text-2xl font-bold border-primary/30 text-primary bg-primary/5">
                From ${basePrice.toLocaleString()} installed
              </Badge>
              <span className="text-sm text-muted-foreground">
                {context === 'residential' ? 'Residential' : 
                 context === 'retail' ? 'Small Retail' :
                 context === 'office' ? 'Office' : 'Warehouse'} package
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={onGetPackage}
                className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold"
              >
                <Shield className="w-5 h-5 mr-2" />
                Get This Package
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                onClick={onGetQuote}
                className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
              >
                Get a Free Quote
              </Button>
            </div>

            {/* Quick benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>2-year warranty</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>Professional install</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>Expandable system</span>
              </div>
            </div>
          </div>

          {/* Illustration */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Main illustration */}
              <svg 
                width="400" 
                height="300" 
                viewBox="0 0 400 300" 
                className="drop-shadow-lg"
                fill="none"
              >
                {/* House outline */}
                <rect x="50" y="120" width="180" height="120" rx="8" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2"/>
                
                {/* Roof */}
                <path d="M40 120 L140 60 L240 120 Z" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="2"/>
                
                {/* Door */}
                <rect x="120" y="180" width="40" height="60" rx="4" fill="hsl(var(--background))" stroke="hsl(var(--border))" strokeWidth="1"/>
                
                {/* Windows */}
                <rect x="70" y="140" width="30" height="25" rx="2" fill="hsl(var(--background))" stroke="hsl(var(--border))" strokeWidth="1"/>
                <rect x="180" y="140" width="30" height="25" rx="2" fill="hsl(var(--background))" stroke="hsl(var(--border))" strokeWidth="1"/>
                
                {/* Security sensors */}
                <circle cx="85" cy="135" r="3" fill="hsl(var(--primary))"/>
                <circle cx="195" cy="135" r="3" fill="hsl(var(--primary))"/>
                <circle cx="140" cy="175" r="3" fill="hsl(var(--primary))"/>
                
                {/* Control panel */}
                <rect x="260" y="100" width="60" height="40" rx="6" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="2"/>
                <circle cx="285" cy="115" r="2" fill="hsl(var(--primary))"/>
                <circle cx="295" cy="115" r="2" fill="hsl(var(--secondary))"/>
                <circle cx="305" cy="115" r="2" fill="hsl(var(--accent))"/>
                
                {/* Wireless signals */}
                <g stroke="hsl(var(--primary))" strokeWidth="1" fill="none" opacity="0.6">
                  <path d="M85 130 Q140 110 260 110"/>
                  <path d="M195 130 Q200 110 260 115"/>
                  <path d="M140 170 Q200 150 260 125"/>
                </g>
                
                {/* Phone with app */}
                <rect x="340" y="180" width="40" height="70" rx="8" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2"/>
                <rect x="345" y="190" width="30" height="20" rx="2" fill="hsl(var(--primary))" opacity="0.8"/>
                <rect x="345" y="215" width="30" height="3" rx="1" fill="hsl(var(--muted-foreground))"/>
                <rect x="345" y="220" width="20" height="3" rx="1" fill="hsl(var(--muted-foreground))"/>
                <circle cx="360" cy="235" r="8" fill="hsl(var(--secondary))" opacity="0.8"/>
                <Smartphone className="w-4 h-4 text-secondary-foreground" x="356" y="231"/>
              </svg>
              
              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 animate-pulse">
                <Badge className="bg-secondary text-secondary-foreground">
                  <Shield className="w-3 h-3 mr-1" />
                  Protected
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}