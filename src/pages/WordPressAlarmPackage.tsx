import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Hero } from '@/components/AlarmPackage/WordPressHero';
import { PackageInclusions } from '@/components/AlarmPackage/PackageInclusions';
import { ContextSwitcher } from '@/components/AlarmPackage/ContextSwitcher';
import { AddOnsSection } from '@/components/AlarmPackage/AddOnsSection';
import { TechSpecs } from '@/components/AlarmPackage/TechSpecs';
import { InstallationProcess } from '@/components/AlarmPackage/InstallationProcess';
import { StickyEstimator } from '@/components/AlarmPackage/StickyEstimator';
import { config, type Context } from '@/lib/config';
import { wooApi } from '@/lib/api';
import { productIds } from '@/data/ids';
import { addons } from '@/data/addons';
import { assumptions, defaultChips } from '@/data/assumptions';
import type { WooProduct, Selection, ValidationResult } from '@/types';
import { SelectedAddon, RulesEngine } from '@/lib/rules';
import { useToast } from '@/hooks/use-toast';

export default function WordPressAlarmPackage() {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  // State management
  const [context, setContext] = useState<Context>('residential');
  const [selectedAddons, setSelectedAddons] = useState<SelectedAddon[]>([]);
  const [wizardAnswers, setWizardAnswers] = useState<Record<string, any>>({});
  const [wooProducts, setWooProducts] = useState<WooProduct[]>([]);
  const [loading, setLoading] = useState(true);

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
        const answers = JSON.parse(atob(answersParam)); // Base64 decode
        setWizardAnswers(answers);
        
        // Preselect add-ons based on answers
        if (answers.hasOutdoorAccess) {
          setSelectedAddons(prev => [...prev, { id: 'outpir', quantity: 2 }]);
        }
        if (answers.multiLevel) {
          setSelectedAddons(prev => [...prev, { id: 'smoke', quantity: 2 }]);
        }
      } catch (error) {
        console.error('Failed to parse wizard answers:', error);
      }
    }
  }, [searchParams]);

  // Load WooCommerce products
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        // Replace getProducts with getAlarmAddonProducts
        const products = await wooApi.getAlarmAddonProducts(50);
        setWooProducts(products);
      } catch (error) {
        toast({
          title: "Failed to load products",
          description: "Using offline data instead.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [toast]);

  // Rules engine and calculations
  const rulesEngine = new RulesEngine(addons);
  const validation = rulesEngine.validateSelection(selectedAddons);
  const estimatedTotal = rulesEngine.calculateTotal(selectedAddons, context);

  const currentAssumptions = defaultChips[context];
  const basePrice = config.system.basePrice[context];

  const handleAddToCart = async () => {
    try {
      setLoading(true);

      // Build selection payload
      const selection: Selection = {
        baseProductId: productIds.base[context],
        addons: selectedAddons.map(addon => ({
          id: addon.id,
          qty: addon.quantity
        })),
        context,
        answers: wizardAnswers
      };

      // Validate configuration with WordPress backend
      const validationResult: ValidationResult = await wooApi.validateConfiguration(selection);

      // Add items to WooCommerce cart
      const cartItems = validationResult.normalized.map(item => ({
        id: item.productId,
        quantity: item.qty,
        meta: {
          groupId: item.groupId,
          reason: item.reason || '',
          context,
          timestamp: new Date().toISOString()
        }
      }));

      await wooApi.addItemsToCart(cartItems);

      toast({
        title: "Added to cart!",
        description: `${cartItems.length} items added. Redirecting to checkout...`,
      });

      // Redirect to WooCommerce checkout
      setTimeout(() => {
        window.location.href = config.wordpress.checkoutUrl;
      }, 1500);

    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again or call us directly.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGetQuote = () => {
    // For now, same as Add to Cart
    handleAddToCart();
  };

  const handleContextChange = (newContext: Context) => {
    setContext(newContext);
    // Could add analytics tracking here
  };

  if (loading && wooProducts.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading alarm packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Hero
        context={context}
        basePrice={basePrice}
        onGetPackage={handleAddToCart}
        onGetQuote={handleGetQuote}
      />

      <PackageInclusions context={context} />

      <div className="py-4 px-4">
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
        onAddToQuote={handleAddToCart}
      />

      <TechSpecs />

      <InstallationProcess />

      <StickyEstimator
        estimatedTotal={estimatedTotal}
        selectedAddons={selectedAddons}
        autoAppendedItems={validation.autoAppendedItems}
        context={context}
        basePrice={basePrice}
        onGetPackage={handleAddToCart}
        className="lg:hidden"
      />

      {/* Add some bottom padding for mobile sticky bar */}
      <div className="h-20 lg:h-0" />
    </div>
  );
}

// WordPress integration initializer
export function initAlarmConfigurator(
  rootElement: HTMLElement, 
  overrides: Partial<{ context: Context; answers: Record<string, any> }> = {}
) {
  // This would be implemented with React.render in a real WordPress integration
  // TODO: Implement React.render when integrated with WordPress
  // ReactDOM.render(<WordPressAlarmPackage {...overrides} />, rootElement);
}