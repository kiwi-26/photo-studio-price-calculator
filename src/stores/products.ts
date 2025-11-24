import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { products as productsData } from '../assets/products';
import { getAllCategoriesForDisplay, getSubCategoryIds } from '../assets/categories';
import type { ProductType } from '../types';

export const useProductsStore = defineStore('products', () => {
  // State
  const products = ref<ProductType[]>(productsData as ProductType[]);
  const selectedCategory = ref<string>('');

  // Getters
  const categories = computed(() => {
    return getAllCategoriesForDisplay();
  });

  const filteredProducts = computed(() => {
    if (!selectedCategory.value) {
      return products.value;
    }

    // Check if it's a main category that has subcategories
    const subCategoryIds = getSubCategoryIds(selectedCategory.value);
    
    if (subCategoryIds.length > 0) {
      // If it's a parent category with subcategories, show products from all subcategories
      return products.value.filter(product => 
        subCategoryIds.includes(product.categoryId) || product.categoryId === selectedCategory.value
      );
    } else {
      // If it's a specific category or subcategory, show only products from that category
      return products.value.filter(product => product.categoryId === selectedCategory.value);
    }
  });

  // Actions
  const setSelectedCategory = (categoryId: string) => {
    selectedCategory.value = categoryId;
  };

  const getProductById = (id: number | string): ProductType | undefined => {
    return products.value.find(product => product.id === id);
  };

  return {
    // State
    products,
    selectedCategory,
    // Getters
    categories,
    filteredProducts,
    // Actions
    setSelectedCategory,
    getProductById
  };
});