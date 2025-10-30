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
          @update-quantity="updateQuantity"
          @clear-cart="clearCart"
        />
      </div>
    </div>

    <!-- Sticky Cart Footer - Always visible -->
    <StickyCartFooter 
      :cart="cart"
      @remove-from-cart="removeFromCart"
      @update-quantity="updateQuantity"
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
  // Check if product already exists in cart
  const existingItemIndex = cart.value.findIndex(item => item.id === product.id)
  
  if (existingItemIndex !== -1) {
    // Product exists, increment quantity
    cart.value[existingItemIndex].quantity += 1
  } else {
    // Product doesn't exist, add new item with quantity 1
    cart.value.push({ ...product, quantity: 1 })
  }
}

const removeFromCart = (index) => {
  cart.value.splice(index, 1)
}

const updateQuantity = (index, newQuantity) => {
  if (newQuantity <= 0) {
    // Remove item if quantity is 0 or less
    removeFromCart(index)
  } else {
    // Update quantity
    cart.value[index].quantity = newQuantity
  }
}

const clearCart = () => {
  cart.value = []
}
</script>
