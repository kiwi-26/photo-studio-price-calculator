<template>
  <section>
    <h2 class="text-lg sm:text-xl lg:text-2xl mb-4 sm:mb-6">商品一覧</h2>
    
    <!-- Products List grouped by category -->
    <div v-if="groupedProducts.length > 0">
      <div v-for="group in groupedProducts" :key="group.categoryId" class="mb-8">
        <!-- Category/Subcategory Header -->
        <h3 class="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
          {{ group.categoryName }}
        </h3>
        
        <!-- Products Grid for this category -->
        <div class="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductCard 
            v-for="product in group.products" 
            :key="product.id" 
            :product="product"
            @add-to-cart="$emit('add-to-cart', $event)"
          />
        </div>
      </div>
    </div>
    
    <!-- No products message -->
    <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
      商品が見つかりませんでした。
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ProductCard from './ProductCard.vue';
import { getCategoryDisplayName } from '../assets/categories';
import type { ProductType } from '../types';

const props = defineProps<{
  products: ProductType[];
  selectedCategory?: string;
}>();

const emit = defineEmits<{
  (e: 'add-to-cart', product: ProductType): void;
  (e: 'update:selectedCategory', value: string): void;
}>();

const groupedProducts = computed(() => {
  // Use the products passed as props (which are already filtered by the store)
  const products = props.products;
  
  // Group products by their categoryId
  const groups = new Map<string, ProductType[]>();
  
  products.forEach(product => {
    const categoryId = product.categoryId;
    if (!groups.has(categoryId)) {
      groups.set(categoryId, []);
    }
    groups.get(categoryId)!.push(product);
  });
  
  // Convert to array with category names
  const result = Array.from(groups.entries()).map(([categoryId, products]) => ({
    categoryId,
    categoryName: getCategoryDisplayName(categoryId),
    products
  }));
  
  // Sort by category name
  return result.sort((a, b) => a.categoryName.localeCompare(b.categoryName));
});
</script>