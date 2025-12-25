<template>
  <!-- Only show the footer if there are items in the cart -->
  <div v-if="cart.length > 0" class="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-950 border-t-2 border-primary shadow-lg">
    <!-- Share Notification Toast -->
    <div 
      v-if="shareNotification.show"
      :class="[
        'absolute -top-16 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg text-white text-sm font-medium shadow-lg transition-all duration-300 z-10',
        shareNotification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
      ]"
    >
      {{ shareNotification.message }}
    </div>
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
          <GroupedCartItem 
            v-for="groupedItem in groupedCartItems" 
            :key="`${groupedItem.name}-${groupedItem.categoryId}`"
            :grouped-item="groupedItem"
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
              @click="handleShare"
              :disabled="cart.length === 0"
              class="bg-blue-600 text-white border-none px-4 py-2 font-semibold rounded-lg transition-colors duration-200 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ShareIcon class="w-4 h-4" />
              共有
            </button>
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
import GroupedCartItem from './GroupedCartItem.vue';
import CartSummary from './CartSummary.vue';
import { ShoppingCartIcon, ChevronUpIcon, ShareIcon } from '@heroicons/vue/24/solid';
import { Analytics } from '../utils';
import { useCartStore } from '../stores';
import type { CartItemType } from '../types';

const props = defineProps<{
  cart: CartItemType[];
}>();

const emit = defineEmits<{
  (e: 'remove-from-cart', index: number): void;
  (e: 'update-quantity', index: number, quantity: number): void;
  (e: 'clear-cart'): void;
}>();

const cartStore = useCartStore();

const isExpanded = ref(false);
const shareNotification = ref<{ show: boolean; message: string; type: 'success' | 'error' }>({
  show: false,
  message: '',
  type: 'success'
});

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value;
  
  // Track view cart event when cart is expanded
  if (isExpanded.value && props.cart.length > 0) {
    Analytics.trackViewCart(props.cart);
  }
};

const handleShare = async () => {
  const result = await cartStore.shareEstimate();
  
  if (result.success) {
    shareNotification.value = {
      show: true,
      message: 'リンクをクリップボードにコピーしました！',
      type: 'success'
    };
  } else {
    shareNotification.value = {
      show: true,
      message: result.error || 'リンクのコピーに失敗しました',
      type: 'error'
    };
  }
  
  // Hide notification after 3 seconds
  setTimeout(() => {
    shareNotification.value.show = false;
  }, 3000);
};

const groupedCartItems = computed(() => {
  return cartStore.groupedCartItems;
});

const totalPrice = computed(() => {
  return props.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

const totalPhotoCount = computed(() => {
  return props.cart.reduce((sum, item) => sum + (item.photoCount * item.quantity), 0);
});
</script>