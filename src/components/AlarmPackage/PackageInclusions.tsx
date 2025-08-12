import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Star } from 'lucide-react';
import { Context } from '@/data/assumptions';

interface PackageInclusionsProps {
  context: Context;
}

const inclusions = [
  'Hybrid control panel with backup battery',
  '3× indoor motion sensors (pet friendly)',
  'Push-button keypad with LED display',
  'Internal siren (110dB)',
  'External siren with strobe light',
  'Professional installation & programming',
  'Mobile app setup & training',
  'System testing & handover'
];

const contextBestFor: Record<Context, string> = {
  residential: 'Perfect for homes up to 200m² with standard security needs',
  retail: 'Ideal for small shops and cafes with customer entry points',
  office: 'Great for professional offices with staff access control',
  warehouse: 'Designed for larger spaces with perimeter protection'
};

export function PackageInclusions({ context }: PackageInclusionsProps) {
  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What's Included in Your Package</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need for complete security protection, professionally installed and configured
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-6">Package Includes</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {inclusions.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-primary" />
                  <Badge variant="secondary">Best For</Badge>
                </div>
                <p className="text-sm font-medium">{contextBestFor[context]}</p>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <h4 className="font-semibold mb-3">Customer Feedback</h4>
                <blockquote className="text-sm italic">
                  "Installation was quick and professional. The app is so easy to use, 
                  and we love being able to check on our home from anywhere."
                </blockquote>
                <footer className="text-xs text-muted-foreground mt-2">
                  — Sarah M., Melbourne
                </footer>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardContent className="p-6">
                <h4 className="font-semibold mb-2">Our Guarantee</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span>2-year workmanship warranty</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span>3-year product warranty</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span>Australian conditions tested</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}