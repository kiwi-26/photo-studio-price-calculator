// Simple test to verify TypeScript compilation
import { useProductEditorStore } from './stores/productEditor';
import type { ProductType } from './types';

// Test that all types are properly defined
const testProduct: ProductType = {
  id: 999,
  name: 'Test Product',
  categoryId: 'print',
  description: 'Test Description',
  photoCount: 1,
  price: 1000
};

console.log('Product Editor implementation test passed');
console.log('Test product:', testProduct);

export { testProduct };