import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createTestPinia } from '../../utils';
import { useCartStore } from '../../../src/stores/cart';
import { useProductsStore } from '../../../src/stores/products';
import type { ProductType } from '../../../src/types';

// Mock the utils module
vi.mock('../../../src/utils', () => ({
  Analytics: {
    trackAddToCart: vi.fn(),
    trackRemoveFromCart: vi.fn(),
    trackEvent: vi.fn(),
    trackShareEstimate: vi.fn()
  },
  TaxUtils: {
    toTaxInclusive: (price: number) => Math.floor(price * 1.1)
  },
  UrlUtils: {
    generateShareableUrl: vi.fn(() => 'https://example.com/share/123'),
    getCartDataFromUrl: vi.fn(() => []),
    copyToClipboard: vi.fn(() => Promise.resolve(true))
  }
}));

describe('Cart Store', () => {
  let cartStore: ReturnType<typeof useCartStore>;
  let productsStore: ReturnType<typeof useProductsStore>;

  const createTestProduct = (overrides: Partial<ProductType> = {}): ProductType => ({
    id: 1,
    name: 'Test Product',
    categoryId: 'test-category',
    description: 'Test description',
    photoCount: 5,
    price: 1000,
    ...overrides
  });

  beforeEach(() => {
    createTestPinia();
    cartStore = useCartStore();
    productsStore = useProductsStore();
    
    // Clear cart before each test
    cartStore.clearCart();
  });

  describe('Initial State', () => {
    it('should have empty cart initially', () => {
      expect(cartStore.cart).toEqual([]);
      expect(cartStore.isEmpty).toBe(true);
      expect(cartStore.cartItemsCount).toBe(0);
      expect(cartStore.cartTotal).toBe(0);
    });
  });

  describe('Adding Items to Cart', () => {
    it('should add new product to cart', () => {
      const product = createTestProduct();
      const result = cartStore.addToCart(product);
      
      expect(result).toBe(true);
      expect(cartStore.cart).toHaveLength(1);
      expect(cartStore.cart[0]).toMatchObject({
        ...product,
        quantity: 1
      });
    });

    it('should increase quantity for existing product', () => {
      const product = createTestProduct();
      
      cartStore.addToCart(product);
      cartStore.addToCart(product);
      
      expect(cartStore.cart).toHaveLength(1);
      expect(cartStore.cart[0].quantity).toBe(2);
    });

    it('should respect maximum quantity limits', () => {
      const product = createTestProduct({ maxQuantity: 2 });
      
      // Add up to max quantity
      expect(cartStore.addToCart(product)).toBe(true);
      expect(cartStore.addToCart(product)).toBe(true);
      
      // Try to add beyond max quantity
      expect(cartStore.addToCart(product)).toBe(false);
      expect(cartStore.cart[0].quantity).toBe(2);
    });

    it('should check if product can be added to cart', () => {
      const product = createTestProduct({ maxQuantity: 1 });
      
      expect(cartStore.canAddToCart(product)).toBe(true);
      
      cartStore.addToCart(product);
      expect(cartStore.canAddToCart(product)).toBe(false);
    });

    it('should calculate remaining quantity correctly', () => {
      const product = createTestProduct({ maxQuantity: 3 });
      
      expect(cartStore.getRemainingQuantity(product)).toBe(3);
      
      cartStore.addToCart(product);
      expect(cartStore.getRemainingQuantity(product)).toBe(2);
      
      cartStore.addToCart(product);
      expect(cartStore.getRemainingQuantity(product)).toBe(1);
    });

    it('should return null for products without quantity limits', () => {
      const product = createTestProduct(); // no maxQuantity
      expect(cartStore.getRemainingQuantity(product)).toBe(null);
    });
  });

  describe('Removing Items from Cart', () => {
    it('should remove item by index', () => {
      const product = createTestProduct();
      cartStore.addToCart(product);
      
      cartStore.removeFromCart(0);
      expect(cartStore.cart).toHaveLength(0);
    });

    it('should remove item by ID', () => {
      const product = createTestProduct();
      cartStore.addToCart(product);
      
      cartStore.removeItemById(product.id);
      expect(cartStore.cart).toHaveLength(0);
    });

    it('should handle invalid index gracefully', () => {
      cartStore.removeFromCart(999);
      expect(cartStore.cart).toHaveLength(0);
    });
  });

  describe('Updating Quantities', () => {
    it('should update quantity by index', () => {
      const product = createTestProduct();
      cartStore.addToCart(product);
      
      const result = cartStore.updateQuantity(0, 5);
      expect(result).toBe(true);
      expect(cartStore.cart[0].quantity).toBe(5);
    });

    it('should update quantity by ID', () => {
      const product = createTestProduct();
      cartStore.addToCart(product);
      
      cartStore.updateQuantityById(product.id, 3);
      expect(cartStore.cart[0].quantity).toBe(3);
    });

    it('should remove item when quantity is set to 0', () => {
      const product = createTestProduct();
      cartStore.addToCart(product);
      
      cartStore.updateQuantity(0, 0);
      expect(cartStore.cart).toHaveLength(0);
    });

    it('should respect maximum quantity when updating', () => {
      const product = createTestProduct({ maxQuantity: 2 });
      cartStore.addToCart(product);
      
      const result = cartStore.updateQuantity(0, 5);
      expect(result).toBe(false);
      expect(cartStore.cart[0].quantity).toBe(1);
    });
  });

  describe('Cart Calculations', () => {
    it('should calculate total items count', () => {
      const product1 = createTestProduct({ id: 1 });
      const product2 = createTestProduct({ id: 2 });
      
      cartStore.addToCart(product1);
      cartStore.addToCart(product1); // quantity: 2
      cartStore.addToCart(product2); // quantity: 1
      
      expect(cartStore.cartItemsCount).toBe(3);
    });

    it('should calculate total price', () => {
      const product1 = createTestProduct({ id: 1, price: 1000 });
      const product2 = createTestProduct({ id: 2, price: 2000 });
      
      cartStore.addToCart(product1);
      cartStore.addToCart(product1); // 2 * 1000 = 2000
      cartStore.addToCart(product2); // 1 * 2000 = 2000
      
      expect(cartStore.cartTotal).toBe(4000);
    });

    it('should calculate non-data product total with tax', () => {
      const regularProduct = createTestProduct({ 
        id: 1, 
        price: 1000, 
        categoryId: 'regular' 
      });
      const dataProduct = createTestProduct({ 
        id: 2, 
        price: 2000, 
        categoryId: 'image-data' 
      });
      
      cartStore.addToCart(regularProduct);
      cartStore.addToCart(dataProduct);
      
      // Only regular product should be included, with tax (1000 * 1.1 = 1100)
      expect(cartStore.nonDataProductTotal).toBe(1100);
    });

    it('should check threshold status', () => {
      const product = createTestProduct({ 
        price: 50000, 
        categoryId: 'regular' 
      });
      
      expect(cartStore.isThresholdMet).toBe(false);
      
      cartStore.addToCart(product);
      // 50000 * 1.1 = 55000, which is >= 50000
      expect(cartStore.isThresholdMet).toBe(true);
    });
  });

  describe('Data Product Availability', () => {
    it('should allow non-data products regardless of threshold', () => {
      const product = createTestProduct({ categoryId: 'regular' });
      expect(cartStore.canOrderDataProduct(product)).toBe(true);
    });

    it('should allow data products that require threshold when threshold is met', () => {
      const product = createTestProduct({ 
        categoryId: 'image-data',
        requiresThreshold: true
      });
      
      expect(cartStore.canOrderDataProduct(product)).toBe(false);
      
      // Add product to meet threshold
      const thresholdProduct = createTestProduct({ 
        id: 999,
        price: 50000, 
        categoryId: 'regular' 
      });
      cartStore.addToCart(thresholdProduct);
      
      expect(cartStore.canOrderDataProduct(product)).toBe(true);
    });

    it('should disallow data products that become unavailable when threshold is met', () => {
      const product = createTestProduct({ 
        categoryId: 'image-data',
        unavailableWhenThresholdMet: true
      });
      
      expect(cartStore.canOrderDataProduct(product)).toBe(true);
      
      // Add product to meet threshold
      const thresholdProduct = createTestProduct({ 
        id: 999,
        price: 50000, 
        categoryId: 'regular' 
      });
      cartStore.addToCart(thresholdProduct);
      
      expect(cartStore.canOrderDataProduct(product)).toBe(false);
    });

    it('should check overall product availability', () => {
      const product = createTestProduct({ 
        categoryId: 'image-data',
        requiresThreshold: true,
        maxQuantity: 1
      });
      
      // Not available due to threshold
      expect(cartStore.isProductAvailable(product)).toBe(false);
      
      // Meet threshold
      const thresholdProduct = createTestProduct({ 
        id: 999,
        price: 50000, 
        categoryId: 'regular' 
      });
      cartStore.addToCart(thresholdProduct);
      
      // Now available
      expect(cartStore.isProductAvailable(product)).toBe(true);
      
      // Add to cart to reach max quantity
      cartStore.addToCart(product);
      
      // No longer available due to quantity limit
      expect(cartStore.isProductAvailable(product)).toBe(false);
    });
  });

  describe('Grouped Cart Items', () => {
    it('should group cart items by name and category', () => {
      const product1 = createTestProduct({ 
        id: 1, 
        name: 'Test Product',
        variation: 'Variation A',
        price: 1000
      });
      const product2 = createTestProduct({ 
        id: 2, 
        name: 'Test Product',
        variation: 'Variation B',
        price: 1200
      });
      const product3 = createTestProduct({ 
        id: 3, 
        name: 'Other Product',
        price: 800
      });
      
      cartStore.addToCart(product1);
      cartStore.addToCart(product2);
      cartStore.addToCart(product3);
      
      const grouped = cartStore.groupedCartItems;
      
      expect(grouped).toHaveLength(2);
      
      const testProductGroup = grouped.find(g => g.name === 'Test Product');
      expect(testProductGroup).toBeDefined();
      expect(testProductGroup!.items).toHaveLength(2);
      expect(testProductGroup!.totalQuantity).toBe(2);
      expect(testProductGroup!.totalPrice).toBe(2200);
      
      const otherProductGroup = grouped.find(g => g.name === 'Other Product');
      expect(otherProductGroup).toBeDefined();
      expect(otherProductGroup!.items).toHaveLength(1);
    });

    it('should sort variations correctly', () => {
      const product1 = createTestProduct({ 
        id: 1, 
        name: 'Test Product',
        variation: 'Variation B'
      });
      const product2 = createTestProduct({ 
        id: 2, 
        name: 'Test Product',
        variation: 'Variation A'
      });
      const product3 = createTestProduct({ 
        id: 3, 
        name: 'Test Product'
        // no variation
      });
      
      cartStore.addToCart(product1);
      cartStore.addToCart(product2);
      cartStore.addToCart(product3);
      
      const grouped = cartStore.groupedCartItems;
      const group = grouped[0];
      
      // Items without variation should come first, then sorted alphabetically
      expect(group.items[0].variation).toBeUndefined();
      expect(group.items[1].variation).toBe('Variation A');
      expect(group.items[2].variation).toBe('Variation B');
    });
  });

  describe('Helper Functions', () => {
    it('should find cart item by ID', () => {
      const product = createTestProduct();
      cartStore.addToCart(product);
      
      const found = cartStore.getCartItemById(product.id);
      expect(found).toBeDefined();
      expect(found!.id).toBe(product.id);
      
      const notFound = cartStore.getCartItemById(999);
      expect(notFound).toBeUndefined();
    });

    it('should check if product is in cart', () => {
      const product = createTestProduct();
      
      expect(cartStore.isInCart(product.id)).toBe(false);
      
      cartStore.addToCart(product);
      expect(cartStore.isInCart(product.id)).toBe(true);
    });

    it('should clear entire cart', () => {
      const product1 = createTestProduct({ id: 1 });
      const product2 = createTestProduct({ id: 2 });
      
      cartStore.addToCart(product1);
      cartStore.addToCart(product2);
      
      expect(cartStore.cart).toHaveLength(2);
      
      cartStore.clearCart();
      expect(cartStore.cart).toHaveLength(0);
      expect(cartStore.isEmpty).toBe(true);
    });
  });
});