import type { Addon } from '@/types';
import { assumptions, Context } from '@/data/assumptions';

export interface SelectedAddon {
  id: string;
  quantity: number;
}

export interface RuleValidation {
  inputsUsed: number;
  powerUsed: number;
  keypadsUsed: number;
  touchscreensUsed: number;
  autoAppendedItems: SelectedAddon[];
  violations: string[];
  warnings: string[];
}

export interface CapacityLimits {
  inputs: { used: number; max: number; threshold: number };
  power: { used: number; max: number };
  keypads: { used: number; max: number };
  touchscreens: { used: number; threshold: number };
}

export class RulesEngine {
  private addons: Addon[];
  
  constructor(addons: Addon[]) {
    this.addons = addons;
  }

  private getAddonById(id: string): Addon | undefined {
    return this.addons.find(addon => addon.id === id);
  }

  validateSelection(selectedAddons: SelectedAddon[]): RuleValidation {
    const validation: RuleValidation = {
      inputsUsed: 0,
      powerUsed: 0,
      keypadsUsed: 0,
      touchscreensUsed: 0,
      autoAppendedItems: [],
      violations: [],
      warnings: []
    };

    // Calculate current usage
    selectedAddons.forEach(selection => {
      const addon = this.getAddonById(selection.id);
      if (!addon || addon.isAutoAppended) return;

      if (addon.consumesInput) {
        validation.inputsUsed += selection.quantity;
      }
      
      validation.powerUsed += addon.powerMilliAmps * selection.quantity;
      
      if (addon.type === 'keypad') {
        validation.keypadsUsed += selection.quantity;
        if (addon.isTouchscreen) {
          validation.touchscreensUsed += selection.quantity;
        }
      }
    });

    // Check for required auto-appended items
    this.checkInputExpander(validation);
    this.checkAdditionalPSU(validation);

    // Check for violations
    this.checkViolations(validation);

    return validation;
  }

  private checkInputExpander(validation: RuleValidation) {
    if (validation.inputsUsed > assumptions.onboardInputs) {
      const expandersNeeded = Math.ceil((validation.inputsUsed - assumptions.onboardInputs) / 8);
      const existingExpanders = validation.autoAppendedItems.filter(item => item.id === 'expander').length;
      
      if (expandersNeeded > existingExpanders) {
        validation.autoAppendedItems.push({
          id: 'expander',
          quantity: expandersNeeded - existingExpanders
        });
        
        // Add power consumption from expanders
        const expanderAddon = this.getAddonById('expander');
        if (expanderAddon) {
          validation.powerUsed += expanderAddon.powerMilliAmps * (expandersNeeded - existingExpanders);
        }
      }
    }
  }

  private checkAdditionalPSU(validation: RuleValidation) {
    const needsPSU = validation.powerUsed > assumptions.powerBudgetMilliAmps || 
                     validation.touchscreensUsed > assumptions.touchscreenThreshold;
    
    if (needsPSU) {
      const existingPSUs = validation.autoAppendedItems.filter(item => item.id === 'psu').length;
      if (existingPSUs === 0) {
        validation.autoAppendedItems.push({
          id: 'psu',
          quantity: 1
        });
      }
    }
  }

  private checkViolations(validation: RuleValidation) {
    if (validation.inputsUsed > assumptions.inputLimit) {
      validation.violations.push(`Maximum ${assumptions.inputLimit} sensors supported. Currently selected: ${validation.inputsUsed}`);
    }

    if (validation.keypadsUsed > assumptions.maxKeypads) {
      validation.violations.push(`Maximum ${assumptions.maxKeypads} keypads supported. Currently selected: ${validation.keypadsUsed}`);
    }

    // Warnings
    if (validation.inputsUsed > assumptions.onboardInputs && validation.inputsUsed <= assumptions.inputLimit) {
      validation.warnings.push('Input expander required for more than 8 sensors');
    }

    if (validation.touchscreensUsed > assumptions.touchscreenThreshold) {
      validation.warnings.push('Additional power supply required for multiple touchscreens');
    }
  }

  getCapacityLimits(selectedAddons: SelectedAddon[]): CapacityLimits {
    const validation = this.validateSelection(selectedAddons);
    
    return {
      inputs: {
        used: validation.inputsUsed,
        max: assumptions.inputLimit,
        threshold: assumptions.onboardInputs
      },
      power: {
        used: validation.powerUsed,
        max: assumptions.powerBudgetMilliAmps
      },
      keypads: {
        used: validation.keypadsUsed,
        max: assumptions.maxKeypads
      },
      touchscreens: {
        used: validation.touchscreensUsed,
        threshold: assumptions.touchscreenThreshold
      }
    };
  }

  calculateTotal(selectedAddons: SelectedAddon[], context: Context): number {
    const validation = this.validateSelection(selectedAddons);
    let total = assumptions.basePrice[context];

    // Add selected addons
    selectedAddons.forEach(selection => {
      const addon = this.getAddonById(selection.id);
      if (addon && !addon.isAutoAppended) {
        total += addon.unitPrice[context] * selection.quantity;
      }
    });

    // Add auto-appended items
    validation.autoAppendedItems.forEach(item => {
      const addon = this.getAddonById(item.id);
      if (addon) {
        total += addon.unitPrice[context] * item.quantity;
      }
    });

    return total;
  }
}