import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Shield, Smartphone, Users, Star } from 'lucide-react';
import { config } from '@/lib/config';
import type { IntercomFormData } from '@/types';

export default function IntercomLanding() {
  const [formData, setFormData] = useState<Partial<IntercomFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.property || !formData.storeys || !formData.ceiling) {
      return;
    }

    setIsSubmitting(true);
    
    // Use the decision logic from config
    const recommendation = config.intercom.routing.getRecommendation(
      formData.property,
      formData.storeys,
      formData.ceiling
    );
    
    const targetUrl = recommendation === 'wired' 
      ? '/intercom-wired/?why=hardwired'
      : '/intercom-wireless/?why=wireless';
    
    // Redirect to the appropriate page
    window.location.href = targetUrl;
  };

  const isFormValid = formData.property && formData.storeys && formData.ceiling;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge 
              variant="secondary" 
              className="mb-4 px-4 py-2 text-sm font-medium"
              style={{ backgroundColor: config.intercom.brandColors.accent2 + '20', color: config.intercom.brandColors.accent2 }}
            >
              Professional Intercom Systems
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ color: config.intercom.brandColors.primary }}>
              Smart Intercom Solutions
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Secure, reliable communication systems for your property. 
              Get a personalized recommendation in under 30 seconds.
            </p>
          </div>

          {/* Value Bullets */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" 
                   style={{ backgroundColor: config.intercom.brandColors.accent1 + '20' }}>
                <Shield className="w-8 h-8" style={{ color: config.intercom.brandColors.accent1 }} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Enhanced Security</h3>
              <p className="text-muted-foreground">See and speak to visitors before granting access</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" 
                   style={{ backgroundColor: config.intercom.brandColors.accent2 + '20' }}>
                <Smartphone className="w-8 h-8" style={{ color: config.intercom.brandColors.accent2 }} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Remote Access</h3>
              <p className="text-muted-foreground">Answer your door from anywhere with mobile app</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" 
                   style={{ backgroundColor: config.intercom.brandColors.accent3 + '20' }}>
                <Users className="w-8 h-8" style={{ color: config.intercom.brandColors.accent3 }} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Multi-User Support</h3>
              <p className="text-muted-foreground">Multiple monitors and access points throughout property</p>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center items-center gap-8 mb-16 opacity-60">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-current" style={{ color: config.intercom.brandColors.highlight1 }} />
              <span className="text-sm font-medium">Professional Installation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" style={{ color: config.intercom.brandColors.accent2 }} />
              <span className="text-sm font-medium">2 Year Warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" style={{ color: config.intercom.brandColors.accent3 }} />
              <span className="text-sm font-medium">Australian Standards</span>
            </div>
          </div>
        </div>
      </section>

      {/* Router Form */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto max-w-2xl">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-2">Get Your Personalized Recommendation</CardTitle>
              <p className="text-muted-foreground">
                Answer 3 quick questions to find the perfect intercom system for your property
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="property" className="text-sm font-medium">
                    Property Type
                  </label>
                  <Select 
                    value={formData.property || ''} 
                    onValueChange={(value: 'residential' | 'retail') => 
                      setFormData(prev => ({ ...prev, property: value }))
                    }
                  >
                    <SelectTrigger id="property">
                      <SelectValue placeholder="Select your property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">Residential (Home/Apartment)</SelectItem>
                      <SelectItem value="retail">Retail (Shop/Office)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="storeys" className="text-sm font-medium">
                    Number of Storeys
                  </label>
                  <Select 
                    value={formData.storeys || ''} 
                    onValueChange={(value: 'single' | 'multi') => 
                      setFormData(prev => ({ ...prev, storeys: value }))
                    }
                  >
                    <SelectTrigger id="storeys">
                      <SelectValue placeholder="Select number of storeys" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single Storey</SelectItem>
                      <SelectItem value="multi">Multi Storey</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="ceiling" className="text-sm font-medium">
                    Ceiling Type
                  </label>
                  <Select 
                    value={formData.ceiling || ''} 
                    onValueChange={(value: 'pitched' | 'drop' | 'flat') => 
                      setFormData(prev => ({ ...prev, ceiling: value }))
                    }
                  >
                    <SelectTrigger id="ceiling">
                      <SelectValue placeholder="Select your ceiling type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pitched">Pitched/Sloped Ceiling</SelectItem>
                      <SelectItem value="drop">Drop/Suspended Ceiling</SelectItem>
                      <SelectItem value="flat">Flat Ceiling</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  type="submit" 
                  className="w-full py-6 text-lg font-semibold"
                  disabled={!isFormValid || isSubmitting}
                  style={{ 
                    backgroundColor: config.intercom.brandColors.accent2,
                    color: 'white'
                  }}
                >
                  {isSubmitting ? 'Getting Recommendation...' : 'Get My Recommendation'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold mb-8">Why Choose Our Intercom Systems?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Wired Systems</h3>
              <ul className="text-left space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-0.5 shrink-0" style={{ color: config.intercom.brandColors.accent2 }} />
                  <span>Most reliable connection</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-0.5 shrink-0" style={{ color: config.intercom.brandColors.accent2 }} />
                  <span>No battery maintenance</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-0.5 shrink-0" style={{ color: config.intercom.brandColors.accent2 }} />
                  <span>Best for permanent installations</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Wireless Systems</h3>
              <ul className="text-left space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-0.5 shrink-0" style={{ color: config.intercom.brandColors.accent1 }} />
                  <span>Quick and easy installation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-0.5 shrink-0" style={{ color: config.intercom.brandColors.accent1 }} />
                  <span>Flexible placement options</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-0.5 shrink-0" style={{ color: config.intercom.brandColors.accent1 }} />
                  <span>Perfect for rentals</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// WordPress integration script for Elementor
// This would be added as an HTML widget in Elementor after the form
export const elementorRedirectScript = `
<script>
// Intercom Router Form Redirect Logic
(function() {
  // Wait for form submission
  document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form[data-intercom-router]');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const property = form.querySelector('[name="property"]').value;
      const storeys = form.querySelector('[name="storeys"]').value;
      const ceiling = form.querySelector('[name="ceiling"]').value;
      
      if (!property || !storeys || !ceiling) return;
      
      // Decision logic: Hardwired if (Residential & Single & (Pitched/Drop)) OR (Retail & Drop ceiling)
      const isHardwired = 
        (property === 'residential' && storeys === 'single' && (ceiling === 'pitched' || ceiling === 'drop')) ||
        (property === 'retail' && ceiling === 'drop');
      
      const targetUrl = isHardwired 
        ? '/intercom-wired/?why=hardwired'
        : '/intercom-wireless/?why=wireless';
      
      window.location.href = targetUrl;
    });
  });
})();
</script>
`;