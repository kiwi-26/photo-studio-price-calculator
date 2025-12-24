# Tax-Inclusive Threshold Implementation Fix

## 🎯 Code Review Issue Addressed

**Original Issue**: "商品価格はすべて税抜だが、データ商品の閾値は税込なので、ロジックに反映して欲しい"
(All product prices are tax-exclusive, but the data product threshold is tax-inclusive, so please reflect this in the logic)

## ✅ Solution Implemented

### 1. Tax Calculation Infrastructure
- **File**: `src/utils.ts`
- **Added**: `TAX_RATE` constant (10% for Japan)
- **Added**: `TaxUtils` class with conversion methods:
  - `toTaxInclusive()`: Converts tax-exclusive to tax-inclusive prices
  - `toTaxExclusive()`: Converts tax-inclusive to tax-exclusive prices
  - `getTaxAmount()`: Calculates tax amount

### 2. Threshold Logic Fix
- **File**: `src/stores/cart.ts`
- **Updated**: `nonDataProductTotal` computed property
- **Key Change**: Now uses `TaxUtils.toTaxInclusive(item.price)` for threshold calculation

```typescript
// Before (INCORRECT - used tax-exclusive prices)
const nonDataProductTotal = computed(() => {
  return cart.value
    .filter(item => item.categoryId !== 'image-data')
    .reduce((total, item) => total + (item.price * item.quantity), 0);
});

// After (CORRECT - uses tax-inclusive prices)
const nonDataProductTotal = computed(() => {
  return cart.value
    .filter(item => item.categoryId !== 'image-data')
    .reduce((total, item) => total + (TaxUtils.toTaxInclusive(item.price) * item.quantity), 0);
});
```

### 3. Business Logic Verification
- **Threshold**: ¥50,000 (tax-inclusive)
- **Calculation**: Tax-exclusive price × 1.10 = Tax-inclusive price
- **Example**: ¥45,455 (tax-exclusive) → ¥50,000 (tax-inclusive) → Threshold met ✅

## 🧪 Test Scenarios

| Tax-Exclusive Total | Tax-Inclusive Total | Threshold Met (≥¥50,000) |
|-------------------|-------------------|------------------------|
| ¥40,000 | ¥44,000 | ❌ No |
| ¥45,454 | ¥49,999 | ❌ No |
| ¥45,455 | ¥50,000 | ✅ Yes |
| ¥50,000 | ¥55,000 | ✅ Yes |

## 📋 Complete Implementation

The fix is part of a complete image data product implementation that includes:

1. **Type Extensions**: Added `requiresThreshold` and `unavailableWhenThresholdMet` fields
2. **Product Data**: Created 6 image data products with proper business rules
3. **Category System**: Added image-data category with CloudArrowDownIcon
4. **Business Logic**: Implemented threshold-based product availability
5. **UI Updates**: Enhanced ProductCard and CartSummary components
6. **Tax Compliance**: **Fixed threshold calculation to use tax-inclusive prices** ✅

## 🎉 Result

The code review issue has been resolved. The 50,000 yen threshold for image data products now correctly uses tax-inclusive prices while maintaining all product prices as tax-exclusive in the database, ensuring compliance with Japanese business practices.