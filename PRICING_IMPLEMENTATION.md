# Pricing Implementation with WooCommerce Variations

## Overview

This document explains how the package builder handles pricing variations from WooCommerce products using the Store API v1.

## Problem Statement

The WooCommerce Store API v1 only provides `min_amount` and `max_amount` in the `price_range` object for variable products, but we need to display context-specific pricing for:
- Residential
- Retail 
- Office
- Warehouse

## Solution

We map the WooCommerce price range to our context-based pricing as follows:

- **`min_amount`** → **Residential pricing**
- **`max_amount`** → **Retail pricing**
- **Office** → Uses Retail pricing
- **Warehouse** → Uses Retail pricing + 13% markup

## Implementation Details

### Type Definitions

Updated `WooProduct` interface in `src/types/index.ts` to include:

```typescript
prices: {
  price: string;
  regular_price: string;
  sale_price: string;
  price_range?: {
    min_amount: string;
    max_amount: string;
  };
  currency_code?: string;
  currency_symbol?: string;
  currency_minor_unit: number;
  currency_decimal_separator?: string;
  currency_thousand_separator?: string;
  currency_prefix?: string;
  currency_suffix?: string;
};
```

### Pricing Logic

Implemented in `src/components/AlarmPackage/AddOnsSection.tsx`:

```typescript
// Use price_range if available: min_amount = Residential, max_amount = Retail
let residentialPrice = priceValue;
let retailPrice = priceValue * 1.15;

if (product.prices.price_range) {
  const minAmount = product.prices.price_range.min_amount;
  const maxAmount = product.prices.price_range.max_amount;
  
  if (minAmount && !isNaN(parseFloat(minAmount))) {
    residentialPrice = parseFloat(minAmount) / (10 ** product.prices.currency_minor_unit);
  }
  
  if (maxAmount && !isNaN(parseFloat(maxAmount))) {
    retailPrice = parseFloat(maxAmount) / (10 ** product.prices.currency_minor_unit);
  }
}

const unitPrice = {
  residential: residentialPrice,
  retail: retailPrice,
  office: retailPrice,  // Use retail price for office
  warehouse: retailPrice * 1.13  // 13% markup over retail for warehouse
};
```

### Fallback Behavior

If `price_range` is not available, the system falls back to:
- **Residential**: Base price
- **Retail**: Base price × 1.15
- **Office**: Base price × 1.15
- **Warehouse**: Base price × 1.30

## Example Data Structure

Expected WooCommerce API response:

```json
{
  "prices": {
    "price": "16000",
    "regular_price": "16000",
    "sale_price": "16000",
    "price_range": {
      "min_amount": "16000",  // Residential = $160.00
      "max_amount": "18000"   // Retail = $180.00
    },
    "currency_code": "AUD",
    "currency_symbol": "$",
    "currency_minor_unit": 2,
    "currency_decimal_separator": ".",
    "currency_thousand_separator": ",",
    "currency_prefix": "$",
    "currency_suffix": ""
  }
}
```

## Testing

A test file is available at `src/test/pricing-test.ts` to verify the pricing logic works correctly with both scenarios:
1. Products with `price_range` (uses min/max amounts)
2. Products without `price_range` (uses fallback logic)

## Debugging

Console logs are included to help debug pricing issues:
- `📊 Price range found for [product]: min=[amount], max=[amount]`
- `🏠 Residential price set to: $[amount]`
- `🏪 Retail price set to: $[amount]`
- `📊 No price range for [product], using fallback pricing`

## Files Modified

1. `src/types/index.ts` - Updated WooProduct interface
2. `src/components/AlarmPackage/AddOnsSection.tsx` - Implemented pricing logic
3. `src/test/pricing-test.ts` - Created test file
4. `PRICING_IMPLEMENTATION.md` - This documentation

## Future Considerations

- If more granular pricing is needed, consider using WooCommerce meta fields
- Monitor console logs in production to ensure price_range data is available
- Consider caching pricing data for performance optimization