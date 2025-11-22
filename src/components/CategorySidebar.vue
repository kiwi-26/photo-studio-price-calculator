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
              <QueueListIcon class="w-5 h-5 mr-3" />
              すべて
            </span>
          </button>
          
          <!-- Category Buttons -->
          <button
            v-for="category in categories"
            :key="category"
            @click="selectCategory(category)"
            :class="[
              'w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors',
              selectedCategory === category 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            ]"
          >
            <span class="flex items-center">
              <component :is="getCategoryIcon(category)" class="w-5 h-5 mr-3" />
              <span class="truncate">{{ category }}</span>
            </span>
          </button>
        </nav>
      </div>
    </div>

    <!-- Mobile Compact Sidebar -->
    <div class="md:hidden w-16 h-full overflow-y-auto">
      <div class="p-2">
        <nav class="space-y-3">
          <!-- All Categories Option -->
          <button
            @click="selectCategory('')"
            :class="[
              'w-full flex flex-col items-center px-2 py-3 rounded-md text-xs font-medium transition-colors',
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
            :key="category"
            @click="selectCategory(category)"
            :class="[
              'w-full flex flex-col items-center px-2 py-3 rounded-md text-xs font-medium transition-colors',
              selectedCategory === category 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            ]"
            :title="category"
          >
            <component :is="getCategoryIcon(category)" class="w-6 h-6 mb-1" />
            <span class="text-center leading-tight">{{ getShortCategoryName(category) }}</span>
          </button>
        </nav>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import {
  QueueListIcon,
  PhotoIcon,
  BookOpenIcon,
  DocumentTextIcon,
  NewspaperIcon,
  PaintBrushIcon,
  FaceSmileIcon,
  GiftIcon,
  SparklesIcon
} from '@heroicons/vue/24/outline';

const props = defineProps<{
  categories: string[];
  selectedCategory?: string;
}>();

const emit = defineEmits<{
  (e: 'update:selectedCategory', value: string): void;
}>();

const selectCategory = (category: string) => {
  emit('update:selectedCategory', category);
};

const getCategoryIcon = (category: string) => {
  const iconMap: Record<string, any> = {
    'プリント': PhotoIcon,
    'アルバム': BookOpenIcon,
    'アルバムプリント 増えデジ': DocumentTextIcon,
    'アルバムプリント ベーシック': NewspaperIcon,
    '写真集': BookOpenIcon,
    '写真台紙 プレミア': PaintBrushIcon,
    '写真台紙 プレミア キャラクター': FaceSmileIcon,
    '写真台紙 ギフト': GiftIcon,
    '写真台紙 デザイン ポエム付き': SparklesIcon
  };
  return iconMap[category] || DocumentTextIcon;
};

const getShortCategoryName = (category: string): string => {
  const shortNameMap: Record<string, string> = {
    'プリント': 'プリント',
    'アルバム': 'アルバム',
    'アルバムプリント 増えデジ': '増えデジ',
    'アルバムプリント ベーシック': 'ベーシック',
    '写真集': '写真集',
    '写真台紙 プレミア': 'プレミア',
    '写真台紙 プレミア キャラクター': 'キャラ',
    '写真台紙 ギフト': 'ギフト',
    '写真台紙 デザイン ポエム付き': 'ポエム'
  };
  return shortNameMap[category] || category.slice(0, 4);
};
</script>