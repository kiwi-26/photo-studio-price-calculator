<template>
  <div class="border-t-2 border-primary pt-4 mb-4">
    <div class="flex justify-between py-2 text-lg">
      <span>合計ポーズ数</span>
      <span>{{ totalPhotoCount }}</span>
    </div>
    <div class="flex justify-between py-2 text-xl font-bold text-success">
      <span>合計金額</span>
      <span>¥{{ totalPrice.toLocaleString() }}</span>
    </div>
    
    <!-- Data Product Threshold Information -->
    <div v-if="showThresholdInfo" class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
      <div class="text-sm">
        <div class="flex justify-between py-1">
          <span class="text-gray-600 dark:text-gray-400">データ商品以外の合計</span>
          <span class="font-medium">¥{{ nonDataProductTotal.toLocaleString() }}</span>
        </div>
        <div class="mt-2 text-xs">
          <div v-if="isThresholdMet" class="text-green-600 dark:text-green-400 flex items-center">
            <CheckCircleIcon class="w-4 h-4 mr-1" />
            全写真データが注文可能です
          </div>
          <div v-else class="text-blue-600 dark:text-blue-400">
            <div class="flex items-center mb-1">
              <InformationCircleIcon class="w-4 h-4 mr-1" />
              全写真データ注文まで
            </div>
            <div class="font-medium">
              あと¥{{ (50000 - nonDataProductTotal).toLocaleString() }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CheckCircleIcon, InformationCircleIcon } from '@heroicons/vue/24/solid';
import { useCartStore } from '../stores';

defineProps<{
  totalPrice: number;
  totalPhotoCount: number;
}>();

const cartStore = useCartStore();

const nonDataProductTotal = computed(() => cartStore.nonDataProductTotal);
const isThresholdMet = computed(() => cartStore.isThresholdMet);

// Show threshold info if there are any items in cart (to help users understand the threshold)
const showThresholdInfo = computed(() => cartStore.cart.length > 0);
</script>