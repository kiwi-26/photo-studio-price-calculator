<template>
  <div class="flex justify-between items-start p-4 mb-4 bg-primary/10 rounded-lg border border-primary/20">
    <div class="flex-1">
      <h4 class="text-base mb-1">{{ item.name }}</h4>
      <p class="text-sm opacity-70 mb-2">{{ item.category }}</p>
      <div class="flex justify-between text-sm">
        <span>{{ item.photoCount }} ポーズ</span>
        <span class="text-success font-semibold">¥{{ item.price.toLocaleString() }}</span>
      </div>
    </div>
    <button 
      @click="$emit('remove-item', index)" 
      class="bg-danger text-white border-none w-7 h-7 rounded-full cursor-pointer p-0 ml-2 hover:bg-danger-hover transition-colors duration-200"
    >
      ✕
    </button>
  </div>
</template>

<script setup>
// Props
defineProps({
  item: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  }
})

// Emits
defineEmits(['remove-item'])
</script>