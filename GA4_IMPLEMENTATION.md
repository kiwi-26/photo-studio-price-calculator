# Google Analytics 4 (GA4) Implementation

## Overview
Google Analytics 4 tracking has been successfully implemented in the photo studio price calculator application with measurement ID `G-SJ7RNMFXTH`.

## Implementation Details

### 1. Basic GA4 Setup
- **Location**: `index.html` (lines 10-17)
- **Features**: 
  - Global Site Tag (gtag) script loaded from Google
  - Automatic page view tracking
  - Measurement ID: `G-SJ7RNMFXTH`

### 2. Enhanced E-commerce Tracking
A comprehensive analytics utility has been created to track user interactions:

#### Analytics Utility (`src/utils.ts`)
- **trackAddToCart()**: Tracks when items are added to cart
- **trackRemoveFromCart()**: Tracks when items are removed from cart
- **trackViewItem()**: Tracks when users view product details
- **trackViewCart()**: Tracks when users view their cart
- **trackEvent()**: Generic event tracking function

#### Events Tracked:

##### Add to Cart Events
- **Trigger**: When users add products to cart
- **Location**: `src/stores/cart.ts` - `addToCart()` method
- **Data**: Product ID, name, category, price, quantity, currency (JPY)

##### Remove from Cart Events
- **Trigger**: When users remove products from cart
- **Location**: `src/stores/cart.ts` - `removeFromCart()` method
- **Data**: Product ID, name, category, price, quantity, currency (JPY)

##### Quantity Update Events
- **Trigger**: When users change product quantities
- **Location**: `src/stores/cart.ts` - `updateQuantity()` method
- **Behavior**: Tracks as add_to_cart (increase) or remove_from_cart (decrease)

##### View Item Events
- **Trigger**: When users open product detail modal or navigate between products
- **Location**: `src/components/ProductDetailModal.vue`
- **Data**: Product ID, name, category, price, currency (JPY)

##### View Cart Events
- **Trigger**: When users expand the cart footer
- **Location**: `src/components/StickyCartFooter.vue` - `toggleExpanded()` method
- **Data**: All cart items with total value, currency (JPY)

### 3. TypeScript Integration
- Global `gtag` function declared for TypeScript compatibility
- Type-safe event tracking with proper interfaces
- Server-side rendering safe (checks for `window` object)

### 4. Currency and Localization
- All monetary values tracked in Japanese Yen (JPY)
- Proper formatting for Japanese market

## Benefits
1. **User Behavior Insights**: Track how users interact with products and cart
2. **Conversion Funnel**: Monitor add-to-cart rates and product popularity
3. **Product Performance**: Identify most viewed and purchased items
4. **User Engagement**: Track cart interaction patterns

## Data Privacy
- No personally identifiable information (PII) is tracked
- Only product interaction data and anonymous user behavior
- Compliant with standard GA4 privacy practices

## Testing
To verify the implementation:
1. Open browser developer tools
2. Navigate to Network tab
3. Interact with the application (add items, view details, etc.)
4. Look for requests to `google-analytics.com` or `googletagmanager.com`
5. Check GA4 real-time reports in Google Analytics dashboard

## Future Enhancements
Potential additional tracking could include:
- Search events (if search functionality is added)
- Category selection events
- Time spent viewing products
- Custom conversion goals