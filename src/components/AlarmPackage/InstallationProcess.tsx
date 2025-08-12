import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Users, Smartphone, Award } from 'lucide-react';

const steps = [
  {
    icon: Users,
    title: 'Free Consultation',
    description: 'Our technician visits to assess your property and confirm the best sensor placement',
    duration: '30-45 mins',
    details: [
      'Site survey and security assessment',
      'Explain how the system works',
      'Confirm installation requirements',
      'Answer any questions'
    ]
  },
  {
    icon: CheckCircle,
    title: 'Professional Installation',
    description: 'Clean, discrete installation with minimal disruption to your day',
    duration: '4-6 hours typical',
    details: [
      'Mount control panel and sensors',
      'Run cables (where required)',
      'Install keypads and sirens',
      'Thorough system testing'
    ]
  },
  {
    icon: Smartphone,
    title: 'Programming & Setup',
    description: 'Complete system configuration and mobile app setup',
    duration: '30 mins',
    details: [
      'Program all sensors and zones',
      'Set up user codes',
      'Install and configure mobile app',
      'Test all functions together'
    ]
  },
  {
    icon: Award,
    title: 'Handover & Training',
    description: 'Learn how to use your system confidently',
    duration: '30 mins',
    details: [
      'Complete operation walkthrough',
      'Practice arming and disarming',
      'Understand app notifications',
      'Receive warranty documentation'
    ]
  }
];

export function InstallationProcess() {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Installation Process</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional installation with minimal disruption. Most homes completed in a single day.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            
            return (
              <Card key={index} className="relative">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Step {index + 1}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-semibold">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-primary">{step.duration}</span>
                    </div>

                    <ul className="space-y-1">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="text-xs text-muted-foreground flex items-start gap-2">
                          <CheckCircle className="w-3 h-3 text-primary mt-0.5 shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>

                {index < steps.length - 1 && (
                  <div className="hidden xl:block absolute -right-3 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        <div className="mt-12 bg-primary/5 rounded-lg p-6 border border-primary/20">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">Ready to Get Started?</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Book your free consultation today. No obligation, no pressure – just honest advice 
              about the best security solution for your property.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                ✓ 2-year workmanship warranty
              </Badge>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                ✓ 3-year product warranty
              </Badge>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                ✓ Local Australian support
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}