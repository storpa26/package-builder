import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="space-y-6">
            <Badge variant="secondary" className="text-primary">
              CheapAlarms.com.au
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold">
              Professional Security Systems
              <span className="block text-primary">Installed Right</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Australian-made security systems with professional installation. 
              Trusted protection for homes and businesses across Australia.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary-hover">
                <Link to="/alarm-package">
                  View Packages <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg">
                Get Free Quote
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Professional Installation</h3>
                <p className="text-sm text-muted-foreground">
                  Expert technicians ensure your system is installed perfectly the first time
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Star className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Australian Made</h3>
                <p className="text-sm text-muted-foreground">
                  Equipment tested for Australian conditions with local support
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Warranty Protection</h3>
                <p className="text-sm text-muted-foreground">
                  2-year workmanship + 3-year product warranty for complete peace of mind
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
