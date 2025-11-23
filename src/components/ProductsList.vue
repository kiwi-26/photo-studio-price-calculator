<template>
  <section>
    <h2 class="text-lg sm:text-xl lg:text-2xl mb-4 sm:mb-6">商品一覧</h2>
    
    <!-- Products List -->
    <div class="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <ProductCard 
        v-for="product in filteredProducts" 
        :key="product.id" 
        :product="product"
        @add-to-cart="$emit('add-to-cart', $event)"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ProductCard from './ProductCard.vue';
import type { ProductType } from '../types';

const props = defineProps<{
  products: ProductType[];
  selectedCategory?: string;
}>();

const emit = defineEmits<{
  (e: 'add-to-cart', product: ProductType): void;
  (e: 'update:selectedCategory', value: string): void;
}>();

const filteredProducts = computed(() => {
  if (!props.selectedCategory) {
    return props.products;
  }
  return props.products.filter(p => p.categoryId === props.selectedCategory);
});
</script>