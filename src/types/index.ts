// TypeScript definitions for WordPress + WooCommerce integration

export interface Addon {
  id: string;
  name: string;
  summary: string;
  bullets: string[];
  unitPrice: Record<string, number> | number;
  consumesInput?: boolean;
  powerMilliAmps?: number;
  isTouchscreen?: boolean;
  qtyMin: number;
  qtyMax: number;
  type: 'sensor' | 'keypad' | 'controller' | 'psu' | 'expander' | 'accessory';
  isAutoAppended?: boolean;
}

export interface Selection {
  baseProductId: number;
  addons: Array<{
    id: string;
    qty: number;
  }>;
  context: 'residential' | 'retail' | 'office' | 'warehouse';
  answers?: Record<string, any>;
}

export interface ValidationResult {
  normalized: Array<{
    productId: number;
    qty: number;
    reason?: string;
    groupId: string;
  }>;
  autoAppended: Array<{
    productId: number;
    qty: number;
    reason: string;
  }>;
  capacity: {
    inputsUsed: number;
    inputsLimit: number;
    power: number;
    powerLimit: number;
    keypads: number;
    keypadsLimit: number;
    touchscreens: number;
    touchscreenThreshold: number;
  };
  notices: string[];
  estimatedTotal: number;
}

// WooCommerce Store API types
export interface WooProduct {
  id: number;
  name: string;
  description: string;
  short_description: string;
  price: string;
  prices: {
    price: string;
    regular_price: string;
    sale_price: string;
    currency_minor_unit: number;
  };
  slug: string;
  images: Array<{
    id: number;
    src: string;
    name: string;
    alt: string;
  }>;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  meta_data: Array<{
    key: string;
    value: any;
  }>;
}

export interface WooCartItem {
  key: string;
  id: number;
  quantity: number;
  name: string;
  prices: {
    price: string;
    regular_price: string;
    sale_price: string;
    currency_minor_unit: number;

  };
  meta: {
    [key: string]: any;
  };
}

export interface WooCart {
  items: WooCartItem[];
  totals: {
    total_items: string;
    total_items_tax: string;
    total_fees: string;
    total_fees_tax: string;
    total_discount: string;
    total_discount_tax: string;
    total_shipping: string;
    total_shipping_tax: string;
    total_tax: string;
    total_price: string;
  };
  needs_payment: boolean;
  needs_shipping: boolean;
}

// API Headers for nonce handling
export interface ApiHeaders extends Record<string, string> {
  'Content-Type': string;
  'Nonce'?: string;
  'Cart-Token'?: string;
}