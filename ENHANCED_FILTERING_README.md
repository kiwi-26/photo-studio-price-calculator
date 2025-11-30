# Enhanced Product Filtering Implementation

## Overview

This implementation extends the existing product filtering functionality with comprehensive sorting and filtering options as requested. The enhancement maintains backward compatibility while adding powerful new features for better product discovery and pricing transparency.

## New Features

### 1. Sort Order Options (ソート順)
- **商品掲載順 (Product Listing Order)**: Default sorting by product ID
- **価格順 (Price Order)**: Sort products by price (ascending)
- **ポーズ数順 (Pose Count Order)**: Sort products by number of poses (ascending)

### 2. Price Filter (価格フィルター)
Predefined price ranges for easy filtering:
- **すべて (All)**: No price filtering
- **3,000円以下**: Products up to ¥3,000
- **3,001円～6,000円**: Products between ¥3,001 and ¥6,000
- **6,001円～10,000円**: Products between ¥6,001 and ¥10,000
- **10,001円以上**: Products above ¥10,000

### 3. Character Design Fee (キャラクターデザイン衣装)
- Checkbox option to add ¥1,000 to applicable products
- Currently applies to print products (categoryId: 'print')
- Visual indicator shows "キャラデザ料込み" on affected product cards
- Integrated with cart pricing and filtering logic

### 4. Enhanced User Experience
- Responsive design for both desktop and mobile
- Visual feedback for active filters
- Real-time price updates when character design fee is toggled
- Maintains existing category and pose count filtering

## Technical Implementation

### Files Modified

#### 1. `src/stores/products.ts`
- Added new state variables for sort order, price filter, and character design fee
- Extended filtering logic to handle multiple filter types simultaneously
- Implemented sorting algorithms for all three sort options
- Added helper functions for effective price calculation
- Created new interfaces: `SortOption`, `PriceFilter`

#### 2. `src/components/CategorySidebar.vue`
- Added UI controls for new filters
- Responsive design for both desktop and mobile layouts
- Updated props and event handling for new filter types
- Maintained existing category and pose count filter functionality

#### 3. `src/App.vue`
- Extended props passed to CategorySidebar component
- Added event handlers for new filter update events
- Maintained existing component integration

#### 4. `src/components/ProductCard.vue`
- Updated to display effective price (including character design fee)
- Added visual indicator for character design fee inclusion
- Integrated with products store for real-time price updates

#### 5. `src/stores/cart.ts`
- Modified to handle effective pricing when adding items to cart
- Ensures cart items reflect current character design fee setting
- Updated price calculation to use stored effective prices

### Key Technical Decisions

1. **Character Design Fee Logic**: Applied to print products (categoryId: 'print') as these are most likely to involve character costume designs
2. **Price Filter Ranges**: Predefined ranges for better UX rather than custom min/max inputs
3. **Effective Price Calculation**: Centralized in products store for consistency across components
4. **Backward Compatibility**: All existing functionality preserved and enhanced

## Usage Instructions

### For Users

1. **Sorting Products**:
   - Use the "ソート順" dropdown in the sidebar
   - Choose from product listing order, price order, or pose count order
   - Products will automatically re-sort based on selection

2. **Filtering by Price**:
   - Use the "価格" dropdown in the sidebar
   - Select a price range to filter products
   - Prices shown include character design fee if enabled

3. **Character Design Fee**:
   - Check the "キャラクターデザイン衣装" checkbox for applicable products
   - ¥1,000 will be added to print products
   - Visual indicator appears on affected product cards
   - Cart prices automatically update

4. **Combining Filters**:
   - All filters work together (category, pose count, price, sort order)
   - Character design fee affects both filtering and sorting by price

### For Developers

1. **Adding New Product Categories**:
   - Update `isCharacterDesignApplicable()` function if new categories should support character design fee

2. **Modifying Price Ranges**:
   - Edit the `priceFilters` computed property in `src/stores/products.ts`

3. **Adding New Sort Options**:
   - Add new options to `sortOptions` computed property
   - Implement sorting logic in the `filteredProducts` computed property

## Testing

### Manual Testing Checklist

1. **Sort Order Testing**:
   - [ ] Products sort correctly by ID (default)
   - [ ] Products sort correctly by price
   - [ ] Products sort correctly by pose count
   - [ ] Sorting works with other filters active

2. **Price Filter Testing**:
   - [ ] Each price range filters correctly
   - [ ] Price filtering works with character design fee enabled
   - [ ] Price filtering combines with other filters

3. **Character Design Fee Testing**:
   - [ ] Checkbox toggles character design fee
   - [ ] Print products show increased price (+¥1,000)
   - [ ] Non-print products unaffected
   - [ ] Visual indicator appears on affected products
   - [ ] Cart prices update correctly

4. **Integration Testing**:
   - [ ] All filters work together
   - [ ] Mobile layout displays correctly
   - [ ] Performance acceptable with all filters active
   - [ ] Existing functionality unchanged

### Browser Testing

Test in the following browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Considerations

- Filtering and sorting operations are optimized using Vue's computed properties
- Real-time updates without unnecessary re-renders
- Efficient array operations for large product catalogs
- Responsive design maintains performance on mobile devices

## Future Enhancements

Potential improvements for future versions:
1. Custom price range inputs (min/max)
2. Multiple category selection
3. Advanced sorting options (e.g., popularity, newest)
4. Filter presets/bookmarks
5. Search functionality integration
6. Character design fee configuration per product type

## Troubleshooting

### Common Issues

1. **Filters not working**: Check browser console for JavaScript errors
2. **Prices not updating**: Verify character design fee logic in browser dev tools
3. **Mobile layout issues**: Test responsive breakpoints
4. **Performance issues**: Check for large product datasets or inefficient filtering

### Debug Information

Enable Vue DevTools to inspect:
- Products store state
- Filter values
- Computed property updates
- Component prop passing

## Support

For technical support or questions about this implementation, refer to:
- Vue.js documentation for reactive state management
- Pinia documentation for store patterns
- Tailwind CSS documentation for styling
- TypeScript documentation for type safety