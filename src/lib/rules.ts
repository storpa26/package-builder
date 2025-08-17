import type { Addon } from '@/types';
import { assumptions, Context } from '@/data/assumptions';

export interface SelectedAddon {
  id: string;
  quantity: number;
}

export interface AutoAppendedItem extends SelectedAddon {
  reason: string;
}

export interface RuleValidation {
  inputsUsed: number;
  powerUsed: number;
  keypadsUsed: number;
  touchscreensUsed: number;
  autoAppendedItems: AutoAppendedItem[];
  violations: string[];
  warnings: string[];
  canIncrement: (addonId: string, currentQty: number) => { allowed: boolean; reason?: string };
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
      warnings: [],
      canIncrement: (addonId: string, currentQty: number) => this.canIncrementQuantity(addonId, currentQty, selectedAddons)
    };

    // Calculate current usage
    selectedAddons.forEach(selection => {
      const addon = this.getAddonById(selection.id);
      if (!addon || addon.isAutoAppended) return;

      if (addon.consumesInput) {
        validation.inputsUsed += selection.quantity;
      }
      
      // Handle undefined powerMilliAmps
      const power = addon.powerMilliAmps || 0;
      validation.powerUsed += power * selection.quantity;
      
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
        const additionalExpanders = expandersNeeded - existingExpanders;
        validation.autoAppendedItems.push({
          id: 'expander',
          quantity: additionalExpanders,
          reason: `Auto-added: inputs exceed on-board ${assumptions.onboardInputs}`
        });
        
        // Add power consumption from expanders
        const expanderAddon = this.getAddonById('expander');
        if (expanderAddon) {
          const expanderPower = expanderAddon.powerMilliAmps || 0;
          validation.powerUsed += expanderPower * additionalExpanders;
        }
      }
    }
  }

  private checkAdditionalPSU(validation: RuleValidation) {
    const powerExceeded = validation.powerUsed > assumptions.powerBudgetMilliAmps;
    const touchscreenExceeded = validation.touchscreensUsed > assumptions.touchscreenThreshold;
    const needsPSU = powerExceeded || touchscreenExceeded;
    
    if (needsPSU) {
      const existingPSUs = validation.autoAppendedItems.filter(item => item.id === 'psu').length;
      if (existingPSUs === 0) {
        let reason = 'Auto-added: ';
        if (powerExceeded && touchscreenExceeded) {
          reason += `power budget exceeded (${validation.powerUsed}mA > ${assumptions.powerBudgetMilliAmps}mA) and touchscreen limit exceeded`;
        } else if (powerExceeded) {
          reason += `power budget exceeded (${validation.powerUsed}mA > ${assumptions.powerBudgetMilliAmps}mA)`;
        } else {
          reason += `touchscreen limit exceeded (${validation.touchscreensUsed} > ${assumptions.touchscreenThreshold})`;
        }
        
        validation.autoAppendedItems.push({
          id: 'psu',
          quantity: 1,
          reason
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

  canIncrementQuantity(addonId: string, currentQty: number, selectedAddons: SelectedAddon[]): { allowed: boolean; reason?: string } {
    const addon = this.getAddonById(addonId);
    if (!addon) {
      return { allowed: false, reason: 'Add-on not found' };
    }

    // Check per-item quantity limit
    if (addon.qtyMax && currentQty >= addon.qtyMax) {
      return { 
        allowed: false, 
        reason: `Maximum ${addon.qtyMax} ${addon.name.toLowerCase()} supported by this system` 
      };
    }

    // Simulate the increment to check hard caps
    const testAddons = selectedAddons.map(s => 
      s.id === addonId ? { ...s, quantity: s.quantity + 1 } : s
    );
    if (!selectedAddons.find(s => s.id === addonId)) {
      testAddons.push({ id: addonId, quantity: 1 });
    }

    // Calculate what the usage would be with the increment
    let testInputsUsed = 0;
    let testKeypadsUsed = 0;

    testAddons.forEach(selection => {
      const testAddon = this.getAddonById(selection.id);
      if (!testAddon || testAddon.isAutoAppended) return;

      if (testAddon.consumesInput) {
        testInputsUsed += selection.quantity;
      }
      
      if (testAddon.type === 'keypad') {
        testKeypadsUsed += selection.quantity;
      }
    });

    // Check hard caps
    if (testInputsUsed > assumptions.inputLimit) {
      return { 
        allowed: false, 
        reason: `Maximum ${assumptions.inputLimit} sensors supported. Would exceed limit.` 
      };
    }

    if (testKeypadsUsed > assumptions.maxKeypads) {
      return { 
        allowed: false, 
        reason: `Maximum ${assumptions.maxKeypads} keypads supported. Would exceed limit.` 
      };
    }

    return { allowed: true };
  }

  generateCartPayload(selectedAddons: SelectedAddon[], context: Context): {
    items: Array<{
      id: string;
      quantity: number;
      reason?: string;
      isAutoAppended: boolean;
    }>;
    estimatedTotal: number;
  } {
    const validation = this.validateSelection(selectedAddons);
    const items: Array<{
      id: string;
      quantity: number;
      reason?: string;
      isAutoAppended: boolean;
    }> = [];

    // Add user-selected items
    selectedAddons.forEach(selection => {
      const addon = this.getAddonById(selection.id);
      if (addon && !addon.isAutoAppended) {
        items.push({
          id: selection.id,
          quantity: selection.quantity,
          isAutoAppended: false
        });
      }
    });

    // Add auto-appended items with reasons
    validation.autoAppendedItems.forEach(item => {
      items.push({
        id: item.id,
        quantity: item.quantity,
        reason: item.reason,
        isAutoAppended: true
      });
    });

    const estimatedTotal = this.calculateTotal(selectedAddons, context);

    return { items, estimatedTotal };
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