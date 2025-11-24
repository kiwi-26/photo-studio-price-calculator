<template>
  <div class="min-h-screen pb-20">
    <!-- Category Sidebar -->
    <CategorySidebar 
      :categories="productsStore.categories"
      :selected-category="productsStore.selectedCategory"
      :pose-count-filters="productsStore.poseCountFilters"
      :selected-pose-count-filter="productsStore.selectedPoseCountFilter"
      @update:selected-category="productsStore.setSelectedCategory"
      @update:selected-pose-count-filter="productsStore.setSelectedPoseCountFilter"
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
          @show-detail="handleShowDetail"
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

    <!-- Product Detail Modal -->
    <ProductDetailModal
      :is-open="modalState.isOpen"
      :product-id="modalState.productId"
      :product-list="modalState.productList"
      @close="closeModal"
      @update:product-id="updateModalProductId"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AppHeader from './components/AppHeader.vue';
import CategorySidebar from './components/CategorySidebar.vue';
import ProductsList from './components/ProductsList.vue';
import ShoppingCart from './components/ShoppingCart.vue';
import StickyCartFooter from './components/StickyCartFooter.vue';
import ProductDetailModal from './components/ProductDetailModal.vue';
import { useProductsStore, useCartStore } from './stores';
import type { ProductType } from './types';

// Initialize stores
const productsStore = useProductsStore();
const cartStore = useCartStore();

// Modal state management
const modalState = ref({
  isOpen: false,
  productId: null as string | number | null,
  productList: [] as ProductType[]
});

// Modal methods
const handleShowDetail = (data: { product: ProductType; productList: ProductType[] }) => {
  modalState.value = {
    isOpen: true,
    productId: data.product.id,
    productList: data.productList
  };
};

const closeModal = () => {
  modalState.value.isOpen = false;
};

const updateModalProductId = (productId: string | number) => {
  modalState.value.productId = productId;
};
</script>
