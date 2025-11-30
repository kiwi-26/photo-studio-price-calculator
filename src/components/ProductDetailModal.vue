<template>
  <div 
    v-if="isOpen" 
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
    @click.self="closeModal"
  >
    <div 
      class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      tabindex="-1"
      @click.stop
    >
      <!-- Modal Header -->
      <div class="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 id="modal-title" class="text-lg font-semibold text-gray-900 dark:text-white">商品詳細</h2>
        <button 
          @click="closeModal"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors touch-manipulation"
        >
          <XMarkIcon class="w-6 h-6" />
        </button>
      </div>

      <!-- Modal Content -->
      <div v-if="currentProduct" class="p-4">
        <!-- Category Badge -->
        <div class="mb-3">
          <span class="inline-block py-1 px-3 bg-primary text-white rounded-full text-sm font-semibold">
            {{ getCategoryDisplayName(currentProduct.categoryId) }}
          </span>
        </div>

        <!-- Product Name -->
        <h3 class="text-xl font-bold mb-3 text-gray-900 dark:text-white">
          {{ currentProduct.name }}
        </h3>

        <!-- Product Description -->
        <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
          {{ currentProduct.description }}
        </p>

        <!-- Product Info Grid -->
        <div class="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div class="text-center">
            <div class="flex items-center justify-center mb-1">
              <CameraIcon class="w-4 h-4 mr-1 text-primary" />
              <span class="text-sm text-gray-600 dark:text-gray-300">ポーズ数</span>
            </div>
            <span class="text-lg font-semibold text-gray-900 dark:text-white">{{ currentProduct.photoCount }}</span>
          </div>
          <div class="text-center">
            <div class="text-sm text-gray-600 dark:text-gray-300 mb-1">価格</div>
            <span class="text-lg font-semibold text-success">¥{{ currentProduct.price.toLocaleString() }}</span>
          </div>
        </div>

        <!-- Variation if exists -->
        <div v-if="currentProduct.variation" class="mb-4 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border-l-4 border-blue-400">
          <span class="text-sm text-blue-700 dark:text-blue-300 font-medium">{{ currentProduct.variation }}</span>
        </div>

        <!-- Cart Section -->
        <div class="mb-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">カート内の数量</span>
            <span class="text-lg font-semibold text-primary">{{ currentCartQuantity }}</span>
          </div>
          
          <!-- Quantity Controls -->
          <div class="flex items-center justify-center space-x-3">
            <button 
              @click="decrementQuantity"
              :disabled="currentCartQuantity <= 0"
              class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center touch-manipulation"
            >
              <MinusIcon class="w-4 h-4" />
            </button>
            
            <span class="text-xl font-semibold text-gray-900 dark:text-white min-w-[3rem] text-center">
              {{ currentCartQuantity }}
            </span>
            
            <button 
              @click="incrementQuantity"
              class="w-10 h-10 rounded-full bg-primary text-white hover:bg-primary-hover transition-colors flex items-center justify-center touch-manipulation"
            >
              <PlusIcon class="w-4 h-4" />
            </button>
          </div>
          
          <!-- Quick Add Button -->
          <button 
            @click="addToCart"
            class="w-full mt-3 bg-primary text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary-hover transition-colors touch-manipulation"
          >
            カートに追加
          </button>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="p-4 text-center">
        <p class="text-gray-500 dark:text-gray-400">商品が見つかりませんでした。</p>
      </div>

      <!-- Navigation Footer -->
      <div class="flex justify-between items-center p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
        <button 
          @click="goToPrevious"
          :disabled="!hasPrevious"
          class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation"
        >
          <ChevronLeftIcon class="w-4 h-4 mr-1" />
          前の商品
        </button>
        
        <span class="text-sm text-gray-500 dark:text-gray-400">
          {{ currentIndex + 1 }} / {{ productList.length }}
        </span>
        
        <button 
          @click="goToNext"
          :disabled="!hasNext"
          class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation"
        >
          次の商品
          <ChevronRightIcon class="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, nextTick } from 'vue';
import { 
  XMarkIcon, 
  CameraIcon, 
  PlusIcon, 
  MinusIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon 
} from '@heroicons/vue/24/solid';
import { getCategoryDisplayName } from '../assets/categories';
import { useCartStore } from '../stores';
import { Analytics } from '../utils';
import type { ProductType } from '../types';

const props = defineProps<{
  isOpen: boolean;
  productId: string | number | null;
  productList: ProductType[];
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'update:productId', id: string | number): void;
}>();

const cartStore = useCartStore();

// Computed properties
const currentIndex = computed(() => {
  if (!props.productId) return -1;
  return props.productList.findIndex(product => product.id === props.productId);
});

const currentProduct = computed(() => {
  if (currentIndex.value === -1) return null;
  return props.productList[currentIndex.value];
});

const currentCartQuantity = computed(() => {
  if (!currentProduct.value) return 0;
  const cartItem = cartStore.getCartItemById(currentProduct.value.id);
  return cartItem ? cartItem.quantity : 0;
});

const hasPrevious = computed(() => currentIndex.value > 0);
const hasNext = computed(() => currentIndex.value < props.productList.length - 1);

// Methods
const closeModal = () => {
  emit('close');
};

const addToCart = () => {
  if (currentProduct.value) {
    cartStore.addToCart(currentProduct.value);
  }
};

const incrementQuantity = () => {
  if (currentProduct.value) {
    if (currentCartQuantity.value === 0) {
      cartStore.addToCart(currentProduct.value);
    } else {
      cartStore.updateQuantityById(currentProduct.value.id, currentCartQuantity.value + 1);
    }
  }
};

const decrementQuantity = () => {
  if (currentProduct.value && currentCartQuantity.value > 0) {
    cartStore.updateQuantityById(currentProduct.value.id, currentCartQuantity.value - 1);
  }
};

const goToPrevious = () => {
  if (hasPrevious.value) {
    const prevProduct = props.productList[currentIndex.value - 1];
    emit('update:productId', prevProduct.id);
    // Track view item event for navigation
    Analytics.trackViewItem(prevProduct);
  }
};

const goToNext = () => {
  if (hasNext.value) {
    const nextProduct = props.productList[currentIndex.value + 1];
    emit('update:productId', nextProduct.id);
    // Track view item event for navigation
    Analytics.trackViewItem(nextProduct);
  }
};

// Handle keyboard navigation
const handleKeydown = (event: KeyboardEvent) => {
  if (!props.isOpen) return;
  
  switch (event.key) {
    case 'Escape':
      closeModal();
      break;
    case 'ArrowLeft':
      if (hasPrevious.value) goToPrevious();
      break;
    case 'ArrowRight':
      if (hasNext.value) goToNext();
      break;
  }
};

// Watch for modal open/close to manage keyboard listeners
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    document.addEventListener('keydown', handleKeydown);
    // Focus management
    nextTick(() => {
      const modal = document.querySelector('[role="dialog"]') as HTMLElement;
      if (modal) modal.focus();
    });
  } else {
    document.removeEventListener('keydown', handleKeydown);
  }
});

// Watch for product changes to track view item events
watch(() => currentProduct.value, (product) => {
  if (product && props.isOpen) {
    Analytics.trackViewItem(product);
  }
}, { immediate: true });
</script>