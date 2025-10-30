<template>
  <div class="mb-6 p-4 bg-primary/10 rounded-lg">
    <label for="category-filter" class="block mb-2 font-semibold">Filter by category:</label>
    <select 
      id="category-filter" 
      :value="selectedCategory"
      @change="$emit('update:selectedCategory', $event.target.value)"
      class="w-full p-2.5 text-base rounded-md border border-primary bg-inherit text-inherit cursor-pointer"
    >
      <option value="">All Categories</option>
      <option v-for="category in categories" :key="category" :value="category">
        {{ category }}
      </option>
    </select>
  </div>
</template>

<script setup>
// Props
defineProps({
  categories: {
    type: Array,
    required: true
  },
  selectedCategory: {
    type: String,
    default: ''
  }
})

// Emits
defineEmits(['update:selectedCategory'])
</script>