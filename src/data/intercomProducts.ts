import type { WooProduct } from '@/types';

// Dummy intercom product data for development and demonstration
export const dummyIntercomBaseProducts: WooProduct[] = [
  {
    id: 1001,
    name: "Wired Video Intercom Base Kit",
    description: "<p>Complete hardwired video intercom system with door station and indoor monitor. Includes all necessary wiring and mounting hardware.</p><ul><li>Crystal clear HD video</li><li>Two-way audio communication</li><li>Night vision capability</li><li>Weather-resistant door station</li><li>7-inch indoor monitor</li></ul>",
    short_description: "Complete wired video intercom system with HD door station and 7-inch monitor",
    price: "899.00",
    prices: {
      price: "899.00",
      regular_price: "899.00",
      sale_price: "",
      currency_minor_unit: 2
    },
    slug: "wired-video-intercom-base-kit",
    images: [
      {
        id: 1,
        src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
        name: "Wired Intercom Kit",
        alt: "Wired video intercom base kit"
      }
    ],
    categories: [
      {
        id: 101,
        name: "Intercom Base",
        slug: "intercom-base"
      }
    ],
    attributes: [
      {
        id: 1,
        name: "wiring",
        options: ["wired"]
      },
      {
        id: 2,
        name: "type",
        options: ["base-kit"]
      }
    ],
    meta_data: []
  },
  {
    id: 1002,
    name: "Wireless Smart Intercom System",
    description: "<p>Modern wireless intercom system with smartphone integration. Easy installation with no wiring required.</p><ul><li>WiFi connectivity</li><li>Mobile app control</li><li>Cloud recording</li><li>Battery powered door station</li><li>Wireless indoor units</li></ul>",
    short_description: "Wireless intercom with smartphone app and cloud features",
    price: "1299.00",
    prices: {
      price: "1299.00",
      regular_price: "1299.00",
      sale_price: "",
      currency_minor_unit: 2
    },
    slug: "wireless-smart-intercom-system",
    images: [
      {
        id: 2,
        src: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop",
        name: "Wireless Intercom",
        alt: "Wireless smart intercom system"
      }
    ],
    categories: [
      {
        id: 101,
        name: "Intercom Base",
        slug: "intercom-base"
      }
    ],
    attributes: [
      {
        id: 1,
        name: "wiring",
        options: ["wireless"]
      },
      {
        id: 2,
        name: "type",
        options: ["base-kit"]
      }
    ],
    meta_data: []
  }
];

export const dummyIntercomAddonProducts: WooProduct[] = [
  {
    id: 2001,
    name: "Additional Door Station",
    description: "<p>Extra door station for secondary entrances. Weather-resistant with HD camera and two-way audio.</p><ul><li>HD video camera</li><li>Built-in microphone and speaker</li><li>Night vision LEDs</li><li>Vandal-resistant design</li><li>Easy installation</li></ul>",
    short_description: "HD door station for additional entrances",
    price: "299.00",
    prices: {
      price: "299.00",
      regular_price: "299.00",
      sale_price: "",
      currency_minor_unit: 2
    },
    slug: "additional-door-station",
    images: [
      {
        id: 3,
        src: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=200&fit=crop",
        name: "Door Station",
        alt: "Additional door station"
      }
    ],
    categories: [
      {
        id: 102,
        name: "Intercom Addon",
        slug: "intercom-addon"
      }
    ],
    attributes: [
      {
        id: 1,
        name: "wiring",
        options: ["both"]
      },
      {
        id: 2,
        name: "type",
        options: ["door-station"]
      }
    ],
    meta_data: []
  },
  {
    id: 2002,
    name: "Indoor Monitor - 7 inch",
    description: "<p>Additional 7-inch indoor monitor for extra rooms. Touch screen interface with call history and settings.</p><ul><li>7-inch color touchscreen</li><li>Call history and logs</li><li>Adjustable volume</li><li>Wall or desk mount</li><li>Intercom between monitors</li></ul>",
    short_description: "7-inch touchscreen monitor for additional rooms",
    price: "399.00",
    prices: {
      price: "399.00",
      regular_price: "399.00",
      sale_price: "",
      currency_minor_unit: 2
    },
    slug: "indoor-monitor-7-inch",
    images: [
      {
        id: 4,
        src: "https://images.unsplash.com/photo-1551808525-51a94da548ce?w=300&h=200&fit=crop",
        name: "Indoor Monitor",
        alt: "7-inch indoor monitor"
      }
    ],
    categories: [
      {
        id: 102,
        name: "Intercom Addon",
        slug: "intercom-addon"
      }
    ],
    attributes: [
      {
        id: 1,
        name: "wiring",
        options: ["wired"]
      },
      {
        id: 2,
        name: "type",
        options: ["monitor"]
      }
    ],
    meta_data: []
  },
  {
    id: 2003,
    name: "Wireless Indoor Unit",
    description: "<p>Portable wireless indoor unit with rechargeable battery. Perfect for offices or rooms without wiring.</p><ul><li>Rechargeable battery (7 days)</li><li>WiFi connectivity</li><li>5-inch color screen</li><li>Portable design</li><li>Mobile app integration</li></ul>",
    short_description: "Portable wireless unit with rechargeable battery",
    price: "249.00",
    prices: {
      price: "249.00",
      regular_price: "249.00",
      sale_price: "",
      currency_minor_unit: 2
    },
    slug: "wireless-indoor-unit",
    images: [
      {
        id: 5,
        src: "https://images.unsplash.com/photo-1551808525-51a94da548ce?w=300&h=200&fit=crop",
        name: "Wireless Unit",
        alt: "Wireless indoor unit"
      }
    ],
    categories: [
      {
        id: 102,
        name: "Intercom Addon",
        slug: "intercom-addon"
      }
    ],
    attributes: [
      {
        id: 1,
        name: "wiring",
        options: ["wireless"]
      },
      {
        id: 2,
        name: "type",
        options: ["monitor"]
      }
    ],
    meta_data: []
  },
  {
    id: 2004,
    name: "Power Supply Module",
    description: "<p>Additional power supply for expanding wired intercom systems. Supports up to 4 additional devices.</p><ul><li>12V DC output</li><li>Supports 4 devices</li><li>Surge protection</li><li>LED status indicators</li><li>Wall mount design</li></ul>",
    short_description: "Power supply for system expansion",
    price: "149.00",
    prices: {
      price: "149.00",
      regular_price: "149.00",
      sale_price: "",
      currency_minor_unit: 2
    },
    slug: "power-supply-module",
    images: [
      {
        id: 6,
        src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
        name: "Power Supply",
        alt: "Power supply module"
      }
    ],
    categories: [
      {
        id: 102,
        name: "Intercom Addon",
        slug: "intercom-addon"
      }
    ],
    attributes: [
      {
        id: 1,
        name: "wiring",
        options: ["wired"]
      },
      {
        id: 2,
        name: "type",
        options: ["psu"]
      }
    ],
    meta_data: []
  },
  {
    id: 2005,
    name: "WiFi Range Extender",
    description: "<p>Extends WiFi range for wireless intercom systems. Ensures reliable connection throughout large properties.</p><ul><li>Dual-band WiFi</li><li>Easy setup</li><li>LED signal indicators</li><li>Compact design</li><li>Weather resistant</li></ul>",
    short_description: "Extends WiFi range for wireless systems",
    price: "99.00",
    prices: {
      price: "99.00",
      regular_price: "99.00",
      sale_price: "",
      currency_minor_unit: 2
    },
    slug: "wifi-range-extender",
    images: [
      {
        id: 7,
        src: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=200&fit=crop",
        name: "WiFi Extender",
        alt: "WiFi range extender"
      }
    ],
    categories: [
      {
        id: 102,
        name: "Intercom Addon",
        slug: "intercom-addon"
      }
    ],
    attributes: [
      {
        id: 1,
        name: "wiring",
        options: ["wireless"]
      },
      {
        id: 2,
        name: "type",
        options: ["accessory"]
      }
    ],
    meta_data: []
  },
  {
    id: 2006,
    name: "Mounting Bracket Set",
    description: "<p>Professional mounting brackets for secure installation. Includes all hardware and templates.</p><ul><li>Stainless steel construction</li><li>Adjustable angles</li><li>All mounting hardware</li><li>Installation templates</li><li>Weather resistant</li></ul>",
    short_description: "Professional mounting brackets with hardware",
    price: "79.00",
    prices: {
      price: "79.00",
      regular_price: "79.00",
      sale_price: "",
      currency_minor_unit: 2
    },
    slug: "mounting-bracket-set",
    images: [
      {
        id: 8,
        src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
        name: "Mounting Brackets",
        alt: "Mounting bracket set"
      }
    ],
    categories: [
      {
        id: 102,
        name: "Intercom Addon",
        slug: "intercom-addon"
      }
    ],
    attributes: [
      {
        id: 1,
        name: "wiring",
        options: ["both"]
      },
      {
        id: 2,
        name: "type",
        options: ["accessory"]
      }
    ],
    meta_data: []
  }
];

// Mock cart data
export const mockCart = {
  items: [],
  totals: {
    total_items: "0",
    total_items_tax: "0",
    total_fees: "0",
    total_fees_tax: "0",
    total_discount: "0",
    total_discount_tax: "0",
    total_shipping: "0",
    total_shipping_tax: "0",
    total_tax: "0",
    total_price: "0.00"
  },
  needs_payment: false,
  needs_shipping: false
};

// Helper functions
export function getIntercomProductsByWiring(wiringType: 'wired' | 'wireless', products: WooProduct[]): WooProduct[] {
  return products.filter(product => {
    const wiringAttr = product.attributes?.find(attr => 
      attr.name.toLowerCase() === 'wiring'
    );
    if (!wiringAttr) return false;
    const wiringValue = wiringAttr.options?.[0]?.toLowerCase();
    return wiringValue === wiringType || wiringValue === 'both';
  });
}

export function getIntercomProductsByType(products: WooProduct[], productType: string): WooProduct[] {
  return products.filter(product => {
    const typeAttr = product.attributes?.find(attr => 
      attr.name.toLowerCase() === 'type'
    );
    if (!typeAttr) return false;
    const typeValue = typeAttr.options?.[0]?.toLowerCase();
    return typeValue === productType.toLowerCase();
  });
}