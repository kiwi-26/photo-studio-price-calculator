<template>
  <aside class="fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40">
    <!-- Desktop Sidebar -->
    <div class="hidden md:block w-64 h-full overflow-y-auto">
      <div class="p-4">
        <h2 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">カテゴリー</h2>
        <nav class="space-y-2">
          <!-- All Categories Option -->
          <button
            @click="selectCategory('')"
            :class="[
              'w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors touch-manipulation',
              selectedCategory === '' 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            ]"
          >
            <span class="flex items-center">
              <QueueListIcon class="w-5 h-5 mr-2" />
              すべて
            </span>
          </button>
          
          <!-- Category Buttons -->
          <button
            v-for="category in categories"
            :key="category.id"
            @click="selectCategory(category.id)"
            :class="[
              'w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors touch-manipulation',
              selectedCategory === category.id 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            ]"
          >
            <span class="flex items-center">
              <component :is="category.icon" class="w-5 h-5 mr-2" />
              <span class="truncate">{{ category.name }}</span>
            </span>
          </button>
        </nav>

        <!-- Filter Button Section -->
        <div class="mt-6">
          <button
            @click="openFilterModal"
            class="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors flex items-center justify-center touch-manipulation"
          >
            <AdjustmentsHorizontalIcon class="w-5 h-5 mr-2" />
            フィルター
            <span v-if="activeFiltersCount > 0" class="ml-2 bg-blue-800 text-xs px-2 py-1 rounded-full">
              {{ activeFiltersCount }}
            </span>
          </button>
          <div v-if="filterSummary" class="mt-2 text-xs text-gray-600 dark:text-gray-400">
            {{ filterSummary }}
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Compact Sidebar -->
    <div class="md:hidden w-16 h-full overflow-y-auto">
      <div class="p-1">
        <nav class="space-y-1">
          <!-- All Categories Option -->
          <button
            @click="selectCategory('')"
            :class="[
              'w-full flex flex-col items-center px-0.5 py-2 rounded-md text-[10px] font-medium transition-colors touch-manipulation',
              selectedCategory === '' 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            ]"
          >
            <QueueListIcon class="w-6 h-6 mb-1" />
            <span class="text-center leading-tight">すべて</span>
          </button>
          
          <!-- Category Buttons -->
          <button
            v-for="category in categories"
            :key="category.id"
            @click="selectCategory(category.id)"
            :class="[
              'w-full flex flex-col items-center px-0.5 py-2 rounded-md text-[10px] font-medium transition-colors touch-manipulation',
              selectedCategory === category.id 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            ]"
            :title="category.name"
          >
            <component :is="category.icon" class="w-6 h-6 mb-1" />
            <span class="text-center leading-tight">{{ category.shortName }}</span>
          </button>
        </nav>

        <!-- Mobile Filter Button Section -->
        <div class="mt-2 border-t border-gray-200 dark:border-gray-700 pt-2">
          <button
            @click="openFilterModal"
            class="w-full px-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-medium transition-colors flex flex-col items-center relative touch-manipulation"
          >
            <AdjustmentsHorizontalIcon class="w-4 h-4 mb-1" />
            <span>フィルター</span>
            <span v-if="activeFiltersCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] px-1 rounded-full min-w-[16px] h-4 flex items-center justify-center">
              {{ activeFiltersCount }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { QueueListIcon, AdjustmentsHorizontalIcon } from '@heroicons/vue/24/outline';

interface CategoryDisplay {
  id: string;
  name: string;
  icon: any;
  shortName: string;
}

const props = defineProps<{
  categories: CategoryDisplay[];
  selectedCategory?: string;
  selectedPoseCountFilter?: string;
  selectedSortOrder?: string;
  selectedPriceFilter?: string;
  characterDesignFee?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:selectedCategory', value: string): void;
  (e: 'open-filter-modal'): void;
}>();

const selectCategory = (categoryId: string) => {
  emit('update:selectedCategory', categoryId);
};

const openFilterModal = () => {
  emit('open-filter-modal');
};

// Compute active filters count for badge display
const activeFiltersCount = computed(() => {
  let count = 0;
  
  if (props.selectedPoseCountFilter && props.selectedPoseCountFilter !== 'all') {
    count++;
  }
  
  if (props.selectedSortOrder && props.selectedSortOrder !== 'id') {
    count++;
  }
  
  if (props.selectedPriceFilter && props.selectedPriceFilter !== 'all') {
    count++;
  }
  
  if (props.characterDesignFee) {
    count++;
  }
  
  return count;
});

// Compute filter summary text
const filterSummary = computed(() => {
  const summaryParts: string[] = [];
  
  if (props.selectedPoseCountFilter && props.selectedPoseCountFilter !== 'all') {
    summaryParts.push('ポーズ数');
  }
  
  if (props.selectedSortOrder && props.selectedSortOrder !== 'id') {
    summaryParts.push('ソート');
  }
  
  if (props.selectedPriceFilter && props.selectedPriceFilter !== 'all') {
    summaryParts.push('価格');
  }
  
  if (props.characterDesignFee) {
    summaryParts.push('キャラデザ');
  }
  
  return summaryParts.length > 0 ? `適用中: ${summaryParts.join(', ')}` : '';
});
</script>