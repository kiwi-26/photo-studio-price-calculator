<template>
  <div class="flex justify-between items-start p-4 mb-4 bg-primary/10 rounded-lg border border-primary/20">
    <div class="flex-1">
      <h4 class="text-base mb-1">{{ item.name }}</h4>
      <p class="text-sm opacity-70 mb-2">{{ item.category }}</p>
      <div class="flex justify-between text-sm mb-2">
        <span>{{ item.photoCount }} ポーズ</span>
        <span class="text-success font-semibold">¥{{ item.price.toLocaleString() }}</span>
      </div>
      
      <!-- Quantity Controls -->
      <div class="flex items-center gap-3">
        <span class="text-sm font-medium">数量:</span>
        <div class="flex items-center gap-2">
          <button 
            @click="decreaseQuantity"
            class="bg-gray-200 hover:bg-gray-300 text-gray-700 border-none w-8 h-8 rounded-full cursor-pointer p-0 flex items-center justify-center transition-colors duration-200"
          >
            −
          </button>
          <span class="min-w-[2rem] text-center font-medium">{{ item.quantity }}</span>
          <button 
            @click="increaseQuantity"
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
    <button 
      @click="$emit('remove-item', index)" 
      class="bg-danger text-white border-none w-7 h-7 rounded-full cursor-pointer p-0 ml-2 hover:bg-danger-hover transition-colors duration-200"
    >
      ✕
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type { CartItemType } from '../types';

const props = defineProps<{
  item: CartItemType;
  index: number;
}>();

const emit = defineEmits<{
  (e: 'remove-item', index: number): void;
  (e: 'update-quantity', index: number, quantity: number): void;
}>();

const increaseQuantity = () => {
  emit('update-quantity', props.index, props.item.quantity + 1);
};

const decreaseQuantity = () => {
  emit('update-quantity', props.index, props.item.quantity - 1);
};
</script>