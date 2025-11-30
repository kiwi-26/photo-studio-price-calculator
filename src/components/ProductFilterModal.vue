<template>
  <!-- Modal Overlay -->
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 overflow-y-auto"
    @click="handleOverlayClick"
  >
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" aria-hidden="true"></div>

      <!-- Modal panel -->
      <div
        class="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl sm:max-w-lg"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            フィルター設定
          </h3>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>

        <!-- Filter Content -->
        <div class="space-y-6">
          <!-- Pose Count Filter Section -->
          <div>
            <label for="modal-pose-count-filter" class="block text-sm font-semibold mb-3 text-gray-900 dark:text-white">
              ポーズ数
            </label>
            <select
              id="modal-pose-count-filter"
              v-model="tempFilters.poseCountFilter"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option
                v-for="poseFilter in poseCountFilters"
                :key="poseFilter.id"
                :value="poseFilter.id"
              >
                {{ poseFilter.name }}
              </option>
            </select>
          </div>

          <!-- Sort Order Section -->
          <div>
            <label for="modal-sort-order" class="block text-sm font-semibold mb-3 text-gray-900 dark:text-white">
              ソート順
            </label>
            <select
              id="modal-sort-order"
              v-model="tempFilters.sortOrder"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option
                v-for="sortOption in sortOptions"
                :key="sortOption.id"
                :value="sortOption.id"
              >
                {{ sortOption.name }}
              </option>
            </select>
          </div>

          <!-- Price Filter Section -->
          <div>
            <label for="modal-price-filter" class="block text-sm font-semibold mb-3 text-gray-900 dark:text-white">
              価格
            </label>
            <select
              id="modal-price-filter"
              v-model="tempFilters.priceFilter"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option
                v-for="priceFilter in priceFilters"
                :key="priceFilter.id"
                :value="priceFilter.id"
              >
                {{ priceFilter.name }}
              </option>
            </select>
          </div>

          <!-- Character Design Fee Section -->
          <div>
            <label class="flex items-center">
              <input
                type="checkbox"
                v-model="tempFilters.characterDesignFee"
                class="rounded border-gray-300 dark:border-gray-600 text-blue-600 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-gray-700"
              />
              <span class="ml-2 text-sm text-gray-900 dark:text-white">
                キャラクターデザイン衣装<br>
                <span class="text-xs text-gray-600 dark:text-gray-400">(+1,000円)</span>
              </span>
            </label>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="flex justify-end space-x-3 mt-8">
          <button
            @click="resetFilters"
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            リセット
          </button>
          <button
            @click="closeModal"
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            キャンセル
          </button>
          <button
            @click="applyFilters"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            反映
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';
import type { PoseCountFilter, SortOption, PriceFilter } from '../stores/products';

interface TempFilters {
  poseCountFilter: string;
  sortOrder: string;
  priceFilter: string;
  characterDesignFee: boolean;
}

const props = defineProps<{
  isOpen: boolean;
  poseCountFilters: PoseCountFilter[];
  selectedPoseCountFilter: string;
  sortOptions: SortOption[];
  selectedSortOrder: string;
  priceFilters: PriceFilter[];
  selectedPriceFilter: string;
  characterDesignFee: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'apply-filters', filters: TempFilters): void;
}>();

// Temporary filter state
const tempFilters = ref<TempFilters>({
  poseCountFilter: props.selectedPoseCountFilter,
  sortOrder: props.selectedSortOrder,
  priceFilter: props.selectedPriceFilter,
  characterDesignFee: props.characterDesignFee
});

// Watch for prop changes to update temp filters when modal opens
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    // Reset temp filters to current values when modal opens
    tempFilters.value = {
      poseCountFilter: props.selectedPoseCountFilter,
      sortOrder: props.selectedSortOrder,
      priceFilter: props.selectedPriceFilter,
      characterDesignFee: props.characterDesignFee
    };
  }
});

const closeModal = () => {
  emit('close');
};

const handleOverlayClick = () => {
  closeModal();
};

const applyFilters = () => {
  emit('apply-filters', { ...tempFilters.value });
  closeModal();
};

const resetFilters = () => {
  tempFilters.value = {
    poseCountFilter: 'all',
    sortOrder: 'id',
    priceFilter: 'all',
    characterDesignFee: false
  };
};
</script>