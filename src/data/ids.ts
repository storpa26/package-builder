// Map friendly slugs to WooCommerce product IDs
// Fill these after WooCommerce setup

export const productIds = {
  // Base packages by context
  base: {
    residential: 0, // TODO: Set WooCommerce product ID
    retail: 0,      // TODO: Set WooCommerce product ID  
    office: 0,      // TODO: Set WooCommerce product ID
    warehouse: 0    // TODO: Set WooCommerce product ID
  },
  
  // Add-on products (slug -> WooCommerce product ID)
  addons: {
    outpir: 0,      // TODO: Outdoor PIR sensor
    smoke: 0,       // TODO: Smoke detector
    tskp: 0,        // TODO: Touchscreen keypad
    wlkp: 0,        // TODO: Wireless keypad
    panic: 0,       // TODO: Panic button
    glassbreak: 0,  // TODO: Glass break sensor
    shock: 0,       // TODO: Shock sensor
    
    // Auto-appended items
    expander: 0,    // TODO: Input expander
    psu: 0,         // TODO: Additional PSU
  }
} as const;

export type AddonSlug = keyof typeof productIds.addons;