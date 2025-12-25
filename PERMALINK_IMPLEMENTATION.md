# Permalink Functionality Implementation

This document describes the implementation of permalink generation and sharing functionality for the photo studio price calculator.

## Features Implemented

### 1. URL Parameter Encoding/Decoding
- **Location**: `src/utils.ts` - `UrlUtils` class
- **Format**: `?items=id1:qty1,id2:qty2,id3:qty3`
- **Example**: `?items=1:2,abc:1,42:5` represents:
  - Product ID 1 with quantity 2
  - Product ID "abc" with quantity 1  
  - Product ID 42 with quantity 5

### 2. Cart Store Extensions
- **Location**: `src/stores/cart.ts`
- **New Methods**:
  - `generateShareableUrl()`: Creates shareable URL from current cart
  - `loadCartFromUrl()`: Loads cart from URL parameters on app initialization
  - `shareEstimate()`: Handles sharing with clipboard copy and analytics

### 3. Application Initialization
- **Location**: `src/App.vue`
- **Enhancement**: Added `onMounted` hook to automatically load cart from URL parameters
- **Behavior**: Silently loads cart if URL contains valid `items` parameter

### 4. Sharing UI
- **Location**: `src/components/StickyCartFooter.vue`
- **Features**:
  - Share button next to Reset button
  - Toast notification for success/error feedback
  - Disabled state when cart is empty
  - Copy to clipboard functionality

### 5. Analytics Integration
- **Location**: `src/utils.ts` - `Analytics` class
- **New Event**: `trackShareEstimate()` tracks sharing events
- **Data**: Includes total value, item count, and product count

## Technical Details

### URL Parameter Validation
- Validates product IDs exist in products store
- Respects maximum quantity limits per product
- Gracefully handles invalid/missing products
- Logs warnings for debugging

### Browser Compatibility
- Uses modern `navigator.clipboard` API when available
- Falls back to `document.execCommand('copy')` for older browsers
- Works in both secure (HTTPS) and non-secure contexts

### Static Deployment Support
- Uses query parameters (not hash fragments) for better SEO
- Works with rental server deployments
- No server-side routing required
- Compatible with subdirectory deployments

## Usage Examples

### Sharing a Cart
1. Add items to cart
2. Click "共有" (Share) button in cart footer
3. Link is automatically copied to clipboard
4. Share the URL with others

### Loading from URL
1. Visit URL with `?items=1:2,2:1` parameter
2. Cart automatically loads with specified items
3. Invalid items are skipped with console warnings
4. Analytics event is tracked

### URL Format Examples
```
# Empty cart
https://example.com/

# Single item
https://example.com/?items=1:2

# Multiple items  
https://example.com/?items=1:2,2:1,3:3

# Mixed ID types
https://example.com/?items=1:2,abc:1,42:5
```

## Testing

### Manual Testing
1. Open `test-permalink-functionality.html` in browser
2. Run the provided test functions
3. Verify encoding/decoding works correctly
4. Test URL generation and parsing

### Build Testing
1. Run `chmod +x test-permalink-build.sh`
2. Execute `./test-permalink-build.sh`
3. Verify TypeScript compilation and build success

## Error Handling

### Invalid URL Parameters
- Malformed parameters are ignored
- Console warnings for debugging
- App continues normal operation

### Missing Products
- Products not found in store are skipped
- User sees only valid items in cart
- Console warnings for missing products

### Clipboard Failures
- Error notification shown to user
- URL still provided for manual copying
- Graceful degradation for unsupported browsers

## Security Considerations

### Input Validation
- Product IDs validated against existing products
- Quantities validated as positive integers
- Maximum quantity limits enforced

### XSS Prevention
- No direct HTML injection from URL parameters
- All data validated before use
- Vue.js template escaping provides protection

## Performance Impact

### Minimal Overhead
- URL parsing only on app initialization
- Encoding only when sharing
- No continuous URL monitoring
- Efficient string operations

### Memory Usage
- No persistent URL state storage
- Cart data remains in existing Pinia store
- Temporary notification state only

## Future Enhancements

### Potential Improvements
- QR code generation for mobile sharing
- Social media sharing integration
- Shortened URL service integration
- Sharing history/favorites
- Email sharing functionality

### Accessibility
- Keyboard navigation for share button
- Screen reader announcements for notifications
- High contrast mode support
- Focus management improvements