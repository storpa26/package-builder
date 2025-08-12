import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Shield, Smartphone, Zap, Signal } from 'lucide-react';

export function TechSpecs() {
  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Technical Specifications</h2>
          <p className="text-lg text-muted-foreground">
            Plain English specs – no confusing technical jargon
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="control-panel" className="bg-background rounded-lg border px-6">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                <span className="font-semibold">Control Panel & Hub</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Core Features</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Hybrid wired/wireless capability</li>
                    <li>• 8 onboard sensor inputs</li>
                    <li>• Expandable to 32 total inputs</li>
                    <li>• Built-in cellular communicator</li>
                    <li>• 24-hour backup battery</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Smart Features</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Smartphone app control</li>
                    <li>• Real-time notifications</li>
                    <li>• Remote arm/disarm</li>
                    <li>• Activity history logging</li>
                    <li>• Multiple user codes</li>
                  </ul>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary">Australian Standards Compliant</Badge>
                <Badge variant="secondary">5-Year Warranty</Badge>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="sensors" className="bg-background rounded-lg border px-6">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <Signal className="w-5 h-5 text-primary" />
                <span className="font-semibold">Sensors & Detection</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Motion Sensors</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Pet-friendly up to 25kg</li>
                    <li>• 12m detection range</li>
                    <li>• Anti-masking protection</li>
                    <li>• 3+ year battery life</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Door/Window Sensors</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Instant open/close detection</li>
                    <li>• Tamper-resistant design</li>
                    <li>• Invisible when door closed</li>
                    <li>• 5+ year battery life</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="keypads" className="bg-background rounded-lg border px-6">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-primary" />
                <span className="font-semibold">Keypads & Controls</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Standard Keypad</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• LED status indicators</li>
                    <li>• Audible arm/disarm confirmation</li>
                    <li>• Panic button (optional)</li>
                    <li>• Low-power wireless operation</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Touchscreen Upgrade</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Large, clear display</li>
                    <li>• One-touch arming</li>
                    <li>• System status at a glance</li>
                    <li>• Perfect for multiple users</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="app" className="bg-background rounded-lg border px-6">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-primary" />
                <span className="font-semibold">Mobile App & Monitoring</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">App Features</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Arm/disarm from anywhere</li>
                      <li>• Instant alarm notifications</li>
                      <li>• Live system status</li>
                      <li>• Activity history</li>
                    </ul>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Multiple user access</li>
                      <li>• Geofencing capabilities</li>
                      <li>• Battery level monitoring</li>
                      <li>• iOS & Android compatible</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-primary/5 rounded-lg p-4">
                  <p className="text-sm">
                    <strong>No ongoing fees:</strong> Basic app control and notifications are included. 
                    Optional professional monitoring services available separately.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}