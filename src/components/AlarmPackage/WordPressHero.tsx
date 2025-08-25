import { useState, useEffect } from 'react';
import { Shield, CheckCircle, Smartphone, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Context } from '@/lib/config';
import type { WooProduct } from '@/types';
import { wooApi } from '@/lib/api';
import { assumptions } from '@/data/assumptions';
import { StoreyTypeSelector, StoreyType } from './StoreyTypeSelector';
import { CeilingTypeSelector, CeilingType } from './CeilingTypeSelector';
import { LeadCaptureForm, LeadData } from './LeadCaptureForm';

interface HeroProps {
  context: Context;
  productType: 'wireless' | 'hardwired';
  basePrice: number;
  storeyType: StoreyType | null;
  ceilingType: CeilingType | null;
  onContextChange: (context: Context) => void;
  onStoreyTypeChange: (type: StoreyType) => void;
  onCeilingTypeChange: (type: CeilingType) => void;
  onLeadSubmit: (leadData: LeadData) => void;
  showAddons: boolean;
}

export function Hero({ 
  context, 
  productType, 
  basePrice, 
  storeyType, 
  ceilingType, 
  onContextChange,
  onStoreyTypeChange, 
  onCeilingTypeChange, 
  onLeadSubmit,
  showAddons 
}: HeroProps) {
  const [baseProduct, setBaseProduct] = useState<WooProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBaseProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const product = await wooApi.getBaseAlarmProduct(productType);
        setBaseProduct(product);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load product information');
        setIsLoading(false);
      }
    };

    fetchBaseProduct();
  }, [productType]);

  // Get product data - use WooCommerce data if available, fallback to static
  const fallbackName = productType === 'wireless' ? 'Hybrid Wireless Alarm System' : 'Hardwired Alarm System';
  const fallbackDescription = productType === 'wireless' 
    ? 'Protect what matters most with our expandable wireless security system. Professional installation, 2-year workmanship warranty, and 24/7 monitoring ready.'
    : 'Reliable hardwired security system with professional installation. Built for maximum reliability and performance with 2-year workmanship warranty.';
  
  const productName = baseProduct?.name || fallbackName;
  const productDescription = baseProduct?.short_description ? 
    baseProduct.short_description.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim() :
    fallbackDescription;
  const productPrice = baseProduct ? 
    (parseFloat(baseProduct.prices.price) / (10 ** baseProduct.prices.currency_minor_unit)) : 
    basePrice;

  if (isLoading) {
    return (
      <section className="relative bg-background py-16 px-4 overflow-hidden">
        <div className="container mx-auto max-w-6xl relative">
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <span className="ml-2 text-muted-foreground">Loading product information...</span>
          </div>
        </div>
      </section>
    );
  }

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
              
              {/* Context Switcher - Right in Hero */}
              <div className="flex justify-center gap-3 mb-4">
                <button
                  onClick={() => onContextChange('residential')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    context === 'residential'
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-muted text-muted-foreground hover:bg-primary/10'
                  }`}
                >
                  🏠 Residential
                </button>
                <button
                  onClick={() => onContextChange('retail')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    context === 'retail'
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-muted text-muted-foreground hover:bg-primary/10'
                  }`}
                >
                  🏢 Retail
                </button>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                {productName}
                <span className="text-primary block">(Installed)</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-lg">
                {productDescription}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="px-4 py-2 text-2xl font-bold border-primary/30 text-primary bg-primary/5">
                From ${productPrice.toLocaleString()} installed
              </Badge>
              <span className="text-sm text-muted-foreground">
                {context === 'residential' ? 'Residential' : 'Small Retail'} package
              </span>
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

            {/* Context-based selectors */}
            {context === 'residential' && (
              <div className="pt-6 border-t border-border">
                <StoreyTypeSelector 
                  value={storeyType} 
                  onChange={onStoreyTypeChange} 
                />
              </div>
            )}
            
            {(context === 'retail' || context === 'office' || context === 'warehouse') && (
              <div className="pt-6 border-t border-border">
                <CeilingTypeSelector 
                  value={ceilingType} 
                  onChange={onCeilingTypeChange} 
                />
              </div>
            )}

            {/* Lead Capture Form - Show when sub-selection is made */}
            {((context === 'residential' && storeyType) || 
              ((context === 'retail' || context === 'office' || context === 'warehouse') && ceilingType)) && (
              <div className="pt-6">
                <LeadCaptureForm onSubmit={onLeadSubmit} />
              </div>
            )}
          </div>

          {/* Illustration */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Product Image or Fallback Illustration */}
              {baseProduct?.images && baseProduct.images.length > 0 ? (
                <div className="relative">
                  <img 
                    src={baseProduct.images[0].src}
                    alt={baseProduct.images[0].alt || productName}
                    className="w-full max-w-md h-auto rounded-lg shadow-lg"
                    onError={(e) => {
                      // Fallback to SVG illustration if image fails to load
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'block';
                    }}
                  />
                  {/* Fallback SVG (hidden by default) */}
                  <svg 
                    width="400" 
                    height="300" 
                    viewBox="0 0 400 300" 
                    className="drop-shadow-lg"
                    fill="none"
                    style={{ display: 'none' }}
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
                </div>
              ) : (
                /* Original SVG illustration as fallback */
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
              )}
              
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