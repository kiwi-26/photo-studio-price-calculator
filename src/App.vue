<template>
  <div class="min-h-screen pb-20">
    <AppHeader />

    <div class="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
      <!-- Products Section -->
      <ProductsList 
        :products="products"
        :selected-category="selectedCategory"
        @add-to-cart="addToCart"
        @update:selected-category="selectedCategory = $event"
      />

      <!-- Cart Section - Hidden on mobile, visible on desktop -->
      <div class="hidden lg:block">
        <ShoppingCart 
          :cart="cart"
          @remove-from-cart="removeFromCart"
          @clear-cart="clearCart"
        />
      </div>
    </div>

    <!-- Sticky Cart Footer - Always visible -->
    <StickyCartFooter 
      :cart="cart"
      @remove-from-cart="removeFromCart"
      @clear-cart="clearCart"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import productsData from './assets/products.json'
import AppHeader from './components/AppHeader.vue'
import ProductsList from './components/ProductsList.vue'
import ShoppingCart from './components/ShoppingCart.vue'
import StickyCartFooter from './components/StickyCartFooter.vue'

// State
const products = ref(productsData)
const cart = ref([])
const selectedCategory = ref('')

// Methods
const addToCart = (product) => {
  cart.value.push({ ...product })
}

const removeFromCart = (index) => {
  cart.value.splice(index, 1)
}

const clearCart = () => {
  cart.value = []
}
</script>
