import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Calculator } from 'lucide-react';
import { AddonCard } from './AddonCard';
import { AddonModal } from './AddonModal';
import { CapacityMeter } from './CapacityMeter';
import { addons } from '@/data/addons';
import type { Addon } from '@/types';
import { Context } from '@/data/assumptions';
import { SelectedAddon, RulesEngine } from '@/lib/rules';
import { formatCurrency } from '@/lib/quote';

interface AddOnsSectionProps {
  context: Context;
  selectedAddons: SelectedAddon[];
  onUpdateAddons: (addons: SelectedAddon[]) => void;
  estimatedTotal: number;
  onAddToQuote: () => void;
}

export function AddOnsSection({ 
  context, 
  selectedAddons, 
  onUpdateAddons, 
  estimatedTotal,
  onAddToQuote 
}: AddOnsSectionProps) {
  const [selectedAddon, setSelectedAddon] = useState<Addon | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const rulesEngine = new RulesEngine(addons);
  const validation = rulesEngine.validateSelection(selectedAddons);
  const capacityLimits = rulesEngine.getCapacityLimits(selectedAddons);

  // Filter out auto-appended items from the main grid
  const userSelectableAddons = addons.filter(addon => !addon.isAutoAppended);

  const getSelectedQuantity = (addonId: string) => {
    const selected = selectedAddons.find(s => s.id === addonId);
    return selected ? selected.quantity : 0;
  };

  const handleAddonClick = (addon: Addon) => {
    setSelectedAddon(addon);
    setIsModalOpen(true);
  };

  const handleSaveSelection = (quantity: number, include: boolean) => {
    if (!selectedAddon) return;

    const updatedAddons = selectedAddons.filter(s => s.id !== selectedAddon.id);
    if (include && quantity > 0) {
      updatedAddons.push({ id: selectedAddon.id, quantity });
    }

    onUpdateAddons(updatedAddons);
  };

  const getAutoAppendedItems = () => {
    return validation.autoAppendedItems.map(item => {
      const addon = addons.find(a => a.id === item.id);
      return addon ? { addon, quantity: item.quantity } : null;
    }).filter(Boolean);
  };

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Add-Ons & Upgrades</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Customize your security system with additional sensors and features
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {userSelectableAddons.map(addon => (
                <AddonCard
                  key={addon.id}
                  addon={addon}
                  context={context}
                  selectedQuantity={getSelectedQuantity(addon.id)}
                  onClick={() => handleAddonClick(addon)}
                />
              ))}
            </div>

            {/* Auto-appended items */}
            {validation.autoAppendedItems.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-primary" />
                  Required Additions
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getAutoAppendedItems().map(({ addon, quantity }) => (
                    <AddonCard
                      key={`auto-${addon!.id}`}
                      addon={addon!}
                      context={context}
                      selectedQuantity={quantity}
                      isAutoAppended={true}
                      onClick={() => {}}
                    />
                  ))}
                </div>
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Why these items?</strong> Your selected configuration requires additional 
                    components to ensure proper system operation and comply with Australian standards.
                  </p>
                </div>
              </div>
            )}

            {/* Violations */}
            {validation.violations.length > 0 && (
              <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">Configuration Issues</h4>
                <ul className="space-y-1">
                  {validation.violations.map((violation, index) => (
                    <li key={index} className="text-sm text-red-700">• {violation}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <CapacityMeter limits={capacityLimits} />

            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-primary" />
                  Estimated Total
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {formatCurrency(estimatedTotal)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Including professional installation
                  </p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Base package:</span>
                    <span>{formatCurrency(estimatedTotal - validation.autoAppendedItems.reduce((sum, item) => {
                      const addon = addons.find(a => a.id === item.id);
                      return sum + (addon ? addon.unitPrice[context] * item.quantity : 0);
                    }, 0) - selectedAddons.reduce((sum, item) => {
                      const addon = addons.find(a => a.id === item.id);
                      return sum + (addon && !addon.isAutoAppended ? addon.unitPrice[context] * item.quantity : 0);
                    }, 0))}</span>
                  </div>
                  
                  {selectedAddons.length > 0 && (
                    <div className="space-y-1">
                      <div className="font-medium">Selected Add-ons:</div>
                      {selectedAddons.map((selection) => {
                        const addon = addons.find(a => a.id === selection.id);
                        if (!addon || addon.isAutoAppended) return null;
                        return (
                          <div key={selection.id} className="flex justify-between text-xs pl-2">
                            <span>{addon.name} × {selection.quantity}</span>
                            <span>{formatCurrency(addon.unitPrice[context] * selection.quantity)}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  
                  {validation.autoAppendedItems.length > 0 && (
                    <div className="space-y-1">
                      <div className="font-medium text-yellow-700">Required Add-ons:</div>
                      {validation.autoAppendedItems.map((item) => {
                        const addon = addons.find(a => a.id === item.id);
                        if (!addon) return null;
                        return (
                          <div key={item.id} className="flex justify-between text-xs pl-2 text-yellow-700">
                            <span>{addon.name} × {item.quantity}</span>
                            <span>{formatCurrency(addon.unitPrice[context] * item.quantity)}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <Button 
                  onClick={onAddToQuote}
                  className="w-full bg-primary hover:bg-primary-hover"
                  size="lg"
                  disabled={validation.violations.length > 0}
                >
                  Add to Quote
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Final price may vary based on site conditions and installation requirements
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <AddonModal
          addon={selectedAddon}
          context={context}
          isOpen={isModalOpen}
          currentQuantity={selectedAddon ? getSelectedQuantity(selectedAddon.id) : 0}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveSelection}
        />
      </div>
    </section>
  );
}