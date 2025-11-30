import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { ProductType, CartItemType } from '../types';
import { Analytics } from '../utils';
import { useProductsStore } from './products';

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

  // Actions
  const addToCart = (product: ProductType) => {
    const productsStore = useProductsStore();
    const effectivePrice = productsStore.getEffectivePrice(product);
    
    const existingItemIndex = cart.value.findIndex(item => item.id === product.id);
    if (existingItemIndex !== -1 && cart.value[existingItemIndex]) {
      cart.value[existingItemIndex].quantity += 1;
      // Update the price in case character design fee setting has changed
      cart.value[existingItemIndex].price = effectivePrice;
      // Track add to cart event for existing item
      Analytics.trackAddToCart(product, 1);
    } else {
      cart.value.push({ ...product, price: effectivePrice, quantity: 1 });
      // Track add to cart event for new item
      Analytics.trackAddToCart(product, 1);
    }
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
      const oldQuantity = cart.value[index].quantity;
      cart.value[index].quantity = newQuantity;
      
      // Track quantity change as add/remove events
      const quantityDiff = newQuantity - oldQuantity;
      if (quantityDiff > 0) {
        // Quantity increased - track as add to cart
        Analytics.trackAddToCart(cart.value[index], quantityDiff);
      } else if (quantityDiff < 0) {
        // Quantity decreased - track as remove from cart
        const tempItem = { ...cart.value[index], quantity: Math.abs(quantityDiff) };
        Analytics.trackRemoveFromCart(tempItem);
      }
    }
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

  return {
    // State
    cart,
    // Getters
    cartItemsCount,
    cartTotal,
    isEmpty,
    // Actions
    addToCart,
    removeFromCart,
    removeItemById,
    updateQuantity,
    updateQuantityById,
    clearCart,
    getCartItemById,
    isInCart
  };
});