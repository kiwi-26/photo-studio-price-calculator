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
    
    <!-- Compact Info Section -->
    <div class="mb-2 p-2 bg-primary/10 rounded text-sm">
      <!-- Photo Count and Base Price -->
      <div class="flex justify-between items-center mb-1">
        <span class="flex items-center">
          <CameraIcon class="w-3 h-3 mr-1" />
          {{ product.basePhotoCount }}
        </span>
        <div class="text-right">
          <span class="font-semibold text-success">¥{{ product.basePrice.toLocaleString() }}〜</span>
        </div>
      </div>
      
      <!-- Variations Count -->
      <div class="text-center pt-1 border-t border-primary/20">
        <span class="text-sm opacity-75">{{ product.variations.length }}種類のバリエーション</span>
      </div>
    </div>
    
    <!-- Variations List -->
    <div class="mb-3 space-y-2 flex-grow">
      <div 
        v-for="variation in product.variations" 
        :key="variation.id"
        class="flex items-center justify-between p-2 bg-white/50 rounded border border-primary/10"
      >
        <div class="flex-1 min-w-0">
          <div class="text-xs font-medium text-gray-700 truncate">{{ variation.variation }}</div>
          <div class="flex items-center gap-2 text-xs text-gray-600">
            <span class="flex items-center">
              <CameraIcon class="w-2.5 h-2.5 mr-1" />
              {{ variation.photoCount }}
            </span>
            <span class="font-semibold text-success">¥{{ variation.price.toLocaleString() }}</span>
          </div>
        </div>
        <button 
          @click="$emit('add-to-cart', getVariationAsProduct(variation))" 
          class="ml-2 bg-primary text-white border-none py-1 px-2 text-xs font-semibold rounded transition-colors duration-200 hover:bg-primary-hover flex-shrink-0"
        >
          追加
        </button>
      </div>
    </div>
    
    <!-- Action Buttons -->
    <div class="flex gap-2">
      <button 
        @click="$emit('show-detail', getFirstVariationAsProduct())" 
        class="flex-1 bg-pink-100 dark:bg-pink-600 bg-opacity-50 text-gray-700 dark:text-gray-300 border border-pink-200 dark:border-pink-600 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded transition-colors duration-200 hover:bg-pink-100 dark:hover:bg-pink-500"
      >
        詳細
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CameraIcon } from '@heroicons/vue/24/solid';
import { getCategoryDisplayName } from '../assets/categories';
import type { GroupedProductType, ProductType, ProductVariationType } from '../types';

const props = defineProps<{ product: GroupedProductType }>();
defineEmits<{ 
  (e: 'add-to-cart', product: ProductType): void;
  (e: 'show-detail', product: ProductType): void;
}>();

const getVariationAsProduct = (variation: ProductVariationType): ProductType => {
  return {
    id: variation.id,
    name: props.product.name,
    categoryId: props.product.categoryId,
    description: variation.description || props.product.description,
    photoCount: variation.photoCount,
    price: variation.price,
    variation: variation.variation
  };
};

const getFirstVariationAsProduct = (): ProductType => {
  return getVariationAsProduct(props.product.variations[0]);
};
</script>