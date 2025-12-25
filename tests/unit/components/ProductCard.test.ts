import { describe, it, expect, vi } from 'vitest';
import { mountWithPinia } from '../../utils';
import ProductCard from '../../../src/components/ProductCard.vue';
import type { ProductType } from '../../../src/types';

// Mock Heroicons
vi.mock('@heroicons/vue/24/outline', () => ({
  CameraIcon: { template: '<div data-testid="camera-icon"></div>' },
  PlusIcon: { template: '<div data-testid="plus-icon"></div>' }
}));

// Mock categories
vi.mock('../../../src/assets/categories', () => ({
  getCategoryDisplayName: vi.fn((categoryId: string) => `Category: ${categoryId}`)
}));

describe('ProductCard', () => {
  const createTestProduct = (overrides: Partial<ProductType> = {}): ProductType => ({
    id: 1,
    name: 'Test Product',
    categoryId: 'test-category',
    description: 'Test description',
    photoCount: 5,
    price: 1000,
    ...overrides
  });

  describe('Product Display', () => {
    it('should display product information correctly', () => {
      const product = createTestProduct({
        name: 'Sample Product',
        photoCount: 10,
        price: 2500
      });

      const wrapper = mountWithPinia(ProductCard, {
        props: { product }
      });

      expect(wrapper.text()).toContain('Sample Product');
      expect(wrapper.text()).toContain('10');
      expect(wrapper.text()).toContain('¥2,500');
    });

    it('should display variation when present', () => {
      const product = createTestProduct({
        variation: 'Premium Version'
      });

      const wrapper = mountWithPinia(ProductCard, {
        props: { product }
      });

      expect(wrapper.text()).toContain('Premium Version');
    });

    it('should not display variation section when not present', () => {
      const product = createTestProduct();

      const wrapper = mountWithPinia(ProductCard, {
        props: { product }
      });

      expect(wrapper.text()).not.toContain('Premium Version');
    });
  });

  describe('Quantity Limits', () => {
    it('should display quantity limit when maxQuantity is set', () => {
      const product = createTestProduct({
        maxQuantity: 3
      });

      const wrapper = mountWithPinia(ProductCard, {
        props: { product }
      });

      expect(wrapper.text()).toContain('最大3個まで');
    });

    it('should not display quantity limit when maxQuantity is not set', () => {
      const product = createTestProduct();

      const wrapper = mountWithPinia(ProductCard, {
        props: { product }
      });

      expect(wrapper.text()).not.toContain('最大');
    });
  });

  describe('Accessibility', () => {
    it('should have proper structure for screen readers', () => {
      const product = createTestProduct({
        name: 'Accessible Product'
      });

      const wrapper = mountWithPinia(ProductCard, {
        props: { product }
      });

      // Check that the product name is in a heading element
      const heading = wrapper.find('h3');
      expect(heading.exists()).toBe(true);
      expect(heading.text()).toContain('Accessible Product');
    });

    it('should have camera icon for photo count', () => {
      const product = createTestProduct();

      const wrapper = mountWithPinia(ProductCard, {
        props: { product }
      });

      expect(wrapper.find('[data-testid="camera-icon"]').exists()).toBe(true);
    });
  });
});