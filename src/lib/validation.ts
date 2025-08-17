import { config, type ValidationItem, type ValidationResult, type ProductAttributes, type Context } from './config';
import { v4 as uuidv4 } from 'uuid';

// Fallback mapping for when product attributes are missing
const FALLBACK_MAPPING: Array<{ pattern: RegExp; attributes: ProductAttributes }> = [
  {
    pattern: /^outdoor.*motion.*sensor/i,
    attributes: { type: 'sensor', consumes_input: true, power_ma: 25, is_touchscreen: false, qty_max: 8 }
  },
  {
    pattern: /^touchscreen.*keypad/i,
    attributes: { type: 'keypad', consumes_input: false, power_ma: 90, is_touchscreen: true, qty_max: 4 }
  },
  {
    pattern: /^wireless.*keypad/i,
    attributes: { type: 'keypad', consumes_input: false, power_ma: 20, is_touchscreen: false, qty_max: 8 }
  },
  {
    pattern: /^panic.*button/i,
    attributes: { type: 'sensor', consumes_input: true, power_ma: 5, is_touchscreen: false, qty_max: 6 }
  },
  {
    pattern: /^input.*expander/i,
    attributes: { type: 'expander', consumes_input: false, power_ma: 40, is_touchscreen: false, qty_max: 10 }
  },
  {
    pattern: /^additional.*psu/i,
    attributes: { type: 'psu', consumes_input: false, power_ma: 0, is_touchscreen: false, qty_max: 10 }
  }
];

/**
 * Get product attributes using fallback mapping if not provided
 */
function getProductAttributes(item: ValidationItem): ProductAttributes {
  if (item.attributes) {
    return item.attributes;
  }

  // Use fallback mapping
  for (const mapping of FALLBACK_MAPPING) {
    if (mapping.pattern.test(item.title)) {
      return mapping.attributes;
    }
  }

  // Default fallback
  return {
    type: 'accessory',
    consumes_input: false,
    power_ma: 10,
    is_touchscreen: false,
    qty_max: 10
  };
}

/**
 * Calculate estimated total for items (placeholder - needs actual pricing logic)
 */
function calculateEstimatedTotal(items: ValidationItem[], context: Context): number {
  // This is a placeholder - you'll need to implement actual pricing logic
  // based on your existing pricing system
  return items.reduce((total, item) => {
    // Base price per item (this should come from your actual product pricing)
    const basePrice = 50; // Placeholder
    const contextMultiplier = context === 'warehouse' ? 1.3 : context === 'retail' || context === 'office' ? 1.15 : 1;
    return total + (basePrice * contextMultiplier * item.qty);
  }, 0);
}

/**
 * Main validation function
 */
export function validateAlarmAddons(
  items: ValidationItem[],
  context: Context = 'residential'
): ValidationResult {
  const {
    MAX_INPUTS,
    ONBOARD_INPUTS,
    EXPANDER_CAPACITY,
    POWER_BUDGET_MA,
    PSU_CAPACITY_MA,
    MAX_KEYPADS,
    TOUCHSCREEN_THRESHOLD,
    AUTO_ITEMS
  } = config.validation;

  const normalized: ValidationItem[] = [];
  const autoAppended: Array<{ item: ValidationItem; reason: string }> = [];
  const notices: string[] = [];
  const errors: string[] = [];
  const groupId = uuidv4();

  // Step 1: Normalize each item and enforce per-item quantity caps
  for (const item of items) {
    const attributes = getProductAttributes(item);
    let qty = item.qty;

    // Enforce per-item quantity caps
    if (attributes.qty_max && qty > attributes.qty_max) {
      notices.push(`${item.title}: quantity reduced from ${qty} to ${attributes.qty_max} (maximum allowed)`);
      qty = attributes.qty_max;
    }

    normalized.push({
      ...item,
      qty,
      attributes
    });
  }

  // Step 2: Calculate capacity requirements
  let inputsUsed = 0;
  let keypadsCount = 0;
  let touchscreensCount = 0;
  let totalPower = 0;

  for (const item of normalized) {
    const attrs = item.attributes!;
    
    if (attrs.consumes_input) {
      inputsUsed += item.qty;
    }
    
    if (attrs.type === 'keypad') {
      keypadsCount += item.qty;
      if (attrs.is_touchscreen) {
        touchscreensCount += item.qty;
      }
    }
    
    totalPower += attrs.power_ma * item.qty;
  }

  // Step 3: Validate global limits
  if (inputsUsed > MAX_INPUTS) {
    errors.push(`Total inputs (${inputsUsed}) exceed maximum capacity (${MAX_INPUTS}). Please reduce sensor quantities.`);
  }

  if (keypadsCount > MAX_KEYPADS) {
    errors.push(`Total keypads (${keypadsCount}) exceed maximum capacity (${MAX_KEYPADS}). Please reduce keypad quantities.`);
  }

  // Step 4: Calculate and auto-append expanders
  const expandersNeeded = Math.max(0, Math.ceil((inputsUsed - ONBOARD_INPUTS) / EXPANDER_CAPACITY));
  
  if (expandersNeeded > 0) {
    const expanderItem: ValidationItem = {
      id: AUTO_ITEMS.EXPANDER.productId,
      title: AUTO_ITEMS.EXPANDER.title,
      qty: expandersNeeded,
      attributes: AUTO_ITEMS.EXPANDER
    };
    
    autoAppended.push({
      item: expanderItem,
      reason: `Auto-added Input Expander ×${expandersNeeded}: inputs exceed on-board capacity (used ${inputsUsed} / onboard ${ONBOARD_INPUTS}).`
    });
    
    notices.push(`Auto-added Input Expander ×${expandersNeeded}: inputs exceed on-board capacity (used ${inputsUsed} / onboard ${ONBOARD_INPUTS}).`);
    
    // Add expander power consumption to total
    totalPower += AUTO_ITEMS.EXPANDER.power_ma * expandersNeeded;
  }

  // Step 5: Calculate and auto-append PSUs
  const psuNeededByPower = totalPower > POWER_BUDGET_MA;
  const psuNeededByTouch = touchscreensCount > TOUCHSCREEN_THRESHOLD;
  
  const psusNeeded = Math.max(
    Math.ceil(Math.max(totalPower - POWER_BUDGET_MA, 0) / PSU_CAPACITY_MA),
    (psuNeededByTouch ? 1 : 0)
  );

  if (psusNeeded > 0) {
    const psuItem: ValidationItem = {
      id: AUTO_ITEMS.PSU.productId,
      title: AUTO_ITEMS.PSU.title,
      qty: psusNeeded,
      attributes: AUTO_ITEMS.PSU
    };
    
    let reason = `Auto-added PSU ×${psusNeeded}: `;
    const reasons = [];
    
    if (psuNeededByPower) {
      reasons.push(`total device draw ${totalPower} mA exceeds budget ${POWER_BUDGET_MA} mA`);
    }
    
    if (psuNeededByTouch) {
      reasons.push(`touchscreen count ${touchscreensCount} above threshold ${TOUCHSCREEN_THRESHOLD}`);
    }
    
    reason += reasons.join(' / ') + '.';
    
    autoAppended.push({
      item: psuItem,
      reason
    });
    
    notices.push(reason);
  }

  // Step 6: Calculate estimated total
  const allItems = [...normalized, ...autoAppended.map(a => a.item)];
  const estimatedTotal = calculateEstimatedTotal(allItems, context);

  // Step 7: Build result
  const result: ValidationResult = {
    normalized,
    autoAppended,
    capacity: {
      inputsUsed,
      MAX_INPUTS,
      keypadsCount,
      MAX_KEYPADS,
      touchscreensCount,
      TOUCHSCREEN_THRESHOLD,
      totalPower,
      POWER_BUDGET_MA
    },
    notices,
    estimatedTotal,
    groupId
  };

  if (errors.length > 0) {
    result.errors = errors;
  }

  return result;
}

/**
 * Check if validation result has blocking errors
 */
export function hasBlockingErrors(result: ValidationResult): boolean {
  return result.errors !== undefined && result.errors.length > 0;
}