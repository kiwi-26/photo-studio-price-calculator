<template>
  <div 
    class="border border-primary/30 rounded-lg p-2 sm:p-3 transition-all duration-200 bg-primary/5 flex flex-col h-full"
  >
    <!-- Category Badge -->
    <div class="mb-2">
      <span class="inline-block py-0.5 px-2 bg-primary text-white rounded-full text-xs font-semibold">{{ getCategoryDisplayName(product.categoryId) }}</span>
    </div>
    
    <!-- Product Name -->
    <h3 class="text-sm sm:text-base font-semibold mb-2 text-primary line-clamp-2 flex-grow">{{ product.name }}</h3>
    
    <!-- Description - Hidden on mobile, shown on larger screens -->
    <!-- <p class="hidden sm:block text-xs opacity-80 mb-2 line-clamp-2">{{ product.description }}</p> -->
    
    <!-- Compact Info Section -->
    <div class="mb-2 p-2 bg-primary/10 rounded text-sm">
      <!-- Photo Count and Price in one row -->
      <div class="flex justify-between items-center mb-1">
        <span class="flex items-center">
          <CameraIcon class="w-3 h-3 mr-1" />
          {{ product.photoCount }}
        </span>
        <div class="text-right">
          <span class="font-semibold text-success">¥{{ effectivePrice.toLocaleString() }}</span>
          <div v-if="hasCharacterDesignFee" class="text-xs text-orange-600 dark:text-orange-400">
            キャラデザ料込み
          </div>
        </div>
      </div>
      
      <!-- Variation if exists -->
      <div v-if="product.variation" class="text-center pt-1 border-t border-primary/20">
        <span class="text-sm opacity-75">{{ product.variation }}</span>
      </div>
      
      <!-- Quantity Limit Info -->
      <div v-if="hasQuantityLimit" class="text-center pt-1 border-t border-primary/20">
        <span class="text-xs text-yellow-600 dark:text-yellow-400">
          最大{{ product.maxQuantity }}個まで
          <span v-if="remainingQuantity !== null" class="block">
            残り{{ remainingQuantity }}個
          </span>
        </span>
      </div>
      
      <!-- Data Product Status Info -->
      <div v-if="isDataProduct && dataProductStatus !== 'available'" class="text-center pt-1 border-t border-primary/20">
        <span v-if="dataProductStatus === 'requires-threshold'" class="text-xs text-blue-600 dark:text-blue-400">
          データ商品以外で税込50,000円以上購入時に注文可能
        </span>
        <span v-else-if="dataProductStatus === 'unavailable-threshold-met'" class="text-xs text-red-600 dark:text-red-400">
          50,000円以上購入時は選択不可
        </span>
      </div>
    </div>
    
    <!-- Action Buttons -->
    <div class="flex gap-2">
      <button 
        @click="$emit('show-detail', product)" 
        class="flex-1 bg-pink-100 dark:bg-pink-600 bg-opacity-50 text-gray-700 dark:text-gray-300 border border-pink-200 dark:border-pink-600 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded transition-colors duration-200 hover:bg-pink-100 dark:hover:bg-pink-500"
      >
        詳細
      </button>
      <button 
        @click="handleAddToCart" 
        :disabled="!canAddToCart"
        :class="[
          'flex-1 border-none py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded transition-colors duration-200',
          canAddToCart 
            ? 'bg-primary text-white hover:bg-primary-hover' 
            : 'bg-gray-400 text-gray-200 cursor-not-allowed'
        ]"
      >
        <span v-if="canAddToCart">追加</span>
        <span v-else-if="hasQuantityLimit && remainingQuantity === 0">上限</span>
        <span v-else-if="dataProductStatus === 'requires-threshold'">条件未達</span>
        <span v-else-if="dataProductStatus === 'unavailable-threshold-met'">選択不可</span>
        <span v-else>追加不可</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CameraIcon } from '@heroicons/vue/24/solid';
import { getCategoryDisplayName } from '../assets/categories';
import { useProductsStore, useCartStore } from '../stores';
import type { ProductType } from '../types';

const props = defineProps<{ product: ProductType }>();
defineEmits<{ 
  (e: 'add-to-cart', product: ProductType): void;
  (e: 'show-detail', product: ProductType): void;
}>();

const productsStore = useProductsStore();
const cartStore = useCartStore();

const effectivePrice = computed(() => {
  return productsStore.getEffectivePrice(props.product);
});

const hasCharacterDesignFee = computed(() => {
  return productsStore.characterDesignFee && productsStore.isCharacterDesignApplicable(props.product);
});

const hasQuantityLimit = computed(() => {
  return props.product.maxQuantity !== undefined;
});

const canAddToCart = computed(() => {
  return cartStore.isProductAvailable(props.product);
});

const isDataProduct = computed(() => {
  return props.product.categoryId === 'image-data';
});

const dataProductStatus = computed(() => {
  if (!isDataProduct.value) return null;
  
  if (props.product.requiresThreshold) {
    return cartStore.isThresholdMet ? 'available' : 'requires-threshold';
  }
  
  if (props.product.unavailableWhenThresholdMet) {
    return cartStore.isThresholdMet ? 'unavailable-threshold-met' : 'available';
  }
  
  return 'available';
});

const remainingQuantity = computed(() => {
  return cartStore.getRemainingQuantity(props.product);
});

const handleAddToCart = () => {
  if (canAddToCart.value) {
    cartStore.addToCart(props.product);
  }
};
</script>