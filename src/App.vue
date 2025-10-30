<template>
  <div class="min-h-screen">
    <AppHeader />

    <div class="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
      <!-- Products Section -->
      <ProductsList 
        :products="products"
        :selected-category="selectedCategory"
        @add-to-cart="addToCart"
        @update:selected-category="selectedCategory = $event"
      />

      <!-- Cart Section -->
      <ShoppingCart 
        :cart="cart"
        @remove-from-cart="removeFromCart"
        @clear-cart="clearCart"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import productsData from './assets/products.json'
import AppHeader from './components/AppHeader.vue'
import ProductsList from './components/ProductsList.vue'
import ShoppingCart from './components/ShoppingCart.vue'

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
