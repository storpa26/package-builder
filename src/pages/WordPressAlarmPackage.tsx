import { useState, useEffect, useMemo } from 'react';
// Remove this line: import { useSearchParams } from 'react-router-dom';
import { Hero } from '@/components/AlarmPackage/WordPressHero';
import { PackageInclusions } from '@/components/AlarmPackage/PackageInclusions';
import { ContextSwitcher } from '@/components/AlarmPackage/ContextSwitcher';
import { AddOnsSection } from '@/components/AlarmPackage/AddOnsSection';
// Removed ProductTypeToggle - now using context-based selection
import { TechSpecs } from '@/components/AlarmPackage/TechSpecs';
import { InstallationProcess } from '@/components/AlarmPackage/InstallationProcess';
// Remove this line: import { StickyCartBar } from '@/components/AlarmPackage/StickyCartBar';
import { StoreyType } from '@/components/AlarmPackage/StoreyTypeSelector';
import { CeilingType } from '@/components/AlarmPackage/CeilingTypeSelector';
import { LeadData } from '@/components/AlarmPackage/LeadCaptureForm';
import { config, type Context } from '@/lib/config';
import { wooApi } from '@/lib/api';
import { productIds } from '@/data/ids';
import { addons } from '@/data/addons';
import { assumptions, defaultChips } from '@/data/assumptions';
import type { WooProduct, Selection, ValidationResult } from '@/types';
import { SelectedAddon, RulesEngine } from '@/lib/rules';
import { useToast } from '@/hooks/use-toast';
import type { Addon } from '@/types'; // Add this import

export default function WordPressAlarmPackage() {
  // Replace useSearchParams with URLSearchParams
  const getUrlParams = () => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search);
    }
    return new URLSearchParams();
  };
  
  const { toast } = useToast();
  
  // State management
  const [context, setContext] = useState<Context>('residential');
  // Product type now determined by context + sub-selection
  const [productType, setProductType] = useState<'wireless' | 'hardwired'>('wireless');
  const [storeyType, setStoreyType] = useState<StoreyType | null>(null);
  const [ceilingType, setCeilingType] = useState<CeilingType | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<SelectedAddon[]>([]);
  const [wizardAnswers, setWizardAnswers] = useState<Record<string, unknown>>({});
  const [wooProducts, setWooProducts] = useState<WooProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [leadData, setLeadData] = useState<LeadData | null>(null);

  // Initialize from URL parameters (wizard integration)
  useEffect(() => {
    const searchParams = getUrlParams();
    
    // Get context from URL
    const urlContext = searchParams.get('context') as Context;
    if (urlContext && ['residential', 'retail'].includes(urlContext)) {
      setContext(urlContext);
    }
    
    // Get wizard answers from URL
    const answersParam = searchParams.get('answers');
    if (answersParam) {
      try {
        const answers = JSON.parse(decodeURIComponent(answersParam));
        setWizardAnswers(answers);
      } catch (error) {
        console.warn('Failed to parse wizard answers from URL:', error);
      }
    }
  }, []);

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
  // Add this state to WordPressAlarmPackage component
  const [addonProducts, setAddonProducts] = useState<Addon[]>([]);
  
  // Handler for addon products change
  const handleAddonProductsChange = (products: Addon[]) => {
    setAddonProducts(products);
  };

  // Determine product type based on context and sub-selections
  useEffect(() => {
    if (context === 'residential' && storeyType) {
      // Residential: Single storey = Wireless, Multi storey = Hardwired
      const newProductType = storeyType === 'single' ? 'wireless' : 'hardwired';
      if (newProductType !== productType) {
        setProductType(newProductType);
        setSelectedAddons([]); // Reset selections when product type changes
      }
    } else if ((context === 'retail' || context === 'office' || context === 'warehouse') && ceilingType) {
      // Commercial: Suspended ceiling = Wireless, Concrete ceiling = Hardwired
      const newProductType = ceilingType === 'suspended' ? 'wireless' : 'hardwired';
      if (newProductType !== productType) {
        setProductType(newProductType);
        setSelectedAddons([]); // Reset selections when product type changes
      }
    }
  }, [context, storeyType, ceilingType, productType]);
  
  // Dynamic rules engine based on product type
  const rulesEngine = useMemo(() => {
    return addonProducts.length > 0 
      ? new RulesEngine(addonProducts)
      : new RulesEngine(addons);
  }, [addonProducts]);
  
  const validation = useMemo(() => {
    return rulesEngine.validateSelection(selectedAddons);
  }, [rulesEngine, selectedAddons]);
  
  const estimatedTotal = useMemo(() => {
    return rulesEngine.calculateTotal(selectedAddons, context);
  }, [rulesEngine, selectedAddons, context]);

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

  const handleLeadSubmit = (data: LeadData) => {
    setLeadData(data);
    console.log('Lead captured:', data);
    // TODO: Send to GHL later
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
      {/* Product Type Toggle - At the very top */}
      {/* Removed ProductTypeToggle - now using context-based selection */}

      <Hero
        context={context}
        productType={productType}
        basePrice={basePrice}
        storeyType={storeyType}
        onStoreyTypeChange={setStoreyType}
        ceilingType={ceilingType}
        onCeilingTypeChange={setCeilingType}
        onLeadSubmit={handleLeadSubmit}
        showAddons={selectedAddons.length > 0}
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

      {/* Only show add-ons after lead capture */}
      {leadData && (
        <AddOnsSection
          context={context}
          productType={productType}
          selectedAddons={selectedAddons}
          onUpdateAddons={setSelectedAddons}
          onAddonProductsChange={handleAddonProductsChange}
          estimatedTotal={estimatedTotal}
          onAddToQuote={handleAddToCart}
        />
      )}

      <TechSpecs />

      <InstallationProcess />

      {/* StickyCartBar removed */}

    </div>
  );
    }

    // WordPress integration initializer
    export function initAlarmConfigurator(
      rootElement: HTMLElement, 
      overrides: Partial<{ context: Context; answers: Record<string, unknown> }> = {}
    ) {
      // This would be implemented with React.render in a real WordPress integration
      // TODO: Implement React.render when integrated with WordPress
      // ReactDOM.render(<WordPressAlarmPackage {...overrides} />, rootElement);
    }