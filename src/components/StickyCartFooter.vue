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
          <span class="font-medium">{{ totalPhotoCount }} ポーズ</span>
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
          <!-- Character Design Checkbox -->
          <div class="mb-4">
            <label class="flex items-center gap-2 text-sm cursor-pointer">
              <input 
                type="checkbox" 
                :checked="includeCharacterDesign"
                @change="emit('update:includeCharacterDesign', ($event.target as HTMLInputElement).checked)"
                class="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <span class="text-gray-700 dark:text-gray-300">キャラクターデザインの衣装を含む</span>
            </label>
          </div>

          <div class="mb-4">
            <CartSummary 
              :basePrice="basePrice"
              :characterDesignFee="characterDesignFee"
              :totalPrice="totalPrice"
              :totalPhotoCount="totalPhotoCount"
              :includeCharacterDesign="includeCharacterDesign"
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
  includeCharacterDesign: boolean;
}>();

const emit = defineEmits<{
  (e: 'remove-from-cart', index: number): void;
  (e: 'update-quantity', index: number, quantity: number): void;
  (e: 'clear-cart'): void;
  (e: 'update:includeCharacterDesign', value: boolean): void;
}>();

const isExpanded = ref(false);
const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value;
};

// Helper function to determine if a product is eligible for character design fee
const isEligibleForCharacterDesign = (item: CartItemType): boolean => {
  // Products in "print" category are eligible
  if (item.categoryId === 'print') {
    return true;
  }
  
  // Products that already have "キャラクター" in their name are not eligible for additional fees
  if (item.name.includes('キャラクター') || item.description.includes('キャラクター')) {
    return false;
  }
  
  // Other products with photoCount > 0 might be eligible
  return item.photoCount > 0;
};

const basePrice = computed(() => {
  return props.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

const characterDesignFee = computed(() => {
  if (!props.includeCharacterDesign) {
    return 0;
  }
  
  return props.cart.reduce((sum, item) => {
    if (isEligibleForCharacterDesign(item)) {
      return sum + (item.photoCount * item.quantity * 1000);
    }
    return sum;
  }, 0);
});

const totalPrice = computed(() => {
  return basePrice.value + characterDesignFee.value;
});

const totalPhotoCount = computed(() => {
  return props.cart.reduce((sum, item) => sum + (item.photoCount * item.quantity), 0);
});
</script>