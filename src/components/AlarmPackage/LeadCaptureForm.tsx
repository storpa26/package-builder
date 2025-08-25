import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, User, Mail, Phone } from 'lucide-react';

export interface LeadData {
  name: string;
  email: string;
  phone: string;
}

interface LeadCaptureFormProps {
  onSubmit: (leadData: LeadData) => void;
  isLoading?: boolean;
}

export function LeadCaptureForm({ onSubmit, isLoading = false }: LeadCaptureFormProps) {
  const [formData, setFormData] = useState<LeadData>({
    name: '',
    email: '',
    phone: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof LeadData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center gap-2 text-lg">
          <ShoppingCart className="h-5 w-5" />
          Add to Cart
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Get your personalized quote and explore add-on options
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
              <User className="h-4 w-4" />
              Name
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
              <Mail className="h-4 w-4" />
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium">
              <Phone className="h-4 w-4" />
              Phone
            </label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Processing...
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </>
            )}
          </Button>
          
          <p className="text-xs text-muted-foreground text-center">
            No spam, just your personalized security solution
          </p>
        </form>
      </CardContent>
    </Card>
  );
}