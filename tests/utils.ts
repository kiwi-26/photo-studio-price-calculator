import { createPinia, setActivePinia } from 'pinia';
import { mount, VueWrapper } from '@vue/test-utils';
import { Component } from 'vue';

/**
 * Test utilities for Vue components and Pinia stores
 */

/**
 * Creates a fresh Pinia instance for testing
 */
export function createTestPinia() {
  const pinia = createPinia();
  setActivePinia(pinia);
  return pinia;
}

/**
 * Mounts a Vue component with Pinia support
 */
export function mountWithPinia<T extends Component>(
  component: T,
  options: any = {}
): VueWrapper<any> {
  const pinia = createTestPinia();
  
  return mount(component, {
    global: {
      plugins: [pinia],
      ...options.global
    },
    ...options
  });
}

/**
 * Test data factories
 */
export const createTestProduct = (overrides = {}) => ({
  id: 1,
  name: 'Test Product',
  categoryId: 'test-category',
  description: 'Test description',
  photoCount: 5,
  price: 1000,
  ...overrides
});

export const createTestCartItem = (overrides = {}) => ({
  id: 'test-item-1',
  productId: 1,
  quantity: 1,
  customizations: {},
  ...overrides
});

/**
 * Mock data for testing
 */
export const mockProducts = [
  createTestProduct({ id: 1, name: 'Product 1', price: 1000 }),
  createTestProduct({ id: 2, name: 'Product 2', price: 2000 }),
  createTestProduct({ id: 3, name: 'Product 3', price: 1500 })
];

export const mockCategories = [
  { id: 'category-1', name: 'Category 1', description: 'Test category 1' },
  { id: 'category-2', name: 'Category 2', description: 'Test category 2' }
];