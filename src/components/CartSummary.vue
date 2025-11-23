<template>
  <div class="border-t-2 border-primary pt-4 mb-4">
    <div class="flex justify-between py-2 text-lg">
      <span>合計ポーズ数</span>
      <span>{{ totalPhotoCount }}</span>
    </div>
    
    <!-- Base Price -->
    <div class="flex justify-between py-1 text-base">
      <span>商品代金</span>
      <span>¥{{ basePrice.toLocaleString() }}</span>
    </div>
    
    <!-- Character Design Fee (only show if checkbox is checked and fee > 0) -->
    <div v-if="includeCharacterDesign && characterDesignFee > 0" class="flex justify-between py-1 text-base text-orange-600 dark:text-orange-400">
      <span>キャラクターデザイン料</span>
      <span>¥{{ characterDesignFee.toLocaleString() }}</span>
    </div>
    
    <!-- Total Price -->
    <div class="flex justify-between py-2 text-xl font-bold text-success border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
      <span>合計金額</span>
      <span>¥{{ totalPrice.toLocaleString() }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  basePrice: number;
  characterDesignFee: number;
  totalPrice: number;
  totalPhotoCount: number;
  includeCharacterDesign: boolean;
}>();
</script>