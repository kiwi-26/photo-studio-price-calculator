<template>
  <div class="min-h-screen pb-20">
    <!-- Category Sidebar -->
    <CategorySidebar 
      :categories="categories"
      :selected-category="selectedCategory"
      @update:selected-category="selectedCategory = $event"
    />

    <!-- Main Content with left margin for sidebar -->
    <div class="ml-16 md:ml-64">
      <AppHeader />

      <div class="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-4 sm:gap-6 lg:gap-8">
        <!-- Products Section -->
        <ProductsList 
          :products="products"
          :selected-category="selectedCategory"
          @add-to-cart="addToCart"
          @update:selected-category="selectedCategory = $event"
        />

        <!-- Cart Section - Hidden on mobile, visible on desktop -->
        <div class="hidden lg:block">
          <ShoppingCart 
            :cart="cart"
            @remove-from-cart="removeFromCart"
            @update-quantity="updateQuantity"
            @clear-cart="clearCart"
          />
        </div>
      </div>

      <!-- Sticky Cart Footer - Always visible -->
      <div class="lg:hidden">
        <StickyCartFooter 
          :cart="cart"
          @remove-from-cart="removeFromCart"
          @update-quantity="updateQuantity"
          @clear-cart="clearCart"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { products as productsData } from './assets/products';
import AppHeader from './components/AppHeader.vue';
import CategorySidebar from './components/CategorySidebar.vue';
import ProductsList from './components/ProductsList.vue';
import ShoppingCart from './components/ShoppingCart.vue';
import StickyCartFooter from './components/StickyCartFooter.vue';
import type { ProductType, CartItemType } from './types';

// State
const products = ref<ProductType[]>(productsData as ProductType[]);
const cart = ref<CartItemType[]>([]);
const selectedCategory = ref<string>('');

// Computed
const categories = computed(() => {
  const uniqueCategories = [...new Set(products.value.map(p => p.category))];
  return uniqueCategories.sort();
});

// Methods
const addToCart = (product: ProductType) => {
  const existingItemIndex = cart.value.findIndex(item => item.id === product.id);
  if (existingItemIndex !== -1 && cart.value[existingItemIndex]) {
    cart.value[existingItemIndex].quantity += 1;
  } else {
    cart.value.push({ ...product, quantity: 1 });
  }
};

const removeFromCart = (index: number) => {
  cart.value.splice(index, 1);
};

const updateQuantity = (index: number, newQuantity: number) => {
  if (newQuantity <= 0) {
    removeFromCart(index);
  } else if (cart.value[index]) {
    cart.value[index].quantity = newQuantity;
  }
};

const clearCart = () => {
  cart.value = [];
};
</script>
