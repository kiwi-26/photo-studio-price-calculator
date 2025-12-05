<template>
  <section>
    <h2 class="text-lg sm:text-xl lg:text-2xl mb-4 sm:mb-6">商品一覧</h2>
    
    <!-- Products List grouped by category (when sort order is 'id') -->
    <div v-if="shouldGroupByCategory && groupedProductsByCategory.length > 0">
      <div v-for="group in groupedProductsByCategory" :key="group.categoryId" class="mb-8">
        <!-- Category/Subcategory Header -->
        <h3 class="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
          {{ group.categoryName }}
        </h3>
        
        <!-- Products Grid for this category -->
        <div class="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <template v-for="product in group.products" :key="getProductKey(product)">
            <ProductVariationCard 
              v-if="isGroupedProduct(product)"
              :product="product"
              @add-to-cart="$emit('add-to-cart', $event)"
              @show-detail="handleShowDetail"
            />
            <ProductCard 
              v-else
              :product="product"
              @add-to-cart="$emit('add-to-cart', $event)"
              @show-detail="handleShowDetail"
            />
          </template>
        </div>
      </div>
    </div>
    
    <!-- Products List flat (when sort order is not 'id') -->
    <div v-else-if="!shouldGroupByCategory && displayProducts.length > 0">
      <div class="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <template v-for="product in displayProducts" :key="getProductKey(product)">
          <ProductVariationCard 
            v-if="isGroupedProduct(product)"
            :product="product"
            @add-to-cart="$emit('add-to-cart', $event)"
            @show-detail="handleShowDetail"
          />
          <ProductCard 
            v-else
            :product="product"
            @add-to-cart="$emit('add-to-cart', $event)"
            @show-detail="handleShowDetail"
          />
        </template>
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
import ProductVariationCard from './ProductVariationCard.vue';
import { getCategoryDisplayName } from '../assets/categories';
import { useProductsStore } from '../stores';
import type { ProductType, DisplayProductType, GroupedProductType } from '../types';

const props = defineProps<{
  products: ProductType[];
  selectedCategory?: string;
  selectedSortOrder?: string;
}>();

const emit = defineEmits<{
  (e: 'add-to-cart', product: ProductType): void;
  (e: 'update:selectedCategory', value: string): void;
  (e: 'show-detail', data: { product: ProductType; productList: ProductType[] }): void;
}>();

const productsStore = useProductsStore();

const shouldGroupByCategory = computed(() => {
  // Group by category only when sort order is 'id' (商品掲載順) or not specified
  return !props.selectedSortOrder || props.selectedSortOrder === 'id';
});

// Get grouped products from the store
const displayProducts = computed(() => {
  return productsStore.groupProductsByVariation(props.products);
});

const groupedProductsByCategory = computed(() => {
  // Group display products by their categoryId
  const groups = new Map<string, DisplayProductType[]>();
  
  displayProducts.value.forEach(product => {
    const categoryId = isGroupedProduct(product) ? product.categoryId : product.categoryId;
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
  return result.sort((a, b) => a.categoryName.localeCompare(b.categoryName, 'ja'));
});

// Helper function to check if a product is grouped
const isGroupedProduct = (product: DisplayProductType): product is GroupedProductType => {
  return productsStore.isGroupedProduct(product);
};

// Helper function to get unique key for products
const getProductKey = (product: DisplayProductType): string => {
  if (isGroupedProduct(product)) {
    return `grouped-${product.name}-${product.categoryId}`;
  } else {
    return `single-${product.id}`;
  }
};

// Methods
const handleShowDetail = (product: ProductType) => {
  emit('show-detail', { 
    product, 
    productList: props.products 
  });
};
</script>