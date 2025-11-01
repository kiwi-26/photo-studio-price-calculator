<template>
  <div 
    class="border border-primary/30 rounded-lg p-2 sm:p-3 transition-all duration-200 bg-primary/5 flex flex-col h-full"
  >
    <!-- Category Badge -->
    <div class="mb-2">
      <span class="inline-block py-0.5 px-2 bg-primary text-white rounded-full text-xs font-semibold">{{ product.category }}</span>
    </div>
    
    <!-- Product Name -->
    <h3 class="text-sm sm:text-base font-semibold mb-2 text-primary line-clamp-2 flex-grow">{{ product.name }}</h3>
    
    <!-- Description - Hidden on mobile, shown on larger screens -->
    <p class="hidden sm:block text-xs opacity-80 mb-2 line-clamp-2">{{ product.description }}</p>
    
    <!-- Compact Info Section -->
    <div class="mb-2 p-2 bg-primary/10 rounded text-xs">
      <!-- Photo Count and Price in one row -->
      <div class="flex justify-between items-center mb-1">
        <span class="flex items-center">
          <CameraIcon class="w-3 h-3 mr-1" />
          {{ product.photoCount }}
        </span>
        <span class="font-semibold text-success">¥{{ product.price.toLocaleString() }}</span>
      </div>
      
      <!-- Variation if exists -->
      <div v-if="product.variation" class="text-center pt-1 border-t border-primary/20">
        <span class="text-xs opacity-75">{{ product.variation }}</span>
      </div>
    </div>
    
    <!-- Compact Add Button -->
    <button 
      @click="$emit('add-to-cart', product)" 
      class="w-full bg-primary text-white border-none py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded transition-colors duration-200 hover:bg-primary-hover"
    >
      追加
    </button>
  </div>
</template>

<script setup lang="ts">
import { CameraIcon } from '@heroicons/vue/24/solid';
import type { ProductType } from '../types';

defineProps<{ product: ProductType }>();
defineEmits<{ (e: 'add-to-cart', product: ProductType): void }>();
</script>