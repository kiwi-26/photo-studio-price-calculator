<template>
  <div class="border-t-2 border-primary pt-4 mb-4">
    <!-- Character Design Checkbox (only show if there are eligible items) -->
    <div v-if="hasEligibleItems" class="mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
      <label class="flex items-center cursor-pointer">
        <input
          type="checkbox"
          :checked="includesCharacterDesign"
          @change="$emit('update:includes-character-design', ($event.target as HTMLInputElement).checked)"
          class="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
          キャラクターデザインの衣装を含む
        </span>
      </label>
      <div class="mt-2 text-xs text-gray-600 dark:text-gray-400">
        対象商品1点につき¥{{ designFeeConfig.feePerItem.toLocaleString() }}の追加料金
      </div>
    </div>

    <!-- Price Breakdown -->
    <div class="space-y-2">
      <div class="flex justify-between py-2 text-lg">
        <span>合計ポーズ数</span>
        <span>{{ totalPhotoCount }}</span>
      </div>
      
      <!-- Base Price -->
      <div class="flex justify-between py-1 text-base">
        <span>商品代金</span>
        <span>¥{{ basePrice.toLocaleString() }}</span>
      </div>
      
      <!-- Character Design Fee (only show if applicable) -->
      <div v-if="characterDesignFee > 0" class="flex justify-between py-1 text-base text-primary">
        <span>キャラクターデザイン料</span>
        <span>¥{{ characterDesignFee.toLocaleString() }}</span>
      </div>
      
      <!-- Total Price -->
      <div class="flex justify-between py-2 text-xl font-bold text-success border-t border-gray-200 dark:border-gray-700">
        <span>合計金額</span>
        <span>¥{{ totalPrice.toLocaleString() }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DesignFeeConfig } from '../types';

defineProps<{
  totalPrice: number;
  basePrice: number;
  characterDesignFee: number;
  totalPhotoCount: number;
  includesCharacterDesign: boolean;
  hasEligibleItems: boolean;
  designFeeConfig: DesignFeeConfig;
}>();

defineEmits<{
  (e: 'update:includes-character-design', value: boolean): void;
}>();
</script>