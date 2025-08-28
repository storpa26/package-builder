# Intercom System Implementation Guide

## Overview

This implementation adds a complete intercom flow to the existing alarm package builder without disrupting the current functionality. The intercom system is designed to work seamlessly with WordPress + Elementor Pro + WooCommerce.

## Architecture

The intercom system follows the same patterns as the existing alarm system but is completely separate:

- **Separate routing**: `/intercom/`, `/intercom-wired/`, `/intercom-wireless/`
- **Isolated components**: All intercom components are in their own namespace
- **Shared infrastructure**: Uses the same WooCommerce API, UI components, and styling system
- **Brand colors**: Uses the specified intercom brand palette

## Pages Created

### 1. Landing Page (`/intercom/`)
- **File**: `src/pages/IntercomLanding.tsx`
- **Features**:
  - Hero section with value bullets and trust badges
  - Router form with 3 selects (property, storeys, ceiling)
  - Decision logic that redirects to appropriate page
  - Elementor-compatible redirect script included

### 2. Wired Page (`/intercom-wired/`)
- **File**: `src/pages/IntercomWired.tsx`
- **Features**:
  - Rationale banner reading `?why=` parameter
  - Base package display (filtered by `intercom-base` category + `wired|both` attribute)
  - Add-ons grid (filtered by `intercom-addon` category + `wired|both` attribute)
  - Product popups with full descriptions
  - Mini-cart with live updates

### 3. Wireless Page (`/intercom-wireless/`)
- **File**: `src/pages/IntercomWireless.tsx`
- **Features**:
  - Same as wired page but filtered for `wireless|both` products
  - Different accent colors (pink vs teal)
  - Capacity hints section
  - Wireless-specific styling and icons

## WooCommerce Setup Required

### Categories
1. **intercom-base**: For base intercom packages
2. **intercom-addon**: For add-on products

### Global Attributes
1. **Wiring**: `wired | wireless | both`
2. **Type**: `door-station | monitor | module | psu | accessory`

### Product Configuration
- Add-ons can be marked as "Hidden" but still purchasable
- Products should have proper images and descriptions
- Pricing is pulled directly from WooCommerce

## Decision Logic

The router form uses this logic:
```javascript
// Hardwired if (Residential & Single & (Pitched/Drop)) OR (Retail & Drop ceiling)
const isHardwired = 
  (property === 'residential' && storeys === 'single' && (ceiling === 'pitched' || ceiling === 'drop')) ||
  (property === 'retail' && ceiling === 'drop');
```

## Brand Colors Used

```javascript
brandColors: {
  primary: '#020202',    // Main text/backgrounds
  accent1: '#c95375',    // Wireless theme (pink)
  accent2: '#288896',    // Wired theme (teal)
  accent3: '#005667',    // Dark teal
  neutral: '#838381',    // Gray
  highlight1: '#ff66c4', // Bright pink
  highlight2: '#018295'  // Bright teal
}
```

## Elementor Integration

### Landing Page Setup
1. Create page at `/intercom/`
2. Add hero section with value bullets
3. Add router form with these field IDs:
   - `property` (select: residential, retail)
   - `storeys` (select: single, multi)
   - `ceiling` (select: pitched, drop, flat)
4. Add HTML widget with redirect script:

```html
<script>
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form[data-intercom-router]');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const property = form.querySelector('[name="property"]').value;
      const storeys = form.querySelector('[name="storeys"]').value;
      const ceiling = form.querySelector('[name="ceiling"]').value;
      
      if (!property || !storeys || !ceiling) return;
      
      const isHardwired = 
        (property === 'residential' && storeys === 'single' && (ceiling === 'pitched' || ceiling === 'drop')) ||
        (property === 'retail' && ceiling === 'drop');
      
      const targetUrl = isHardwired 
        ? '/intercom-wired/?why=hardwired'
        : '/intercom-wireless/?why=wireless';
      
      window.location.href = targetUrl;
    });
  });
})();
</script>
```

### Product Pages Setup
1. Create pages at `/intercom-wired/` and `/intercom-wireless/`
2. Add rationale banner that reads `?why=` parameter
3. Use WooCommerce Products widget filtered by:
   - Category: `intercom-base` or `intercom-addon`
   - Attribute: `wiring` = `wired|both` or `wireless|both`
4. Create Elementor popup template for product details
5. Add mini-cart widget

## API Methods Added

New methods in `src/lib/api.ts`:

- `getIntercomBaseProducts(wiringType)`: Fetch base packages
- `getIntercomAddonProducts(wiringType)`: Fetch add-ons with filtering
- `getIntercomProductsByType(wiringType, productType)`: Fetch by specific type

## Components Created

- `IntercomProductCard`: Reusable product card with different sizes
- `MiniCart`: Floating cart widget
- Product popup modal (built into pages)

## Styling Features

- Clean card designs with soft shadows
- Check-icon lists for features
- Responsive grid layouts
- Brand color theming throughout
- Hover effects and transitions
- Mobile-optimized layouts

## Testing Checklist

- [ ] Form routes correctly per decision rule
- [ ] URLs with `?why=` parameter work
- [ ] Wired page shows only wired/both add-ons
- [ ] Wireless page shows only wireless/both add-ons
- [ ] Popups display product details
- [ ] Add buttons add to WooCommerce cart (AJAX)
- [ ] Mini-cart updates in real-time
- [ ] Items appear in Cart/Checkout pages
- [ ] Mobile responsiveness works
- [ ] Brand colors display correctly

## Optional Enhancements

### Lead Form Gate
Add a lead capture form before showing add-ons:
```javascript
// Set cookie after form submission
document.cookie = "intercom_lead_captured=true; path=/; max-age=86400";

// Check cookie to show/hide add-ons section
const leadCaptured = document.cookie.includes('intercom_lead_captured=true');
```

### Capacity Hints
The wireless page includes capacity hints. Extend this with:
- Dynamic recommendations based on property type
- Visual capacity meters
- Automatic suggestions when limits approached

## File Structure

```
src/
├── pages/
│   ├── IntercomLanding.tsx      # Landing page with router form
│   ├── IntercomWired.tsx        # Wired products page
│   └── IntercomWireless.tsx     # Wireless products page
├── components/
│   └── Intercom/
│       └── IntercomProductCard.tsx  # Shared components
├── lib/
│   ├── config.ts               # Extended with intercom config
│   └── api.ts                  # Extended with intercom methods
└── types/
    └── index.ts                # Extended with intercom types
```

## Integration Notes

- The system preserves all existing alarm functionality
- Uses the same WooCommerce cart and checkout flow
- Follows existing code patterns and conventions
- Can be deployed alongside the current alarm system
- No conflicts with existing routes or components

## Deployment

1. Build the React application
2. Set up WooCommerce categories and attributes
3. Create Elementor page templates
4. Configure product filtering
5. Test the complete flow
6. Monitor cart integration

The implementation is production-ready and follows WordPress/WooCommerce best practices while maintaining the existing alarm system functionality.