<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 class="text-lg font-medium text-gray-900">
          {{ isEditing ? '商品編集' : '新規商品追加' }}
        </h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon class="h-6 w-6" />
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="overflow-auto max-h-[calc(90vh-120px)]">
        <div class="px-6 py-4 space-y-6">
          <!-- Product Name -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
              商品名 <span class="text-red-500">*</span>
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="商品名を入力してください"
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
          </div>

          <!-- Category -->
          <div>
            <label for="categoryId" class="block text-sm font-medium text-gray-700 mb-2">
              カテゴリ <span class="text-red-500">*</span>
            </label>
            <select
              id="categoryId"
              v-model="form.categoryId"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">カテゴリを選択してください</option>
              <option v-for="category in editorStore.availableCategories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
            <p v-if="errors.categoryId" class="mt-1 text-sm text-red-600">{{ errors.categoryId }}</p>
          </div>

          <!-- Description -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
              説明 <span class="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              v-model="form.description"
              required
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="商品の説明を入力してください"
            ></textarea>
            <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
          </div>

          <!-- Price -->
          <div>
            <label for="price" class="block text-sm font-medium text-gray-700 mb-2">
              価格（円） <span class="text-red-500">*</span>
            </label>
            <input
              id="price"
              v-model.number="form.price"
              type="number"
              min="0"
              step="1"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="価格を入力してください"
            />
            <p v-if="errors.price" class="mt-1 text-sm text-red-600">{{ errors.price }}</p>
          </div>

          <!-- Photo Count -->
          <div>
            <label for="photoCount" class="block text-sm font-medium text-gray-700 mb-2">
              写真数 <span class="text-red-500">*</span>
            </label>
            <input
              id="photoCount"
              v-model.number="form.photoCount"
              type="number"
              min="0"
              step="1"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="写真数を入力してください"
            />
            <p v-if="errors.photoCount" class="mt-1 text-sm text-red-600">{{ errors.photoCount }}</p>
          </div>

          <!-- Variation (Optional) -->
          <div>
            <label for="variation" class="block text-sm font-medium text-gray-700 mb-2">
              バリエーション（オプション）
            </label>
            <input
              id="variation"
              v-model="form.variation"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="バリエーション情報があれば入力してください"
            />
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            キャンセル
          </button>
          <button
            type="submit"
            :disabled="!isFormValid"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isEditing ? '更新' : '追加' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useProductEditorStore } from '../stores/productEditor';
import type { ProductType } from '../types';
import { XMarkIcon } from '@heroicons/vue/24/outline';

interface Props {
  product?: ProductType | null;
  duplicateProduct?: ProductType | null;
}

interface Emits {
  (e: 'close'): void;
  (e: 'save', product: Omit<ProductType, 'id'>): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const editorStore = useProductEditorStore();

// Form state
const form = ref({
  name: '',
  categoryId: '',
  description: '',
  price: 0,
  photoCount: 0,
  variation: ''
});

// Validation errors
const errors = ref({
  name: '',
  categoryId: '',
  description: '',
  price: '',
  photoCount: ''
});

// Computed properties
const isEditing = computed(() => !!props.product);

const isFormValid = computed(() => {
  return form.value.name.trim() !== '' &&
         form.value.categoryId !== '' &&
         form.value.description.trim() !== '' &&
         form.value.price > 0 &&
         form.value.photoCount >= 0;
});

// Methods
const validateForm = () => {
  errors.value = {
    name: '',
    categoryId: '',
    description: '',
    price: '',
    photoCount: ''
  };

  let isValid = true;

  if (!form.value.name.trim()) {
    errors.value.name = '商品名は必須です';
    isValid = false;
  }

  if (!form.value.categoryId) {
    errors.value.categoryId = 'カテゴリは必須です';
    isValid = false;
  }

  if (!form.value.description.trim()) {
    errors.value.description = '説明は必須です';
    isValid = false;
  }

  if (form.value.price <= 0) {
    errors.value.price = '価格は0より大きい値を入力してください';
    isValid = false;
  }

  if (form.value.photoCount < 0) {
    errors.value.photoCount = '写真数は0以上の値を入力してください';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = () => {
  if (!validateForm()) {
    return;
  }

  const productData: Omit<ProductType, 'id'> = {
    name: form.value.name.trim(),
    categoryId: form.value.categoryId,
    description: form.value.description.trim(),
    price: form.value.price,
    photoCount: form.value.photoCount,
    ...(form.value.variation && { variation: form.value.variation.trim() })
  };

  emit('save', productData);
};

const resetForm = () => {
  form.value = {
    name: '',
    categoryId: '',
    description: '',
    price: 0,
    photoCount: 0,
    variation: ''
  };
  errors.value = {
    name: '',
    categoryId: '',
    description: '',
    price: '',
    photoCount: ''
  };
};

// Initialize form with product data if editing
onMounted(() => {
  if (props.product) {
    form.value = {
      name: props.product.name,
      categoryId: props.product.categoryId,
      description: props.product.description,
      price: props.product.price,
      photoCount: props.product.photoCount,
      variation: props.product.variation || ''
    };
  } else if (props.duplicateProduct) {
    form.value = {
      name: props.duplicateProduct.name,
      categoryId: props.duplicateProduct.categoryId,
      description: props.duplicateProduct.description,
      price: props.duplicateProduct.price,
      photoCount: props.duplicateProduct.photoCount,
      variation: props.duplicateProduct.variation || ''
    };
  }
});

// Watch for product changes
watch(() => props.product, (newProduct) => {
  if (newProduct) {
    form.value = {
      name: newProduct.name,
      categoryId: newProduct.categoryId,
      description: newProduct.description,
      price: newProduct.price,
      photoCount: newProduct.photoCount,
      variation: newProduct.variation || ''
    };
  } else {
    resetForm();
  }
});
</script>