<template>
  <div class="border-t-2 border-primary pt-4 mb-4">
    <div class="flex justify-between py-2 text-lg">
      <span>Total Photos:</span>
      <span>{{ totalPhotoCount }}</span>
    </div>
    <div class="flex justify-between py-2 text-xl font-bold text-success">
      <span>Total Price:</span>
      <span>¥{{ totalPrice }}</span>
    </div>
  </div>
</template>

<script setup>
// Props
defineProps({
  totalPrice: {
    type: Number,
    required: true
  },
  totalPhotoCount: {
    type: Number,
    required: true
  }
})
</script>