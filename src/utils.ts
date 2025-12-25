import type { ProductType, CartItemType } from './types';

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

/**
 * Tax calculation constants and utilities
 */
export const TAX_RATE = 0.10; // Japan consumption tax rate (10%)

/**
 * Tax calculation utility functions
 */
export class TaxUtils {
  /**
   * Convert tax-exclusive price to tax-inclusive price
   */
  static toTaxInclusive(taxExclusivePrice: number): number {
    return Math.floor(taxExclusivePrice * (1 + TAX_RATE));
  }

  /**
   * Convert tax-inclusive price to tax-exclusive price
   */
  static toTaxExclusive(taxInclusivePrice: number): number {
    return Math.floor(taxInclusivePrice / (1 + TAX_RATE));
  }

  /**
   * Calculate tax amount from tax-exclusive price
   */
  static getTaxAmount(taxExclusivePrice: number): number {
    return Math.floor(taxExclusivePrice * TAX_RATE);
  }
}

/**
 * GA4 Analytics utility functions
 */
export class Analytics {
  /**
   * Track add to cart event
   */
  static trackAddToCart(product: ProductType, quantity: number = 1) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'add_to_cart', {
        currency: 'JPY',
        value: product.price * quantity,
        items: [{
          item_id: product.id.toString(),
          item_name: product.name,
          item_category: product.categoryId,
          quantity: quantity,
          price: product.price
        }]
      });
    }
  }

  /**
   * Track remove from cart event
   */
  static trackRemoveFromCart(item: CartItemType) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'remove_from_cart', {
        currency: 'JPY',
        value: item.price * item.quantity,
        items: [{
          item_id: item.id.toString(),
          item_name: item.name,
          item_category: item.categoryId,
          quantity: item.quantity,
          price: item.price
        }]
      });
    }
  }

  /**
   * Track view item event
   */
  static trackViewItem(product: ProductType) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'view_item', {
        currency: 'JPY',
        value: product.price,
        items: [{
          item_id: product.id.toString(),
          item_name: product.name,
          item_category: product.categoryId,
          price: product.price
        }]
      });
    }
  }

  /**
   * Track view cart event
   */
  static trackViewCart(cart: CartItemType[]) {
    if (typeof window !== 'undefined' && window.gtag) {
      const totalValue = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      window.gtag('event', 'view_cart', {
        currency: 'JPY',
        value: totalValue,
        items: cart.map(item => ({
          item_id: item.id.toString(),
          item_name: item.name,
          item_category: item.categoryId,
          quantity: item.quantity,
          price: item.price
        }))
      });
    }
  }

  /**
   * Track custom event
   */
  static trackEvent(eventName: string, parameters: Record<string, any> = {}) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, parameters);
    }
  }

  /**
   * Track share estimate event
   */
  static trackShareEstimate(cart: CartItemType[]) {
    if (typeof window !== 'undefined' && window.gtag) {
      const totalValue = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
      
      window.gtag('event', 'share', {
        method: 'link',
        content_type: 'estimate',
        currency: 'JPY',
        value: totalValue,
        custom_parameters: {
          total_items: totalItems,
          total_products: cart.length
        }
      });
    }
  }
}

/**
 * URL parameter utility functions for cart state persistence
 */
export class UrlUtils {
  /**
   * Encode cart items to URL parameter string
   * Format: "id1:qty1,id2:qty2,id3:qty3"
   */
  static encodeCartToUrl(cart: CartItemType[]): string {
    if (cart.length === 0) {
      return '';
    }
    
    return cart
      .map(item => `${item.id}:${item.quantity}`)
      .join(',');
  }

  /**
   * Decode URL parameter string to cart item data
   * Returns array of {id, quantity} objects
   */
  static decodeUrlToCartData(urlParam: string): Array<{id: string | number, quantity: number}> {
    if (!urlParam || urlParam.trim() === '') {
      return [];
    }

    try {
      return urlParam
        .split(',')
        .map(pair => {
          const [id, qty] = pair.split(':');
          if (!id || !qty) {
            throw new Error(`Invalid pair format: ${pair}`);
          }
          
          const quantity = parseInt(qty, 10);
          if (isNaN(quantity) || quantity <= 0) {
            throw new Error(`Invalid quantity: ${qty}`);
          }

          // Try to parse as number, fallback to string
          const parsedId = isNaN(Number(id)) ? id : Number(id);
          
          return { id: parsedId, quantity };
        })
        .filter(item => item.id !== null && item.id !== undefined);
    } catch (error) {
      console.warn('Failed to decode URL cart data:', error);
      return [];
    }
  }

  /**
   * Generate shareable URL with current cart state
   */
  static generateShareableUrl(cart: CartItemType[]): string {
    const baseUrl = window.location.origin + window.location.pathname;
    const cartParam = this.encodeCartToUrl(cart);
    
    if (cartParam === '') {
      return baseUrl;
    }
    
    const url = new URL(baseUrl);
    url.searchParams.set('items', cartParam);
    return url.toString();
  }

  /**
   * Get cart data from current URL parameters
   */
  static getCartDataFromUrl(): Array<{id: string | number, quantity: number}> {
    const urlParams = new URLSearchParams(window.location.search);
    const itemsParam = urlParams.get('items');
    
    if (!itemsParam) {
      return [];
    }
    
    return this.decodeUrlToCartData(itemsParam);
  }

  /**
   * Copy text to clipboard with fallback for older browsers
   */
  static async copyToClipboard(text: string): Promise<boolean> {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        return success;
      }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }
}