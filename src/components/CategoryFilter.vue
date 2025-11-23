<template>
  <div class="mb-6 p-4 bg-primary/10 rounded-lg">
    <label for="category-filter" class="block mb-2 font-semibold">カテゴリーを選択</label>
    <select 
      id="category-filter" 
      :value="selectedCategory"
      @change="$emit('update:selectedCategory', ($event.target as HTMLSelectElement).value)"
      class="w-full p-2.5 text-base rounded-md border border-primary bg-inherit text-inherit cursor-pointer"
    >
      <option value="">すべて</option>
      <option v-for="category in categories" :key="category.id" :value="category.id">
        {{ category.name }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
interface CategoryDisplay {
  id: string;
  name: string;
  icon: any;
  shortName: string;
}

const props = defineProps<{
  categories: CategoryDisplay[];
  selectedCategory?: string;
}>();

defineEmits<{
  (e: 'update:selectedCategory', value: string): void;
}>();
</script>