import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { products as productsData } from '../assets/products';
import { getAllCategoriesForDisplay, getSubCategoryIds } from '../assets/categories';
import type { ProductType, GroupedProductType, ProductVariationType, DisplayProductType } from '../types';

export interface PoseCountFilter {
  id: string;
  name: string;
  min: number;
  max: number | null; // null means no upper limit
}

export interface SortOption {
  id: string;
  name: string;
}

export interface PriceFilter {
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
  const selectedSortOrder = ref<string>('id');
  const selectedPriceFilter = ref<string>('all');
  const characterDesignFee = ref<boolean>(false);

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

  const sortOptions = computed((): SortOption[] => {
    return [
      { id: 'id', name: '商品掲載順' },
      { id: 'price', name: '価格順' },
      { id: 'poses', name: 'ポーズ数順' }
    ];
  });

  const priceFilters = computed((): PriceFilter[] => {
    return [
      { id: 'all', name: 'すべて', min: 0, max: null },
      { id: '0-3000', name: '3,000円以下', min: 0, max: 3000 },
      { id: '3001-6000', name: '3,001円～6,000円', min: 3001, max: 6000 },
      { id: '6001-10000', name: '6,001円～10,000円', min: 6001, max: 10000 },
      { id: '10001+', name: '10,001円以上', min: 10001, max: null }
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

    // Filter by price
    if (selectedPriceFilter.value !== 'all') {
      const priceFilter = priceFilters.value.find(f => f.id === selectedPriceFilter.value);
      if (priceFilter) {
        filtered = filtered.filter(product => {
          let productPrice = product.price;
          
          // Add character design fee if applicable and enabled
          if (characterDesignFee.value && isCharacterDesignApplicable(product)) {
            productPrice += 1000;
          }
          
          if (priceFilter.max === null) {
            return productPrice >= priceFilter.min;
          } else {
            return productPrice >= priceFilter.min && productPrice <= priceFilter.max;
          }
        });
      }
    }

    // Sort the filtered products
    const sorted = [...filtered].sort((a, b) => {
      let aPrice = a.price;
      let bPrice = b.price;
      
      // Add character design fee if applicable and enabled
      if (characterDesignFee.value) {
        if (isCharacterDesignApplicable(a)) aPrice += 1000;
        if (isCharacterDesignApplicable(b)) bPrice += 1000;
      }
      
      switch (selectedSortOrder.value) {
        case 'price':
          return aPrice - bPrice;
        case 'poses':
          return a.photoCount - b.photoCount;
        case 'id':
        default:
          // Convert to number for proper numeric sorting
          const aId = typeof a.id === 'string' ? parseInt(a.id) : a.id;
          const bId = typeof b.id === 'string' ? parseInt(b.id) : b.id;
          return aId - bId;
      }
    });

    return sorted;
  });

  // Helper function to group products by name and category
  const groupProductsByVariation = (products: ProductType[]): DisplayProductType[] => {
    const productGroups = new Map<string, ProductType[]>();
    
    // Group products by name + categoryId
    products.forEach(product => {
      const groupKey = `${product.name}|${product.categoryId}`;
      if (!productGroups.has(groupKey)) {
        productGroups.set(groupKey, []);
      }
      productGroups.get(groupKey)!.push(product);
    });
    
    const result: DisplayProductType[] = [];
    
    productGroups.forEach((groupProducts, groupKey) => {
      if (groupProducts.length === 1) {
        // Single product, no variations
        result.push(groupProducts[0]);
      } else {
        // Multiple variations, create grouped product
        const baseProduct = groupProducts[0];
        const variations: ProductVariationType[] = groupProducts.map(product => ({
          id: product.id,
          variation: product.variation || 'デフォルト',
          price: product.price,
          photoCount: product.photoCount,
          description: product.description !== baseProduct.description ? product.description : undefined
        }));
        
        // Calculate base values
        const prices = groupProducts.map(p => p.price);
        const photoCounts = groupProducts.map(p => p.photoCount);
        const basePrice = Math.min(...prices);
        
        // Use most common photo count, or first one if all different
        const photoCountFreq = new Map<number, number>();
        photoCounts.forEach(count => {
          photoCountFreq.set(count, (photoCountFreq.get(count) || 0) + 1);
        });
        const basePhotoCount = Array.from(photoCountFreq.entries())
          .sort((a, b) => b[1] - a[1])[0][0];
        
        const groupedProduct: GroupedProductType = {
          name: baseProduct.name,
          categoryId: baseProduct.categoryId,
          description: baseProduct.description,
          basePhotoCount,
          basePrice,
          variations,
          hasMultipleVariations: true
        };
        
        result.push(groupedProduct);
      }
    });
    
    return result;
  };

  // Computed property for grouped products
  const groupedProducts = computed(() => {
    return groupProductsByVariation(filteredProducts.value);
  });

  // Helper function to check if a display product is grouped
  const isGroupedProduct = (product: DisplayProductType): product is GroupedProductType => {
    return 'hasMultipleVariations' in product && product.hasMultipleVariations;
  };

  // Helper function to get all individual products from grouped display
  const getAllIndividualProducts = (displayProducts: DisplayProductType[]): ProductType[] => {
    const result: ProductType[] = [];
    
    displayProducts.forEach(displayProduct => {
      if (isGroupedProduct(displayProduct)) {
        // Convert variations back to individual products
        displayProduct.variations.forEach(variation => {
          const individualProduct: ProductType = {
            id: variation.id,
            name: displayProduct.name,
            categoryId: displayProduct.categoryId,
            description: variation.description || displayProduct.description,
            photoCount: variation.photoCount,
            price: variation.price,
            variation: variation.variation
          };
          result.push(individualProduct);
        });
      } else {
        result.push(displayProduct);
      }
    });
    
    return result;
  });

  // Helper function to determine if character design fee applies to a product
  const isCharacterDesignApplicable = (product: ProductType): boolean => {
    // Character design fee applies to print products (categoryId: 'print')
    return product.categoryId === 'print';
  };

  // Actions
  const setSelectedCategory = (categoryId: string) => {
    selectedCategory.value = categoryId;
  };

  const setSelectedPoseCountFilter = (filterId: string) => {
    selectedPoseCountFilter.value = filterId;
  };

  const setSelectedSortOrder = (sortId: string) => {
    selectedSortOrder.value = sortId;
  };

  const setSelectedPriceFilter = (filterId: string) => {
    selectedPriceFilter.value = filterId;
  };

  const setCharacterDesignFee = (enabled: boolean) => {
    characterDesignFee.value = enabled;
  };

  const getProductById = (id: number | string): ProductType | undefined => {
    return products.value.find(product => product.id === id);
  };

  // Helper function to get effective price (including character design fee if applicable)
  const getEffectivePrice = (product: ProductType): number => {
    let price = product.price;
    if (characterDesignFee.value && isCharacterDesignApplicable(product)) {
      price += 1000;
    }
    return price;
  };

  return {
    // State
    products,
    selectedCategory,
    selectedPoseCountFilter,
    selectedSortOrder,
    selectedPriceFilter,
    characterDesignFee,
    // Getters
    categories,
    poseCountFilters,
    sortOptions,
    priceFilters,
    filteredProducts,
    groupedProducts,
    // Actions
    setSelectedCategory,
    setSelectedPoseCountFilter,
    setSelectedSortOrder,
    setSelectedPriceFilter,
    setCharacterDesignFee,
    getProductById,
    getEffectivePrice,
    isCharacterDesignApplicable,
    // New helper functions
    isGroupedProduct,
    getAllIndividualProducts,
    groupProductsByVariation
  };
});