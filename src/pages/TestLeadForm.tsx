import { LeadCaptureForm, LeadData } from '@/components/AlarmPackage/LeadCaptureForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestLeadForm() {
  const handleLeadSubmit = (leadData: LeadData) => {
    console.log('Lead submitted:', leadData);
  };

  // Example product context
  const productContext = {
    productType: 'Wireless',
    context: 'Residential',
    selectedAddons: ['Door Sensor', 'Motion Detector', 'Touchscreen Keypad'],
    estimatedTotal: 1299,
    productName: 'Hybrid Wireless Alarm System'
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">GoHighLevel Lead Capture Test</h1>
          <p className="text-muted-foreground">
            Test the enhanced lead capture form with Australian validation and GHL integration
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Form with Product Context */}
          <div>
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-lg">With Product Context</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  This form includes product context that will be sent to GoHighLevel
                </p>
              </CardContent>
            </Card>
            
            <LeadCaptureForm 
              onSubmit={handleLeadSubmit}
              productContext={productContext}
            />
          </div>

          {/* Form without Product Context */}
          <div>
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-lg">Without Product Context</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Basic form without product information
                </p>
              </CardContent>
            </Card>
            
            <LeadCaptureForm 
              onSubmit={handleLeadSubmit}
            />
          </div>
        </div>

        {/* Features List */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>✅ Features Implemented</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Form Features:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Australian phone validation (mobile & landline)</li>
                  <li>• 4-digit postcode validation</li>
                  <li>• Real-time error clearing</li>
                  <li>• Success/error message display</li>
                  <li>• Product context integration</li>
                  <li>• Required field validation</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">GoHighLevel Integration:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Automatic contact creation</li>
                  <li>• Custom fields for product data</li>
                  <li>• Automatic tagging</li>
                  <li>• Pipeline support (optional)</li>
                  <li>• Error handling & retry logic</li>
                  <li>• Secure token management</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Data */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>🧪 Test Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Valid Australian Phone Numbers:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• 0412 345 678 (mobile)</li>
                  <li>• +61412345678 (mobile with country code)</li>
                  <li>• 02 9876 5432 (Sydney landline)</li>
                  <li>• 03 9876 5432 (Melbourne landline)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Valid Postcodes:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• 2000 (Sydney CBD)</li>
                  <li>• 3000 (Melbourne CBD)</li>
                  <li>• 4000 (Brisbane CBD)</li>
                  <li>• 6000 (Perth CBD)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}