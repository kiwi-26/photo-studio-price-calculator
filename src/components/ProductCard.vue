<template>
  <div 
    class="border border-primary/30 rounded-xl p-6 transition-all duration-200 bg-primary/5 hover:-translate-y-1 hover:shadow-[0_8px_16px_rgba(100,108,255,0.2)]"
  >
    <div class="mb-4">
      <span class="inline-block py-1.5 px-3 bg-primary text-white rounded-full text-sm font-semibold">{{ product.category }}</span>
    </div>
    <h3 class="text-xl mb-3 text-primary">{{ product.name }}</h3>
    <p class="mb-4 opacity-80 leading-6">{{ product.description }}</p>
    <div class="mb-4 p-4 bg-primary/10 rounded-lg">
      <div class="flex justify-between mb-2">
        <span class="font-semibold">Photos:</span>
        <span class="font-medium">{{ product.photoCount }}</span>
      </div>
      <div class="flex justify-between mb-2">
        <span class="font-semibold">Price:</span>
        <span class="font-medium text-success text-lg">¥{{ product.price.toLocaleString() }}</span>
      </div>
      <div v-if="product.variation" class="flex justify-between mt-2 pt-2 border-t border-primary/20">
        <span class="font-semibold">Variation:</span>
        <span class="font-medium">{{ product.variation }}</span>
      </div>
    </div>
    <button 
      @click="$emit('add-to-cart', product)" 
      class="w-full bg-primary text-white border-none py-3 font-semibold rounded-lg transition-colors duration-200 hover:bg-primary-hover"
    >
      Add to Cart
    </button>
  </div>
</template>

<script setup>
// Props
defineProps({
  product: {
    type: Object,
    required: true
  }
})

// Emits
defineEmits(['add-to-cart'])
</script>