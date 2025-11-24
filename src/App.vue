<template>
  <div class="min-h-screen pb-20">
    <!-- Category Sidebar -->
    <CategorySidebar 
      :categories="productsStore.categories"
      :selected-category="productsStore.selectedCategory"
      @update:selected-category="productsStore.setSelectedCategory"
    />

    <!-- Main Content with left margin for sidebar -->
    <div class="ml-16 md:ml-64">
      <AppHeader />

      <div class="grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8">
        <!-- Products Section -->
        <ProductsList 
          :products="productsStore.filteredProducts"
          :selected-category="productsStore.selectedCategory"
          @add-to-cart="cartStore.addToCart"
          @update:selected-category="productsStore.setSelectedCategory"
        />
      </div>

      <!-- Sticky Cart Footer - Always visible -->
      <div class="">
        <StickyCartFooter 
          :cart="cartStore.cart"
          @remove-from-cart="cartStore.removeFromCart"
          @update-quantity="cartStore.updateQuantity"
          @clear-cart="cartStore.clearCart"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from './components/AppHeader.vue';
import CategorySidebar from './components/CategorySidebar.vue';
import ProductsList from './components/ProductsList.vue';
import ShoppingCart from './components/ShoppingCart.vue';
import StickyCartFooter from './components/StickyCartFooter.vue';
import { useProductsStore, useCartStore } from './stores';

// Initialize stores
const productsStore = useProductsStore();
const cartStore = useCartStore();
</script>
