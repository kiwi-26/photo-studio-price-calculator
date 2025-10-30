<template>
  <aside class="sticky top-8 h-fit border-2 border-primary rounded-xl p-6 bg-primary/5">
    <h2 class="text-3xl mb-6 text-center flex items-center justify-center gap-1">
      <ShoppingCartIcon class="w-8 h-8 mr-2" />
      <span>Shopping Cart</span>
    </h2>
    
    <div v-if="cart.length === 0" class="text-center py-8 opacity-60">
      <p>Your cart is empty</p>
    </div>

    <div v-else>
      <div class="max-h-96 overflow-y-auto mb-6">
        <CartItem 
          v-for="(item, index) in cart" 
          :key="index" 
          :item="item"
          :index="index"
          @remove-item="$emit('remove-from-cart', $event)"
        />
      </div>

      <!-- Totals -->
      <CartSummary 
        :total-price="totalPrice"
        :total-photo-count="totalPhotoCount"
      />

      <button 
        @click="$emit('clear-cart')" 
        class="w-full bg-danger text-white border-none py-3 font-semibold rounded-lg transition-colors duration-200 hover:bg-danger-hover"
      >
        Clear Cart
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import CartItem from './CartItem.vue'
import CartSummary from './CartSummary.vue'
import { ShoppingCartIcon } from '@heroicons/vue/24/solid'

// Props
const props = defineProps({
  cart: {
    type: Array,
    required: true
  }
})

// Emits
defineEmits(['remove-from-cart', 'clear-cart'])

// Computed properties
const totalPrice = computed(() => {
  return props.cart.reduce((sum, item) => sum + item.price, 0)
})

const totalPhotoCount = computed(() => {
  return props.cart.reduce((sum, item) => sum + item.photoCount, 0)
})
</script>