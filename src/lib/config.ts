// Configuration layer for WordPress + WooCommerce integration
// All URLs/IDs live here - update env values after generation

export const config = {
  wordpress: {
    baseUrl: import.meta.env.VITE_WP_BASE_URL || 'https://cheapalarms.com.au',
    storeApiBase: import.meta.env.VITE_WC_STORE_API_BASE || 'https://cheapalarms.com.au/wp-json/wc/store/v1',
    restApiBase: import.meta.env.VITE_WP_REST_BASE || 'https://cheapalarms.com.au/wp-json',
    validateEndpoint: import.meta.env.VITE_VALIDATE_ENDPOINT || 'https://cheapalarms.com.au/wp-json/ca/v1/alarm/validate',
    checkoutUrl: import.meta.env.VITE_WOO_CHECKOUT_URL || 'https://cheapalarms.com.au/checkout/',
  },
  
  // System limits and pricing (temporary until moved to backend)
  system: {
    basePrice: {
      residential: 1295,
      retail: 1495,
      office: 1495,
      warehouse: 1795
    },
    limits: {
      inputs: 32,
      onboardInputs: 8,
      keypads: 8,
      powerBudget: 1000, // mA
      touchscreenThreshold: 2
    },
    includedRunMeters: {
      residential: 20,
      retail: 25,
      office: 25,
      warehouse: 50
    }
  },
  
  // Product configuration
  products: {
    addonCategory: 'alarm-addon', // WooCommerce category for add-on products
    baseProductSlug: 'hybrid-wireless-alarm-system' // Base package product
  }
} as const;

export type Context = 'residential' | 'retail' | 'office' | 'warehouse';