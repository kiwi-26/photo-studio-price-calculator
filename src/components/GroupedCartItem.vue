<template>
  <div class="p-4 mb-4 bg-primary/10 rounded-lg border border-primary/20">
    <!-- Product Header -->
    <div class="mb-3">
      <h4 class="text-base font-semibold mb-1">{{ groupedItem.name }}</h4>
      <p class="text-sm opacity-70">{{ getCategoryDisplayName(groupedItem.categoryId) }}</p>
      <div class="text-sm text-gray-600 mt-1">
        <span class="font-medium">合計: {{ groupedItem.totalQuantity }}個</span>
        <span class="ml-3 text-success font-semibold">¥{{ groupedItem.totalPrice.toLocaleString() }}</span>
      </div>
    </div>
    
    <!-- Individual Variations -->
    <div class="space-y-3">
      <div 
        v-for="(item, index) in groupedItem.items" 
        :key="item.id"
        class="flex justify-between items-start p-3 bg-white/50 rounded border border-primary/10"
      >
        <div class="flex-1">
          <!-- Variation Name -->
          <div v-if="item.variation" class="mb-1">
            <span class="text-sm font-medium text-blue-700 dark:text-blue-300">{{ item.variation }}</span>
          </div>
          <div v-else class="mb-1">
            <span class="text-sm font-medium text-gray-600">標準</span>
          </div>
          
          <!-- Item Details -->
          <div class="flex justify-between text-sm mb-2">
            <span>{{ item.photoCount }} ポーズ</span>
            <span class="text-success font-semibold">¥{{ item.price.toLocaleString() }}</span>
          </div>
          
          <!-- Quantity Controls -->
          <div class="flex items-center gap-3">
            <span class="text-sm font-medium">数量:</span>
            <div class="flex items-center gap-2">
              <button 
                @click="decreaseQuantity(item, index)"
                class="bg-gray-200 hover:bg-gray-300 text-gray-700 border-none w-8 h-8 rounded-full cursor-pointer p-0 flex items-center justify-center transition-colors duration-200"
              >
                −
              </button>
              <span class="min-w-[2rem] text-center font-medium">{{ item.quantity }}</span>
              <button 
                @click="increaseQuantity(item, index)"
                class="bg-primary hover:bg-primary-hover text-white border-none w-8 h-8 rounded-full cursor-pointer p-0 flex items-center justify-center transition-colors duration-200"
              >
                +
              </button>
            </div>
            <span class="text-sm text-gray-600 ml-auto">
              小計: ¥{{ (item.price * item.quantity).toLocaleString() }}
            </span>
          </div>
        </div>
        
        <!-- Remove Button -->
        <button 
          @click="$emit('remove-item', getItemIndex(item))" 
          class="bg-danger text-white border-none w-7 h-7 rounded-full cursor-pointer p-0 ml-2 hover:bg-danger-hover transition-colors duration-200"
        >
          ✕
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { getCategoryDisplayName } from '../assets/categories';
import { useCartStore } from '../stores';
import type { GroupedCartItemType, CartItemType } from '../stores/cart';

const props = defineProps<{
  groupedItem: GroupedCartItemType;
}>();

const emit = defineEmits<{
  (e: 'remove-item', index: number): void;
  (e: 'update-quantity', index: number, quantity: number): void;
}>();

const cartStore = useCartStore();

const increaseQuantity = (item: CartItemType, localIndex: number) => {
  const globalIndex = getItemIndex(item);
  emit('update-quantity', globalIndex, item.quantity + 1);
};

const decreaseQuantity = (item: CartItemType, localIndex: number) => {
  const globalIndex = getItemIndex(item);
  emit('update-quantity', globalIndex, item.quantity - 1);
};

const getItemIndex = (item: CartItemType): number => {
  return cartStore.cart.findIndex(cartItem => cartItem.id === item.id);
};
</script>