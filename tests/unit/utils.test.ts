import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TaxUtils, Analytics, UrlUtils } from '../../src/utils';
import type { ProductType, CartItemType } from '../../src/types';

describe('TaxUtils', () => {
  describe('toTaxInclusive', () => {
    it('should calculate tax-inclusive price correctly', () => {
      expect(TaxUtils.toTaxInclusive(1000)).toBe(1100);
      expect(TaxUtils.toTaxInclusive(2000)).toBe(2200);
      expect(TaxUtils.toTaxInclusive(1500)).toBe(1650);
    });

    it('should handle decimal results by flooring', () => {
      expect(TaxUtils.toTaxInclusive(1001)).toBe(1101); // 1001 * 1.1 = 1101.1 -> 1101
      expect(TaxUtils.toTaxInclusive(999)).toBe(1098); // 999 * 1.1 = 1098.9 -> 1098
    });

    it('should handle zero and negative values', () => {
      expect(TaxUtils.toTaxInclusive(0)).toBe(0);
      expect(TaxUtils.toTaxInclusive(-1000)).toBe(-1100);
    });
  });

  describe('toTaxExclusive', () => {
    it('should calculate tax-exclusive price correctly', () => {
      expect(TaxUtils.toTaxExclusive(1100)).toBe(1000);
      expect(TaxUtils.toTaxExclusive(2200)).toBe(2000);
      expect(TaxUtils.toTaxExclusive(1650)).toBe(1500);
    });

    it('should handle decimal results by flooring', () => {
      expect(TaxUtils.toTaxExclusive(1101)).toBe(1000); // 1101 / 1.1 = 1000.909... -> 1000
      expect(TaxUtils.toTaxExclusive(1099)).toBe(999); // 1099 / 1.1 = 999.090... -> 999
    });
  });

  describe('getTaxAmount', () => {
    it('should calculate tax amount correctly', () => {
      expect(TaxUtils.getTaxAmount(1000)).toBe(100);
      expect(TaxUtils.getTaxAmount(2000)).toBe(200);
      expect(TaxUtils.getTaxAmount(1500)).toBe(150);
    });

    it('should handle decimal results by flooring', () => {
      expect(TaxUtils.getTaxAmount(1001)).toBe(100); // 1001 * 0.1 = 100.1 -> 100
      expect(TaxUtils.getTaxAmount(999)).toBe(99); // 999 * 0.1 = 99.9 -> 99
    });
  });
});

describe('Analytics', () => {
  let mockGtag: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockGtag = vi.fn();
    Object.defineProperty(window, 'gtag', {
      value: mockGtag,
      writable: true
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const createTestProduct = (overrides: Partial<ProductType> = {}): ProductType => ({
    id: 1,
    name: 'Test Product',
    categoryId: 'test-category',
    description: 'Test description',
    photoCount: 5,
    price: 1000,
    ...overrides
  });

  const createTestCartItem = (overrides: Partial<CartItemType> = {}): CartItemType => ({
    id: 1,
    name: 'Test Product',
    categoryId: 'test-category',
    description: 'Test description',
    photoCount: 5,
    price: 1000,
    quantity: 1,
    ...overrides
  });

  describe('trackAddToCart', () => {
    it('should track add to cart event with correct parameters', () => {
      const product = createTestProduct({ id: 1, name: 'Test Product', price: 1500 });
      
      Analytics.trackAddToCart(product, 2);
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'add_to_cart', {
        currency: 'JPY',
        value: 3000, // 1500 * 2
        items: [{
          item_id: '1',
          item_name: 'Test Product',
          item_category: 'test-category',
          quantity: 2,
          price: 1500
        }]
      });
    });

    it('should use default quantity of 1', () => {
      const product = createTestProduct({ price: 1000 });
      
      Analytics.trackAddToCart(product);
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'add_to_cart', {
        currency: 'JPY',
        value: 1000,
        items: [{
          item_id: '1',
          item_name: 'Test Product',
          item_category: 'test-category',
          quantity: 1,
          price: 1000
        }]
      });
    });

    it('should not call gtag when window.gtag is not available', () => {
      delete (window as any).gtag;
      const product = createTestProduct();
      
      Analytics.trackAddToCart(product);
      
      expect(mockGtag).not.toHaveBeenCalled();
    });
  });

  describe('trackEvent', () => {
    it('should track custom event with parameters', () => {
      Analytics.trackEvent('custom_event', { param1: 'value1', param2: 123 });
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'custom_event', {
        param1: 'value1',
        param2: 123
      });
    });

    it('should track custom event without parameters', () => {
      Analytics.trackEvent('simple_event');
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'simple_event', {});
    });
  });
});

describe('UrlUtils', () => {
  const createTestCartItem = (overrides: Partial<CartItemType> = {}): CartItemType => ({
    id: 1,
    name: 'Test Product',
    categoryId: 'test-category',
    description: 'Test description',
    photoCount: 5,
    price: 1000,
    quantity: 1,
    ...overrides
  });

  describe('encodeCartToUrl', () => {
    it('should encode empty cart to empty string', () => {
      expect(UrlUtils.encodeCartToUrl([])).toBe('');
    });

    it('should encode single item correctly', () => {
      const cart = [createTestCartItem({ id: 1, quantity: 2 })];
      expect(UrlUtils.encodeCartToUrl(cart)).toBe('1:2');
    });

    it('should encode multiple items correctly', () => {
      const cart = [
        createTestCartItem({ id: 1, quantity: 2 }),
        createTestCartItem({ id: 'abc', quantity: 1 }),
        createTestCartItem({ id: 3, quantity: 5 })
      ];
      expect(UrlUtils.encodeCartToUrl(cart)).toBe('1:2,abc:1,3:5');
    });
  });

  describe('decodeUrlToCartData', () => {
    it('should decode empty string to empty array', () => {
      expect(UrlUtils.decodeUrlToCartData('')).toEqual([]);
      expect(UrlUtils.decodeUrlToCartData('   ')).toEqual([]);
    });

    it('should decode single item correctly', () => {
      const result = UrlUtils.decodeUrlToCartData('1:2');
      expect(result).toEqual([{ id: 1, quantity: 2 }]);
    });

    it('should decode multiple items correctly', () => {
      const result = UrlUtils.decodeUrlToCartData('1:2,abc:1,3:5');
      expect(result).toEqual([
        { id: 1, quantity: 2 },
        { id: 'abc', quantity: 1 },
        { id: 3, quantity: 5 }
      ]);
    });

    it('should handle invalid format gracefully', () => {
      expect(UrlUtils.decodeUrlToCartData('invalid')).toEqual([]);
      expect(UrlUtils.decodeUrlToCartData('1:abc')).toEqual([]);
      expect(UrlUtils.decodeUrlToCartData('1:0')).toEqual([]);
      expect(UrlUtils.decodeUrlToCartData('1:-1')).toEqual([]);
    });
  });

  describe('copyToClipboard', () => {
    it('should use navigator.clipboard when available', async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        writable: true
      });
      Object.defineProperty(window, 'isSecureContext', {
        value: true,
        writable: true
      });

      const result = await UrlUtils.copyToClipboard('test text');
      
      expect(result).toBe(true);
      expect(mockWriteText).toHaveBeenCalledWith('test text');
    });

    it('should handle errors gracefully', async () => {
      const mockWriteText = vi.fn().mockRejectedValue(new Error('Copy failed'));
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        writable: true
      });
      Object.defineProperty(window, 'isSecureContext', {
        value: true,
        writable: true
      });

      const result = await UrlUtils.copyToClipboard('test text');
      
      expect(result).toBe(false);
    });
  });
});