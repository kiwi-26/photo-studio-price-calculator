import { describe, it, expect, beforeEach } from 'vitest';
import { createTestPinia } from '../../utils';
import { useProductsStore } from '../../../src/stores/products';
import type { ProductType } from '../../../src/types';

describe('Products Store', () => {
  let store: ReturnType<typeof useProductsStore>;

  beforeEach(() => {
    createTestPinia();
    store = useProductsStore();
  });

  describe('Initial State', () => {
    it('should have initial state values', () => {
      expect(store.selectedCategory).toBe('');
      expect(store.selectedPoseCountFilter).toBe('all');
      expect(store.selectedSortOrder).toBe('id');
      expect(store.selectedPriceFilter).toBe('all');
    });

    it('should load products from all data sources', () => {
      expect(store.products).toBeDefined();
      expect(Array.isArray(store.products)).toBe(true);
      expect(store.products.length).toBeGreaterThan(0);
    });
  });

  describe('Filter Options', () => {
    it('should provide pose count filters', () => {
      const filters = store.poseCountFilters;
      expect(filters).toHaveLength(6);
      expect(filters[0]).toEqual({ id: 'all', name: 'すべて', min: 0, max: null });
      expect(filters[1]).toEqual({ id: '0', name: '0ポーズ', min: 0, max: 0 });
      expect(filters[2]).toEqual({ id: '1', name: '1ポーズ', min: 1, max: 1 });
    });

    it('should provide sort options', () => {
      const options = store.sortOptions;
      expect(options).toHaveLength(3);
      expect(options).toContainEqual({ id: 'id', name: '商品掲載順' });
      expect(options).toContainEqual({ id: 'price', name: '価格順' });
      expect(options).toContainEqual({ id: 'poses', name: 'ポーズ数順' });
    });

    it('should provide price filters', () => {
      const filters = store.priceFilters;
      expect(filters).toHaveLength(5);
      expect(filters[0]).toEqual({ id: 'all', name: 'すべて', min: 0, max: null });
      expect(filters[1]).toEqual({ id: '0-3000', name: '3,000円以下', min: 0, max: 3000 });
    });
  });

  describe('Category Filtering', () => {
    it('should filter products by category', () => {
      // Set up test data
      const testProducts: ProductType[] = [
        { id: 1, name: 'Product 1', categoryId: 'category-a', description: 'Test', photoCount: 5, price: 1000 },
        { id: 2, name: 'Product 2', categoryId: 'category-b', description: 'Test', photoCount: 3, price: 2000 },
        { id: 3, name: 'Product 3', categoryId: 'category-a', description: 'Test', photoCount: 7, price: 1500 }
      ];
      
      // Replace products with test data
      store.products.splice(0, store.products.length, ...testProducts);
      
      // Test filtering
      store.setSelectedCategory('category-a');
      const filtered = store.filteredProducts;
      
      expect(filtered).toHaveLength(2);
      expect(filtered.every(p => p.categoryId === 'category-a')).toBe(true);
    });

    it('should show all products when no category is selected', () => {
      const originalLength = store.products.length;
      store.setSelectedCategory('');
      expect(store.filteredProducts).toHaveLength(originalLength);
    });
  });

  describe('Pose Count Filtering', () => {
    beforeEach(() => {
      // Set up test data with known pose counts
      const testProducts: ProductType[] = [
        { id: 1, name: 'Product 1', categoryId: 'test', description: 'Test', photoCount: 0, price: 1000 },
        { id: 2, name: 'Product 2', categoryId: 'test', description: 'Test', photoCount: 1, price: 2000 },
        { id: 3, name: 'Product 3', categoryId: 'test', description: 'Test', photoCount: 5, price: 1500 },
        { id: 4, name: 'Product 4', categoryId: 'test', description: 'Test', photoCount: 15, price: 3000 }
      ];
      store.products.splice(0, store.products.length, ...testProducts);
    });

    it('should filter by exact pose count', () => {
      store.setSelectedPoseCountFilter('1');
      const filtered = store.filteredProducts;
      expect(filtered).toHaveLength(1);
      expect(filtered[0].photoCount).toBe(1);
    });

    it('should filter by pose count range', () => {
      store.setSelectedPoseCountFilter('2-5');
      const filtered = store.filteredProducts;
      expect(filtered).toHaveLength(1);
      expect(filtered[0].photoCount).toBe(5);
    });

    it('should filter by minimum pose count', () => {
      store.setSelectedPoseCountFilter('11+');
      const filtered = store.filteredProducts;
      expect(filtered).toHaveLength(1);
      expect(filtered[0].photoCount).toBe(15);
    });
  });

  describe('Price Filtering', () => {
    beforeEach(() => {
      // Set up test data with known prices
      const testProducts: ProductType[] = [
        { id: 1, name: 'Product 1', categoryId: 'test', description: 'Test', photoCount: 5, price: 2000 },
        { id: 2, name: 'Product 2', categoryId: 'test', description: 'Test', photoCount: 3, price: 5000 },
        { id: 3, name: 'Product 3', categoryId: 'test', description: 'Test', photoCount: 7, price: 15000 }
      ];
      store.products.splice(0, store.products.length, ...testProducts);
    });

    it('should filter by price range', () => {
      store.setSelectedPriceFilter('3001-6000');
      const filtered = store.filteredProducts;
      expect(filtered).toHaveLength(1);
      expect(filtered[0].price).toBe(5000);
    });

    it('should filter by maximum price', () => {
      store.setSelectedPriceFilter('0-3000');
      const filtered = store.filteredProducts;
      expect(filtered).toHaveLength(1);
      expect(filtered[0].price).toBe(2000);
    });

    it('should filter by minimum price', () => {
      store.setSelectedPriceFilter('10001+');
      const filtered = store.filteredProducts;
      expect(filtered).toHaveLength(1);
      expect(filtered[0].price).toBe(15000);
    });
  });

  describe('Sorting', () => {
    beforeEach(() => {
      // Set up test data for sorting
      const testProducts: ProductType[] = [
        { id: 3, name: 'Product C', categoryId: 'test', description: 'Test', photoCount: 10, price: 1500 },
        { id: 1, name: 'Product A', categoryId: 'test', description: 'Test', photoCount: 5, price: 3000 },
        { id: 2, name: 'Product B', categoryId: 'test', description: 'Test', photoCount: 15, price: 1000 }
      ];
      store.products.splice(0, store.products.length, ...testProducts);
    });

    it('should sort by ID (default)', () => {
      store.setSelectedSortOrder('id');
      const sorted = store.filteredProducts;
      expect(sorted.map(p => p.id)).toEqual([1, 2, 3]);
    });

    it('should sort by price', () => {
      store.setSelectedSortOrder('price');
      const sorted = store.filteredProducts;
      expect(sorted.map(p => p.price)).toEqual([1000, 1500, 3000]);
    });

    it('should sort by pose count', () => {
      store.setSelectedSortOrder('poses');
      const sorted = store.filteredProducts;
      expect(sorted.map(p => p.photoCount)).toEqual([5, 10, 15]);
    });
  });

  describe('Product Variation Grouping', () => {
    it('should group products with same name and category', () => {
      const testProducts: ProductType[] = [
        { 
          id: 1, 
          name: 'Test Product', 
          categoryId: 'test', 
          description: 'Test description', 
          photoCount: 5, 
          price: 1000,
          variation: 'Variation A'
        },
        { 
          id: 2, 
          name: 'Test Product', 
          categoryId: 'test', 
          description: 'Test description', 
          photoCount: 5, 
          price: 1200,
          variation: 'Variation B'
        },
        { 
          id: 3, 
          name: 'Single Product', 
          categoryId: 'test', 
          description: 'Single product', 
          photoCount: 3, 
          price: 800
        }
      ];

      const grouped = store.groupProductsByVariation(testProducts);
      
      expect(grouped).toHaveLength(2);
      
      // Check grouped product
      const groupedProduct = grouped.find(p => store.isGroupedProduct(p));
      expect(groupedProduct).toBeDefined();
      if (store.isGroupedProduct(groupedProduct!)) {
        expect(groupedProduct.name).toBe('Test Product');
        expect(groupedProduct.variations).toHaveLength(2);
        expect(groupedProduct.basePrice).toBe(1000); // minimum price
        expect(groupedProduct.hasMultipleVariations).toBe(true);
      }
      
      // Check single product
      const singleProduct = grouped.find(p => !store.isGroupedProduct(p));
      expect(singleProduct).toBeDefined();
      expect(singleProduct!.name).toBe('Single Product');
    });

    it('should not group products with different names', () => {
      const testProducts: ProductType[] = [
        { id: 1, name: 'Product A', categoryId: 'test', description: 'Test', photoCount: 5, price: 1000 },
        { id: 2, name: 'Product B', categoryId: 'test', description: 'Test', photoCount: 5, price: 1200 }
      ];

      const grouped = store.groupProductsByVariation(testProducts);
      
      expect(grouped).toHaveLength(2);
      expect(grouped.every(p => !store.isGroupedProduct(p))).toBe(true);
    });

    it('should not group products with different categories', () => {
      const testProducts: ProductType[] = [
        { id: 1, name: 'Test Product', categoryId: 'category-a', description: 'Test', photoCount: 5, price: 1000 },
        { id: 2, name: 'Test Product', categoryId: 'category-b', description: 'Test', photoCount: 5, price: 1200 }
      ];

      const grouped = store.groupProductsByVariation(testProducts);
      
      expect(grouped).toHaveLength(2);
      expect(grouped.every(p => !store.isGroupedProduct(p))).toBe(true);
    });
  });

  describe('Helper Functions', () => {
    it('should find product by ID', () => {
      const testProducts: ProductType[] = [
        { id: 1, name: 'Product 1', categoryId: 'test', description: 'Test', photoCount: 5, price: 1000 },
        { id: 2, name: 'Product 2', categoryId: 'test', description: 'Test', photoCount: 3, price: 2000 }
      ];
      store.products.splice(0, store.products.length, ...testProducts);

      const found = store.getProductById(1);
      expect(found).toBeDefined();
      expect(found!.name).toBe('Product 1');

      const notFound = store.getProductById(999);
      expect(notFound).toBeUndefined();
    });

    it('should convert grouped products back to individual products', () => {
      const testProducts: ProductType[] = [
        { 
          id: 1, 
          name: 'Test Product', 
          categoryId: 'test', 
          description: 'Test description', 
          photoCount: 5, 
          price: 1000,
          variation: 'Variation A'
        },
        { 
          id: 2, 
          name: 'Test Product', 
          categoryId: 'test', 
          description: 'Test description', 
          photoCount: 5, 
          price: 1200,
          variation: 'Variation B'
        }
      ];

      const grouped = store.groupProductsByVariation(testProducts);
      const individual = store.getAllIndividualProducts(grouped);
      
      expect(individual).toHaveLength(2);
      expect(individual[0].variation).toBe('Variation A');
      expect(individual[1].variation).toBe('Variation B');
    });
  });

  describe('Actions', () => {
    it('should update selected category', () => {
      store.setSelectedCategory('new-category');
      expect(store.selectedCategory).toBe('new-category');
    });

    it('should update selected pose count filter', () => {
      store.setSelectedPoseCountFilter('2-5');
      expect(store.selectedPoseCountFilter).toBe('2-5');
    });

    it('should update selected sort order', () => {
      store.setSelectedSortOrder('price');
      expect(store.selectedSortOrder).toBe('price');
    });

    it('should update selected price filter', () => {
      store.setSelectedPriceFilter('3001-6000');
      expect(store.selectedPriceFilter).toBe('3001-6000');
    });
  });
});