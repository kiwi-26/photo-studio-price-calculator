import { describe, it, expect, beforeEach } from 'vitest';
import { createTestPinia } from '../../utils';
import { useCartStore } from '../../../src/stores/cart';
import type { ProductType } from '../../../src/types';

describe('Cart Store', () => {
  let cartStore: ReturnType<typeof useCartStore>;

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
  });

  describe('Helper Functions', () => {
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