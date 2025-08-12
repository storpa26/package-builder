import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Hero } from '@/components/AlarmPackage/Hero';
import { PackageInclusions } from '@/components/AlarmPackage/PackageInclusions';
import { ContextSwitcher } from '@/components/AlarmPackage/ContextSwitcher';
import { AddOnsSection } from '@/components/AlarmPackage/AddOnsSection';
import { TechSpecs } from '@/components/AlarmPackage/TechSpecs';
import { InstallationProcess } from '@/components/AlarmPackage/InstallationProcess';
import { StickyEstimator } from '@/components/AlarmPackage/StickyEstimator';
import { Context, assumptions, defaultChips } from '@/data/assumptions';
import { addons } from '@/data/addons';
import { SelectedAddon, RulesEngine } from '@/lib/rules';
import { sendQuote, QuotePayload } from '@/lib/quote';
import { useToast } from '@/hooks/use-toast';

export default function AlarmPackage() {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  // State management
  const [context, setContext] = useState<Context>('residential');
  const [selectedAddons, setSelectedAddons] = useState<SelectedAddon[]>([]);
  const [wizardAnswers, setWizardAnswers] = useState<Record<string, any>>({});

  // Initialize from URL parameters (wizard integration)
  useEffect(() => {
    const contextParam = searchParams.get('context') as Context;
    if (contextParam && ['residential', 'retail', 'office', 'warehouse'].includes(contextParam)) {
      setContext(contextParam);
    }

    // Parse wizard answers from URL
    const answersParam = searchParams.get('answers');
    if (answersParam) {
      try {
        const answers = JSON.parse(decodeURIComponent(answersParam));
        setWizardAnswers(answers);
        
        // Optionally preselect add-ons based on answers
        // This would be customized based on your wizard logic
        if (answers.hasOutdoorAccess) {
          setSelectedAddons(prev => [...prev, { id: 'outpir', quantity: 2 }]);
        }
      } catch (error) {
        console.error('Failed to parse wizard answers:', error);
      }
    }
  }, [searchParams]);

  // Rules engine and calculations
  const rulesEngine = new RulesEngine(addons);
  const validation = rulesEngine.validateSelection(selectedAddons);
  const estimatedTotal = rulesEngine.calculateTotal(selectedAddons, context);

  const currentAssumptions = defaultChips[context];
  const basePrice = assumptions.basePrice[context];

  const handleGetPackage = async () => {
    const payload: QuotePayload = {
      package: 'Hybrid Wireless Alarm (Installed)',
      context,
      answers: wizardAnswers,
      base: basePrice,
      addons: selectedAddons.map(selection => {
        const addon = addons.find(a => a.id === selection.id);
        return {
          id: selection.id,
          name: addon?.name || 'Unknown',
          qty: selection.quantity,
          price: addon?.unitPrice[context] || 0
        };
      }),
      autoItems: validation.autoAppendedItems.map(item => {
        const addon = addons.find(a => a.id === item.id);
        return {
          id: item.id,
          name: addon?.name || 'Unknown',
          qty: item.quantity,
          price: addon?.unitPrice[context] || 0
        };
      }),
      estimatedTotal,
      timestamp: new Date()
    };

    try {
      await sendQuote(payload);
      toast({
        title: "Quote request submitted!",
        description: "We'll contact you within 24 hours to discuss your security needs.",
      });
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again or call us directly.",
        variant: "destructive"
      });
    }
  };

  const handleGetQuote = () => {
    // For now, same as Get Package, but could be different flow
    handleGetPackage();
  };

  const handleContextChange = (newContext: Context) => {
    setContext(newContext);
    // Could add analytics tracking here
  };

  return (
    <div className="min-h-screen bg-background">
      <Hero
        context={context}
        basePrice={basePrice}
        onGetPackage={handleGetPackage}
        onGetQuote={handleGetQuote}
      />

      <PackageInclusions context={context} />

      <div className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <ContextSwitcher
            currentContext={context}
            onContextChange={handleContextChange}
            assumptions={currentAssumptions}
          />
        </div>
      </div>

      <AddOnsSection
        context={context}
        selectedAddons={selectedAddons}
        onUpdateAddons={setSelectedAddons}
        estimatedTotal={estimatedTotal}
        onAddToQuote={handleGetPackage}
      />

      <TechSpecs />

      <InstallationProcess />

      <StickyEstimator
        estimatedTotal={estimatedTotal}
        selectedAddons={selectedAddons}
        autoAppendedItems={validation.autoAppendedItems}
        context={context}
        basePrice={basePrice}
        onGetPackage={handleGetPackage}
        className="lg:hidden"
      />

      {/* Add some bottom padding for mobile sticky bar */}
      <div className="h-20 lg:h-0" />
    </div>
  );
}