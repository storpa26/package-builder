import type { Context } from '../lib/config';
import type { Addon } from '../types';

// Add-on product data for display (pricing comes from WooCommerce)
// This contains UI data only - no pricing logic

export const addons: Addon[] = [
  {
    id: "outpir",
    name: "Outdoor motion sensor (pet friendly)",
    type: "sensor",
    consumesInput: true,
    powerMilliAmps: 25,
    unitPrice: { residential: 195, retail: 225, office: 225, warehouse: 260 },
    summary: "Watches the outside before a break-in; tuned to ignore small pets.",
    bullets: [
      "Reduces false alarms from outdoor pets",
      "Great for driveways and backyards",
      "Deters intruders before they enter"
    ],
    qtyMin: 0,
    qtyMax: 8
  },
  {
    id: "tskp",
    name: "Touchscreen keypad",
    type: "keypad",
    consumesInput: false,
    powerMilliAmps: 90,
    unitPrice: { residential: 250, retail: 280, office: 280, warehouse: 320 },
    summary: "Larger, clearer entry display for quick arm/disarm.",
    bullets: [
      "One-tap arming and disarming",
      "Perfect for guests and staff use",
      "Keep standard keypad as backup"
    ],
    qtyMin: 0,
    qtyMax: 4,
    isTouchscreen: true
  },
  {
    id: "smoke",
    name: "Wireless smoke detector",
    type: "sensor",
    consumesInput: true,
    powerMilliAmps: 15,
    unitPrice: { residential: 180, retail: 200, office: 200, warehouse: 220 },
    summary: "Early fire detection integrated with your security system.",
    bullets: [
      "Alerts you instantly via app",
      "Sounds all sirens in the system",
      "Battery lasts 5+ years"
    ],
    qtyMin: 0,
    qtyMax: 12
  },
  {
    id: "panic",
    name: "Panic button (portable)",
    type: "accessory",
    consumesInput: false,
    powerMilliAmps: 5,
    unitPrice: { residential: 85, retail: 95, office: 95, warehouse: 110 },
    summary: "Silent alarm activation for emergencies.",
    bullets: [
      "Instant silent alarm to monitoring",
      "Small and discreet design",
      "Works throughout the property"
    ],
    qtyMin: 0,
    qtyMax: 6
  },
  {
    id: "glass",
    name: "Glass break detector",
    type: "sensor",
    consumesInput: true,
    powerMilliAmps: 20,
    unitPrice: { residential: 160, retail: 180, office: 180, warehouse: 200 },
    summary: "Detects the sound of breaking glass from up to 7 metres.",
    bullets: [
      "Covers multiple windows per sensor",
      "No false alarms from storms",
      "Perfect for shopfronts and offices"
    ],
    qtyMin: 0,
    qtyMax: 6
  },
  {
    id: "door",
    name: "Door/window sensor",
    type: "sensor",
    consumesInput: true,
    powerMilliAmps: 10,
    unitPrice: { residential: 95, retail: 105, office: 105, warehouse: 120 },
    summary: "Know instantly when doors or windows are opened.",
    bullets: [
      "Immediate notification of entry",
      "Battery lasts 3+ years",
      "Invisible when door is closed"
    ],
    qtyMin: 0,
    qtyMax: 16
  },
  {
    id: "keypad2",
    name: "Additional keypad",
    type: "keypad",
    consumesInput: false,
    powerMilliAmps: 45,
    unitPrice: { residential: 165, retail: 185, office: 185, warehouse: 210 },
    summary: "Extra entry point for convenient access.",
    bullets: [
      "Multiple convenient locations",
      "Staff can have separate codes",
      "Battery backup included"
    ],
    qtyMin: 0,
    qtyMax: 6
  },
  {
    id: "expander",
    name: "Input expander module",
    type: "expander",
    consumesInput: false,
    powerMilliAmps: 80,
    unitPrice: { residential: 160, retail: 160, office: 160, warehouse: 160 },
    summary: "Adds capacity for more sensors (auto-added when needed).",
    bullets: [
      "Supports up to 8 additional sensors",
      "Wireless connection to main panel",
      "Required when exceeding 8 total sensors"
    ],
    qtyMin: 0,
    qtyMax: 3,
    isAutoAppended: true
  },
  {
    id: "psu",
    name: "Additional power supply",
    type: "psu",
    consumesInput: false,
    powerMilliAmps: 0,
    unitPrice: { residential: 120, retail: 120, office: 120, warehouse: 120 },
    summary: "Extra power for high-consumption devices (auto-added when needed).",
    bullets: [
      "Supports power-hungry devices",
      "Required for multiple touchscreens",
      "Backup battery included"
    ],
    qtyMin: 0,
    qtyMax: 2,
    isAutoAppended: true
  }
];