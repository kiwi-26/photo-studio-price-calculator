import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { products as originalProducts } from '../assets/products';
import { categories, subCategories } from '../assets/categories';
import type { ProductType } from '../types';

export const useProductEditorStore = defineStore('productEditor', () => {
  // State
  const products = ref<ProductType[]>([...originalProducts]);
  const isEditorMode = ref(false);
  const editingProduct = ref<ProductType | null>(null);
  const isFormOpen = ref(false);

  // Getters
  const nextId = computed(() => {
    const maxId = Math.max(...products.value.map(p => typeof p.id === 'number' ? p.id : parseInt(p.id.toString())));
    return maxId + 1;
  });

  const availableCategories = computed(() => {
    const result: Array<{ id: string, name: string }> = [];
    
    // Add main categories
    for (const [id, category] of categories) {
      result.push({ id, name: category.name });
    }
    
    // Add subcategories
    for (const [id, subCategory] of subCategories) {
      result.push({ id, name: `${categories.get(subCategory.parentCategoryId)?.name} - ${subCategory.name}` });
    }
    
    return result.sort((a, b) => a.name.localeCompare(b.name));
  });

  const exportCode = computed(() => {
    const productsJson = JSON.stringify(products.value, null, 2);
    return `import type { ProductType } from "../types";

export const products: ProductType[] = ${productsJson};`;
  });

  // Actions
  const toggleEditorMode = () => {
    isEditorMode.value = !isEditorMode.value;
  };

  const addProduct = (product: Omit<ProductType, 'id'>) => {
    const newProduct: ProductType = {
      ...product,
      id: nextId.value
    };
    products.value.push(newProduct);
  };

  const updateProduct = (id: number | string, updatedProduct: Omit<ProductType, 'id'>) => {
    const index = products.value.findIndex(p => p.id === id);
    if (index !== -1) {
      products.value[index] = { ...updatedProduct, id };
    }
  };

  const deleteProduct = (id: number | string) => {
    const index = products.value.findIndex(p => p.id === id);
    if (index !== -1) {
      products.value.splice(index, 1);
    }
  };

  const openAddForm = () => {
    editingProduct.value = null;
    isFormOpen.value = true;
  };

  const openEditForm = (product: ProductType) => {
    editingProduct.value = { ...product };
    isFormOpen.value = true;
  };

  const closeForm = () => {
    editingProduct.value = null;
    isFormOpen.value = false;
  };

  const resetToOriginal = () => {
    products.value = [...originalProducts];
  };

  const getProductById = (id: number | string): ProductType | undefined => {
    return products.value.find(p => p.id === id);
  };

  return {
    // State
    products,
    isEditorMode,
    editingProduct,
    isFormOpen,
    // Getters
    nextId,
    availableCategories,
    exportCode,
    // Actions
    toggleEditorMode,
    addProduct,
    updateProduct,
    deleteProduct,
    openAddForm,
    openEditForm,
    closeForm,
    resetToOriginal,
    getProductById
  };
});