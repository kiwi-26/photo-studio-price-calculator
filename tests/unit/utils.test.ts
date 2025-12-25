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

  describe('trackRemoveFromCart', () => {
    it('should track remove from cart event with correct parameters', () => {
      const item = createTestCartItem({ id: 2, name: 'Cart Item', price: 2000, quantity: 3 });
      
      Analytics.trackRemoveFromCart(item);
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'remove_from_cart', {
        currency: 'JPY',
        value: 6000, // 2000 * 3
        items: [{
          item_id: '2',
          item_name: 'Cart Item',
          item_category: 'test-category',
          quantity: 3,
          price: 2000
        }]
      });
    });
  });

  describe('trackViewItem', () => {
    it('should track view item event with correct parameters', () => {
      const product = createTestProduct({ id: 3, name: 'Viewed Product', price: 1200 });
      
      Analytics.trackViewItem(product);
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'view_item', {
        currency: 'JPY',
        value: 1200,
        items: [{
          item_id: '3',
          item_name: 'Viewed Product',
          item_category: 'test-category',
          price: 1200
        }]
      });
    });
  });

  describe('trackViewCart', () => {
    it('should track view cart event with multiple items', () => {
      const cart = [
        createTestCartItem({ id: 1, price: 1000, quantity: 2 }),
        createTestCartItem({ id: 2, price: 1500, quantity: 1 })
      ];
      
      Analytics.trackViewCart(cart);
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'view_cart', {
        currency: 'JPY',
        value: 3500, // (1000 * 2) + (1500 * 1)
        items: [
          {
            item_id: '1',
            item_name: 'Test Product',
            item_category: 'test-category',
            quantity: 2,
            price: 1000
          },
          {
            item_id: '2',
            item_name: 'Test Product',
            item_category: 'test-category',
            quantity: 1,
            price: 1500
          }
        ]
      });
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

  describe('trackShareEstimate', () => {
    it('should track share estimate event with cart data', () => {
      const cart = [
        createTestCartItem({ id: 1, price: 1000, quantity: 2 }),
        createTestCartItem({ id: 2, price: 1500, quantity: 1 })
      ];
      
      Analytics.trackShareEstimate(cart);
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'share', {
        method: 'link',
        content_type: 'estimate',
        currency: 'JPY',
        value: 3500,
        custom_parameters: {
          total_items: 3, // 2 + 1
          total_products: 2
        }
      });
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

    it('should handle string IDs correctly', () => {
      const result = UrlUtils.decodeUrlToCartData('product-a:1,product-b:3');
      expect(result).toEqual([
        { id: 'product-a', quantity: 1 },
        { id: 'product-b', quantity: 3 }
      ]);
    });

    it('should handle invalid format gracefully', () => {
      expect(UrlUtils.decodeUrlToCartData('invalid')).toEqual([]);
      expect(UrlUtils.decodeUrlToCartData('1:abc')).toEqual([]);
      expect(UrlUtils.decodeUrlToCartData('1:0')).toEqual([]);
      expect(UrlUtils.decodeUrlToCartData('1:-1')).toEqual([]);
    });

    it('should filter out invalid pairs but keep valid ones', () => {
      const result = UrlUtils.decodeUrlToCartData('1:2,invalid,3:1,4:abc,5:3');
      expect(result).toEqual([
        { id: 1, quantity: 2 },
        { id: 3, quantity: 1 },
        { id: 5, quantity: 3 }
      ]);
    });
  });

  describe('generateShareableUrl', () => {
    beforeEach(() => {
      // Mock window.location
      Object.defineProperty(window, 'location', {
        value: {
          origin: 'https://example.com',
          pathname: '/calculator',
          search: ''
        },
        writable: true
      });
    });

    it('should generate base URL for empty cart', () => {
      const url = UrlUtils.generateShareableUrl([]);
      expect(url).toBe('https://example.com/calculator');
    });

    it('should generate URL with cart parameters', () => {
      const cart = [
        createTestCartItem({ id: 1, quantity: 2 }),
        createTestCartItem({ id: 2, quantity: 1 })
      ];
      const url = UrlUtils.generateShareableUrl(cart);
      expect(url).toBe('https://example.com/calculator?items=1%3A2%2C2%3A1');
    });
  });

  describe('getCartDataFromUrl', () => {
    beforeEach(() => {
      // Mock URLSearchParams
      Object.defineProperty(window, 'location', {
        value: {
          search: ''
        },
        writable: true
      });
    });

    it('should return empty array when no items parameter', () => {
      window.location.search = '';
      expect(UrlUtils.getCartDataFromUrl()).toEqual([]);
    });

    it('should decode items parameter correctly', () => {
      window.location.search = '?items=1%3A2%2C2%3A1'; // URL encoded "1:2,2:1"
      expect(UrlUtils.getCartDataFromUrl()).toEqual([
        { id: 1, quantity: 2 },
        { id: 2, quantity: 1 }
      ]);
    });

    it('should handle other parameters in URL', () => {
      window.location.search = '?other=value&items=1%3A1&another=param';
      expect(UrlUtils.getCartDataFromUrl()).toEqual([
        { id: 1, quantity: 1 }
      ]);
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

    it('should use fallback when navigator.clipboard is not available', async () => {
      // Mock document methods
      const mockTextArea = {
        value: '',
        style: {},
        focus: vi.fn(),
        select: vi.fn()
      };
      const mockCreateElement = vi.fn().mockReturnValue(mockTextArea);
      const mockAppendChild = vi.fn();
      const mockRemoveChild = vi.fn();
      const mockExecCommand = vi.fn().mockReturnValue(true);

      Object.defineProperty(document, 'createElement', {
        value: mockCreateElement,
        writable: true
      });
      Object.defineProperty(document.body, 'appendChild', {
        value: mockAppendChild,
        writable: true
      });
      Object.defineProperty(document.body, 'removeChild', {
        value: mockRemoveChild,
        writable: true
      });
      Object.defineProperty(document, 'execCommand', {
        value: mockExecCommand,
        writable: true
      });

      // Remove navigator.clipboard
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        writable: true
      });

      const result = await UrlUtils.copyToClipboard('fallback text');
      
      expect(result).toBe(true);
      expect(mockCreateElement).toHaveBeenCalledWith('textarea');
      expect(mockTextArea.value).toBe('fallback text');
      expect(mockAppendChild).toHaveBeenCalledWith(mockTextArea);
      expect(mockTextArea.focus).toHaveBeenCalled();
      expect(mockTextArea.select).toHaveBeenCalled();
      expect(mockExecCommand).toHaveBeenCalledWith('copy');
      expect(mockRemoveChild).toHaveBeenCalledWith(mockTextArea);
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