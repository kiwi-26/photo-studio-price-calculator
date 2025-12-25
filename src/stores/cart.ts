import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { ProductType, CartItemType } from '../types';
import { Analytics } from '../utils';
import { useProductsStore } from './products';

// Interface for grouped cart items display
export interface GroupedCartItemType {
  name: string;
  categoryId: string;
  items: CartItemType[];
  totalQuantity: number;
  totalPrice: number;
}

export const useCartStore = defineStore('cart', () => {
  // State
  const cart = ref<CartItemType[]>([]);

  // Getters
  const cartItemsCount = computed(() => {
    return cart.value.reduce((total, item) => total + item.quantity, 0);
  });

  const cartTotal = computed(() => {
    return cart.value.reduce((total, item) => total + (item.price * item.quantity), 0);
  });

  const isEmpty = computed(() => {
    return cart.value.length === 0;
  });

  // Grouped cart items for display purposes
  const groupedCartItems = computed((): GroupedCartItemType[] => {
    const groups = new Map<string, CartItemType[]>();
    
    // Group cart items by name + categoryId
    cart.value.forEach(item => {
      const groupKey = `${item.name}|${item.categoryId}`;
      if (!groups.has(groupKey)) {
        groups.set(groupKey, []);
      }
      groups.get(groupKey)!.push(item);
    });
    
    // Convert to grouped cart items
    return Array.from(groups.entries()).map(([groupKey, items]) => {
      const baseItem = items[0];
      const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return {
        name: baseItem.name,
        categoryId: baseItem.categoryId,
        items: items.sort((a, b) => {
          // Sort by variation name, putting items without variation first
          if (!a.variation && b.variation) return -1;
          if (a.variation && !b.variation) return 1;
          if (!a.variation && !b.variation) return 0;
          return a.variation!.localeCompare(b.variation!, 'ja');
        }),
        totalQuantity,
        totalPrice
      };
    }).sort((a, b) => a.name.localeCompare(b.name, 'ja'));
  });

  // Actions
  const addToCart = (product: ProductType) => {
    // Check if product has a maximum quantity limit
    if (product.maxQuantity !== undefined) {
      const existingItem = cart.value.find(item => item.id === product.id);
      const currentQuantity = existingItem ? existingItem.quantity : 0;
      
      if (currentQuantity >= product.maxQuantity) {
        // Cannot add more items - already at maximum
        console.warn(`Cannot add more ${product.name} - maximum quantity (${product.maxQuantity}) reached`);
        return false; // Indicate that the item was not added
      }
    }
    
    const existingItemIndex = cart.value.findIndex(item => item.id === product.id);
    if (existingItemIndex !== -1 && cart.value[existingItemIndex]) {
      cart.value[existingItemIndex].quantity += 1;
      // Track add to cart event for existing item
      Analytics.trackAddToCart(product, 1);
    } else {
      cart.value.push({ ...product, quantity: 1 });
      // Track add to cart event for new item
      Analytics.trackAddToCart(product, 1);
    }
    
    return true; // Indicate that the item was successfully added
  };

  const removeFromCart = (index: number) => {
    if (index >= 0 && index < cart.value.length) {
      const removedItem = cart.value[index];
      if (removedItem) {
        // Track remove from cart event
        Analytics.trackRemoveFromCart(removedItem);
      }
      cart.value.splice(index, 1);
    }
  };

  const removeItemById = (id: number | string) => {
    const index = cart.value.findIndex(item => item.id === id);
    if (index !== -1) {
      removeFromCart(index);
    }
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(index);
    } else if (cart.value[index]) {
      const item = cart.value[index];
      
      // Check if product has a maximum quantity limit
      if (item.maxQuantity !== undefined && newQuantity > item.maxQuantity) {
        console.warn(`Cannot set quantity to ${newQuantity} for ${item.name} - maximum quantity is ${item.maxQuantity}`);
        return false; // Indicate that the quantity was not updated
      }
      
      const oldQuantity = item.quantity;
      item.quantity = newQuantity;
      
      // Track quantity change as add/remove events
      const quantityDiff = newQuantity - oldQuantity;
      if (quantityDiff > 0) {
        // Quantity increased - track as add to cart
        Analytics.trackAddToCart(item, quantityDiff);
      } else if (quantityDiff < 0) {
        // Quantity decreased - track as remove from cart
        const tempItem = { ...item, quantity: Math.abs(quantityDiff) };
        Analytics.trackRemoveFromCart(tempItem);
      }
      
      return true; // Indicate that the quantity was successfully updated
    }
    
    return false;
  };

  const updateQuantityById = (id: number | string, newQuantity: number) => {
    const index = cart.value.findIndex(item => item.id === id);
    if (index !== -1) {
      updateQuantity(index, newQuantity);
    }
  };

  const clearCart = () => {
    cart.value = [];
  };

  const getCartItemById = (id: number | string): CartItemType | undefined => {
    return cart.value.find(item => item.id === id);
  };

  const isInCart = (id: number | string): boolean => {
    return cart.value.some(item => item.id === id);
  };

  // Helper function to check if a product can be added to cart (respects maxQuantity)
  const canAddToCart = (product: ProductType): boolean => {
    if (product.maxQuantity === undefined) {
      return true; // No limit
    }
    
    const existingItem = cart.value.find(item => item.id === product.id);
    const currentQuantity = existingItem ? existingItem.quantity : 0;
    return currentQuantity < product.maxQuantity;
  };

  // Helper function to get remaining quantity that can be added
  const getRemainingQuantity = (product: ProductType): number | null => {
    if (product.maxQuantity === undefined) {
      return null; // No limit
    }
    
    const existingItem = cart.value.find(item => item.id === product.id);
    const currentQuantity = existingItem ? existingItem.quantity : 0;
    return Math.max(0, product.maxQuantity - currentQuantity);
  };

  return {
    // State
    cart,
    // Getters
    cartItemsCount,
    cartTotal,
    isEmpty,
    groupedCartItems,
    // Actions
    addToCart,
    removeFromCart,
    removeItemById,
    updateQuantity,
    updateQuantityById,
    clearCart,
    getCartItemById,
    isInCart,
    canAddToCart,
    getRemainingQuantity
  };
});