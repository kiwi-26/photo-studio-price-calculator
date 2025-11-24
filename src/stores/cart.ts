import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { ProductType, CartItemType } from '../types';

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
    const existingItemIndex = cart.value.findIndex(item => item.id === product.id);
    if (existingItemIndex !== -1 && cart.value[existingItemIndex]) {
      cart.value[existingItemIndex].quantity += 1;
    } else {
      cart.value.push({ ...product, quantity: 1 });
    }
  };

  const removeFromCart = (index: number) => {
    if (index >= 0 && index < cart.value.length) {
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
      cart.value[index].quantity = newQuantity;
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