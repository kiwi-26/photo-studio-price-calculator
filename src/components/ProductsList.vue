<template>
  <section>
    <h2 class="text-2xl mb-6">商品一覧</h2>
    
    <!-- Category Filter -->
    <CategoryFilter 
      :categories="categories"
      :selected-category="selectedCategory"
      @update:selected-category="$emit('update:selectedCategory', $event)"
    />

    <!-- Products List -->
    <div class="grid gap-6" style="grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));">
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
import CategoryFilter from './CategoryFilter.vue';
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

const categories = computed(() => {
  const uniqueCategories = [...new Set(props.products.map(p => p.category))];
  return uniqueCategories.sort();
});

const filteredProducts = computed(() => {
  if (!props.selectedCategory) {
    return props.products;
  }
  return props.products.filter(p => p.category === props.selectedCategory);
});
</script>