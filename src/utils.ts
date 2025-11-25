import type { ProductType, CartItemType } from './types';

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
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
}