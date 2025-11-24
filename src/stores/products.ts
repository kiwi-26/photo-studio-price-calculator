import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { products as productsData } from '../assets/products';
import { getAllCategoriesForDisplay, getSubCategoryIds } from '../assets/categories';
import type { ProductType } from '../types';

export interface PoseCountFilter {
  id: string;
  name: string;
  min: number;
  max: number | null; // null means no upper limit
}

export const useProductsStore = defineStore('products', () => {
  // State
  const products = ref<ProductType[]>(productsData as ProductType[]);
  const selectedCategory = ref<string>('');
  const selectedPoseCountFilter = ref<string>('all');

  // Getters
  const categories = computed(() => {
    return getAllCategoriesForDisplay();
  });

  const poseCountFilters = computed((): PoseCountFilter[] => {
    return [
      { id: 'all', name: 'すべて', min: 0, max: null },
      { id: '0', name: '0ポーズ', min: 0, max: 0 },
      { id: '1', name: '1ポーズ', min: 1, max: 1 },
      { id: '2-5', name: '2-5ポーズ', min: 2, max: 5 },
      { id: '6-10', name: '6-10ポーズ', min: 6, max: 10 },
      { id: '11+', name: '11ポーズ以上', min: 11, max: null }
    ];
  });

  const filteredProducts = computed(() => {
    let filtered = products.value;

    // Filter by category
    if (selectedCategory.value) {
      // Check if it's a main category that has subcategories
      const subCategoryIds = getSubCategoryIds(selectedCategory.value);
      
      if (subCategoryIds.length > 0) {
        // If it's a parent category with subcategories, show products from all subcategories
        filtered = filtered.filter(product => 
          subCategoryIds.includes(product.categoryId) || product.categoryId === selectedCategory.value
        );
      } else {
        // If it's a specific category or subcategory, show only products from that category
        filtered = filtered.filter(product => product.categoryId === selectedCategory.value);
      }
    }

    // Filter by pose count
    if (selectedPoseCountFilter.value !== 'all') {
      const poseFilter = poseCountFilters.value.find(f => f.id === selectedPoseCountFilter.value);
      if (poseFilter) {
        filtered = filtered.filter(product => {
          const photoCount = product.photoCount;
          if (poseFilter.max === null) {
            return photoCount >= poseFilter.min;
          } else {
            return photoCount >= poseFilter.min && photoCount <= poseFilter.max;
          }
        });
      }
    }

    return filtered;
  });

  // Actions
  const setSelectedCategory = (categoryId: string) => {
    selectedCategory.value = categoryId;
  };

  const setSelectedPoseCountFilter = (filterId: string) => {
    selectedPoseCountFilter.value = filterId;
  };

  const getProductById = (id: number | string): ProductType | undefined => {
    return products.value.find(product => product.id === id);
  };

  return {
    // State
    products,
    selectedCategory,
    selectedPoseCountFilter,
    // Getters
    categories,
    poseCountFilters,
    filteredProducts,
    // Actions
    setSelectedCategory,
    setSelectedPoseCountFilter,
    getProductById
  };
});