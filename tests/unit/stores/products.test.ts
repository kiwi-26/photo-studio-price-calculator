import { describe, it, expect, beforeEach } from 'vitest';
import { createTestPinia } from '../../utils';
import { useProductsStore } from '../../../src/stores/products';

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