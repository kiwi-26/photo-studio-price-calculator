<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">商品編集ツール</h1>
            <p class="text-sm text-gray-600">商品の追加・編集・削除ができます</p>
          </div>
          <div class="flex space-x-3">
            <button
              @click="editorStore.openAddForm()"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <PlusIcon class="h-4 w-4 mr-2" />
              新規追加
            </button>
            <button
              @click="showExport = !showExport"
              class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <CodeBracketIcon class="h-4 w-4 mr-2" />
              エクスポート
            </button>
            <button
              @click="resetProducts"
              class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <ArrowPathIcon class="h-4 w-4 mr-2" />
              リセット
            </button>
            <button
              @click="editorStore.toggleEditorMode()"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              編集終了
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Export Modal -->
    <div v-if="showExport" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">products.ts エクスポート</h3>
          <button
            @click="showExport = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon class="h-6 w-6" />
          </button>
        </div>
        <div class="p-6 overflow-auto max-h-[60vh]">
          <div class="mb-4">
            <button
              @click="copyToClipboard"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              クリップボードにコピー
            </button>
          </div>
          <pre class="bg-gray-100 p-4 rounded-md text-sm overflow-auto"><code>{{ editorStore.exportCode }}</code></pre>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <CubeIcon class="h-8 w-8 text-gray-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">総商品数</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ editorStore.products.length }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <TagIcon class="h-8 w-8 text-gray-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">カテゴリ数</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ uniqueCategories.length }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <CurrencyYenIcon class="h-8 w-8 text-gray-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">平均価格</dt>
                  <dd class="text-lg font-medium text-gray-900">¥{{ averagePrice.toLocaleString() }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Search and Filter -->
      <div class="bg-white shadow rounded-lg mb-6">
        <div class="px-6 py-4">
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="商品名で検索..."
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div class="sm:w-64">
              <select
                v-model="selectedCategory"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">すべてのカテゴリ</option>
                <option v-for="category in editorStore.availableCategories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Products Table -->
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">商品一覧</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">商品名</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">カテゴリ</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">価格</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">写真数</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="product in filteredProducts" :key="product.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.id }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                  <div class="text-sm text-gray-500">{{ product.description }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ getCategoryName(product.categoryId) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ¥{{ product.price.toLocaleString() }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ product.photoCount }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click="editorStore.openEditForm(product)"
                    class="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    編集
                  </button>
                  <button
                    @click="editorStore.openDuplicateForm(product)"
                    class="text-green-600 hover:text-green-900 mr-3"
                  >
                    複製
                  </button>
                  <button
                    @click="deleteProduct(product)"
                    class="text-red-600 hover:text-red-900"
                  >
                    削除
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Product Form Modal -->
    <ProductEditForm
      v-if="editorStore.isFormOpen"
      :product="editorStore.editingProduct"
      :duplicate-product="editorStore.duplicatingProduct"
      @close="editorStore.closeForm()"
      @save="handleSaveProduct"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useProductEditorStore } from '../stores/productEditor';
import { getCategoryDisplayName } from '../assets/categories';
import ProductEditForm from './ProductEditForm.vue';
import type { ProductType } from '../types';
import {
  PlusIcon,
  CodeBracketIcon,
  ArrowPathIcon,
  XMarkIcon,
  CubeIcon,
  TagIcon,
  CurrencyYenIcon
} from '@heroicons/vue/24/outline';

const editorStore = useProductEditorStore();

// Local state
const showExport = ref(false);
const searchQuery = ref('');
const selectedCategory = ref('');

// Computed properties
const filteredProducts = computed(() => {
  let filtered = editorStore.products;

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
  }

  // Filter by category
  if (selectedCategory.value) {
    filtered = filtered.filter(product => product.categoryId === selectedCategory.value);
  }

  return filtered;
});

const uniqueCategories = computed(() => {
  const categories = new Set(editorStore.products.map(p => p.categoryId));
  return Array.from(categories);
});

const averagePrice = computed(() => {
  if (editorStore.products.length === 0) return 0;
  const total = editorStore.products.reduce((sum, product) => sum + product.price, 0);
  return Math.round(total / editorStore.products.length);
});

// Methods
const getCategoryName = (categoryId: string): string => {
  return getCategoryDisplayName(categoryId);
};

const handleSaveProduct = (productData: Omit<ProductType, 'id'>) => {
  if (editorStore.editingProduct) {
    editorStore.updateProduct(editorStore.editingProduct.id, productData);
  } else {
    editorStore.addProduct(productData);
  }
  editorStore.closeForm();
};

const deleteProduct = (product: ProductType) => {
  if (confirm(`「${product.name}」を削除しますか？`)) {
    editorStore.deleteProduct(product.id);
  }
};

const resetProducts = () => {
  if (confirm('すべての変更を破棄して元の状態に戻しますか？')) {
    editorStore.resetToOriginal();
  }
};

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(editorStore.exportCode);
    alert('クリップボードにコピーしました');
  } catch (err) {
    console.error('Failed to copy: ', err);
    alert('コピーに失敗しました');
  }
};
</script>