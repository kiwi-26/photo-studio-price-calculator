<template>
  <!-- Only show the footer if there are items in the cart -->
  <div v-if="cart.length > 0" class="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-950 border-t-2 border-primary shadow-lg">
    <!-- Collapsed Footer - Always Visible -->
    <div 
      @click="toggleExpanded"
      class="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-200"
    >
      <!-- Cart Summary -->
      <div class="flex items-center gap-4">
        <ShoppingCartIcon class="w-6 h-6 text-primary" />
        <div class="flex items-center gap-4 text-sm">
          <span class="font-medium">{{ totalPhotoCount }} photos</span>
          <span class="font-bold text-success">¥{{ totalPrice.toLocaleString() }}</span>
        </div>
      </div>

      <!-- Expand/Collapse Icon -->
      <ChevronUpIcon 
        :class="[
          'w-6 h-6 text-primary transition-transform duration-300',
          isExpanded ? 'rotate-180' : ''
        ]"
      />
    </div>

    <!-- Expanded Cart Content -->
    <div 
      :class="[
        'transition-all duration-300 ease-in-out overflow-hidden',
        isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      ]"
    >
      <div class="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
        <!-- Cart Items -->
        <div class="max-h-64 overflow-y-auto p-2">
          <CartItem 
            v-for="(item, index) in cart" 
            :key="item.id" 
            :item="item"
            :index="index"
            @remove-item="$emit('remove-from-cart', $event)"
            @update-quantity="(index: number, quantity: number) => $emit('update-quantity', index, quantity)"
            class="mb-2 last:mb-0"
          />
        </div>

        <!-- Cart Actions -->
        <div class="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
          <div class="mb-4">
            <CartSummary 
              :total-price="totalPrice"
              :total-photo-count="totalPhotoCount"
            />
          </div>

          <div class="flex justify-end gap-2">
            <button 
              @click="$emit('clear-cart')" 
              class="bg-danger text-white border-none px-4 py-2 font-semibold rounded-lg transition-colors duration-200 hover:bg-danger-hover"
            >
              リセット
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import CartItem from './CartItem.vue';
import CartSummary from './CartSummary.vue';
import { ShoppingCartIcon, ChevronUpIcon } from '@heroicons/vue/24/solid';
import type { CartItemType } from '../types';

const props = defineProps<{
  cart: CartItemType[];
}>();

const emit = defineEmits<{
  (e: 'remove-from-cart', index: number): void;
  (e: 'update-quantity', index: number, quantity: number): void;
  (e: 'clear-cart'): void;
}>();

const isExpanded = ref(false);
const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value;
};

const totalPrice = computed(() => {
  return props.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

const totalPhotoCount = computed(() => {
  return props.cart.reduce((sum, item) => sum + (item.photoCount * item.quantity), 0);
});
</script>