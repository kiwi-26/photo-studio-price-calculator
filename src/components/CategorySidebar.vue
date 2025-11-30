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
              'w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors',
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
              'w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors',
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

        <!-- Pose Count Filter Section -->
        <div class="mt-6">
          <label for="pose-count-filter" class="block text-md font-semibold mb-3 text-gray-900 dark:text-white">
            ポーズ数
          </label>
          <select
            id="pose-count-filter"
            :value="selectedPoseCountFilter"
            @change="selectPoseCountFilter(($event.target as HTMLSelectElement).value)"
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
        <div class="mt-6">
          <label for="sort-order" class="block text-md font-semibold mb-3 text-gray-900 dark:text-white">
            ソート順
          </label>
          <select
            id="sort-order"
            :value="selectedSortOrder"
            @change="selectSortOrder(($event.target as HTMLSelectElement).value)"
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
        <div class="mt-6">
          <label for="price-filter" class="block text-md font-semibold mb-3 text-gray-900 dark:text-white">
            価格
          </label>
          <select
            id="price-filter"
            :value="selectedPriceFilter"
            @change="selectPriceFilter(($event.target as HTMLSelectElement).value)"
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
        <div class="mt-6">
          <label class="flex items-center">
            <input
              type="checkbox"
              :checked="characterDesignFee"
              @change="selectCharacterDesignFee(($event.target as HTMLInputElement).checked)"
              class="rounded border-gray-300 dark:border-gray-600 text-blue-600 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-gray-700"
            />
            <span class="ml-2 text-sm text-gray-900 dark:text-white">
              キャラクターデザイン衣装<br>
              <span class="text-xs text-gray-600 dark:text-gray-400">(+1,000円)</span>
            </span>
          </label>
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
              'w-full flex flex-col items-center px-0.5 py-2 rounded-md text-[10px] font-medium transition-colors',
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
              'w-full flex flex-col items-center px-0.5 py-2 rounded-md text-[10px] font-medium transition-colors',
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

        <!-- Mobile Pose Count Filter Section -->
        <div class="mt-2 border-t border-gray-200 dark:border-gray-700 pt-2">
          <label for="mobile-pose-count-filter" class="block text-[10px] font-semibold mb-1 text-gray-900 dark:text-white text-center">
            ポーズ数
          </label>
          <select
            id="mobile-pose-count-filter"
            :value="selectedPoseCountFilter"
            @change="selectPoseCountFilter(($event.target as HTMLSelectElement).value)"
            class="w-full px-1 py-1 border border-gray-300 dark:border-gray-600 rounded text-[10px] bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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

        <!-- Mobile Sort Order Section -->
        <div class="mt-2 border-t border-gray-200 dark:border-gray-700 pt-2">
          <label for="mobile-sort-order" class="block text-[10px] font-semibold mb-1 text-gray-900 dark:text-white text-center">
            ソート順
          </label>
          <select
            id="mobile-sort-order"
            :value="selectedSortOrder"
            @change="selectSortOrder(($event.target as HTMLSelectElement).value)"
            class="w-full px-1 py-1 border border-gray-300 dark:border-gray-600 rounded text-[10px] bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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

        <!-- Mobile Price Filter Section -->
        <div class="mt-2 border-t border-gray-200 dark:border-gray-700 pt-2">
          <label for="mobile-price-filter" class="block text-[10px] font-semibold mb-1 text-gray-900 dark:text-white text-center">
            価格
          </label>
          <select
            id="mobile-price-filter"
            :value="selectedPriceFilter"
            @change="selectPriceFilter(($event.target as HTMLSelectElement).value)"
            class="w-full px-1 py-1 border border-gray-300 dark:border-gray-600 rounded text-[10px] bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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

        <!-- Mobile Character Design Fee Section -->
        <div class="mt-2 border-t border-gray-200 dark:border-gray-700 pt-2">
          <label class="flex flex-col items-center">
            <input
              type="checkbox"
              :checked="characterDesignFee"
              @change="selectCharacterDesignFee(($event.target as HTMLInputElement).checked)"
              class="rounded border-gray-300 dark:border-gray-600 text-blue-600 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-gray-700 mb-1"
            />
            <span class="text-[10px] text-gray-900 dark:text-white text-center leading-tight">
              キャラデザ<br>
              <span class="text-[8px] text-gray-600 dark:text-gray-400">(+1,000円)</span>
            </span>
          </label>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { QueueListIcon } from '@heroicons/vue/24/outline';
import type { PoseCountFilter, SortOption, PriceFilter } from '../stores/products';

interface CategoryDisplay {
  id: string;
  name: string;
  icon: any;
  shortName: string;
}

const props = defineProps<{
  categories: CategoryDisplay[];
  selectedCategory?: string;
  poseCountFilters: PoseCountFilter[];
  selectedPoseCountFilter?: string;
  sortOptions: SortOption[];
  selectedSortOrder?: string;
  priceFilters: PriceFilter[];
  selectedPriceFilter?: string;
  characterDesignFee?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:selectedCategory', value: string): void;
  (e: 'update:selectedPoseCountFilter', value: string): void;
  (e: 'update:selectedSortOrder', value: string): void;
  (e: 'update:selectedPriceFilter', value: string): void;
  (e: 'update:characterDesignFee', value: boolean): void;
}>();

const selectCategory = (categoryId: string) => {
  emit('update:selectedCategory', categoryId);
};

const selectPoseCountFilter = (filterId: string) => {
  emit('update:selectedPoseCountFilter', filterId);
};

const selectSortOrder = (sortId: string) => {
  emit('update:selectedSortOrder', sortId);
};

const selectPriceFilter = (filterId: string) => {
  emit('update:selectedPriceFilter', filterId);
};

const selectCharacterDesignFee = (enabled: boolean) => {
  emit('update:characterDesignFee', enabled);
};
</script>