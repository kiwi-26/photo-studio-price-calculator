<template>
  <div class="min-h-screen">
    <header class="text-center mb-8 pb-4 border-b-2 border-primary">
      <h1 class="text-4xl mb-2 text-primary font-bold">📸 Photo Studio Price Calculator</h1>
      <p class="text-lg opacity-80">Select products to add to your cart</p>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
      <!-- Products Section -->
      <section>
        <h2 class="text-3xl mb-6">Available Products</h2>
        
        <!-- Category Filter -->
        <div class="mb-6 p-4 bg-primary/10 rounded-lg">
          <label for="category-filter" class="block mb-2 font-semibold">Filter by category:</label>
          <select 
            id="category-filter" 
            v-model="selectedCategory"
            class="w-full p-2.5 text-base rounded-md border border-primary bg-inherit text-inherit cursor-pointer"
          >
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>

        <!-- Products List -->
        <div class="grid gap-6" style="grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));">
          <div 
            v-for="product in filteredProducts" 
            :key="product.id" 
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
                <span class="font-medium text-success text-lg">${{ product.price }}</span>
              </div>
              <div v-if="product.variation" class="flex justify-between mt-2 pt-2 border-t border-primary/20">
                <span class="font-semibold">Variation:</span>
                <span class="font-medium">{{ product.variation }}</span>
              </div>
            </div>
            <button 
              @click="addToCart(product)" 
              class="w-full bg-primary text-white border-none py-3 font-semibold rounded-lg transition-colors duration-200 hover:bg-primary-hover"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </section>

      <!-- Cart Section -->
      <aside class="sticky top-8 h-fit border-2 border-primary rounded-xl p-6 bg-primary/5">
        <h2 class="text-3xl mb-6 text-center">🛒 Shopping Cart</h2>
        
        <div v-if="cart.length === 0" class="text-center py-8 opacity-60">
          <p>Your cart is empty</p>
        </div>

        <div v-else>
          <div class="max-h-96 overflow-y-auto mb-6">
            <div 
              v-for="(item, index) in cart" 
              :key="index" 
              class="flex justify-between items-start p-4 mb-4 bg-primary/10 rounded-lg border border-primary/20"
            >
              <div class="flex-1">
                <h4 class="text-base mb-1">{{ item.name }}</h4>
                <p class="text-sm opacity-70 mb-2">{{ item.category }}</p>
                <div class="flex justify-between text-sm">
                  <span>{{ item.photoCount }} photos</span>
                  <span class="text-success font-semibold">${{ item.price }}</span>
                </div>
              </div>
              <button 
                @click="removeFromCart(index)" 
                class="bg-danger text-white border-none w-7 h-7 rounded-full cursor-pointer p-0 ml-2 hover:bg-danger-hover transition-colors duration-200"
              >
                ✕
              </button>
            </div>
          </div>

          <!-- Totals -->
          <div class="border-t-2 border-primary pt-4 mb-4">
            <div class="flex justify-between py-2 text-lg">
              <span>Total Photos:</span>
              <span>{{ totalPhotoCount }}</span>
            </div>
            <div class="flex justify-between py-2 text-xl font-bold text-success">
              <span>Total Price:</span>
              <span>${{ totalPrice }}</span>
            </div>
          </div>

          <button 
            @click="clearCart" 
            class="w-full bg-danger text-white border-none py-3 font-semibold rounded-lg transition-colors duration-200 hover:bg-danger-hover"
          >
            Clear Cart
          </button>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import productsData from './assets/products.json'

// State
const products = ref(productsData)
const cart = ref([])
const selectedCategory = ref('')

// Computed properties
const categories = computed(() => {
  const uniqueCategories = [...new Set(products.value.map(p => p.category))]
  return uniqueCategories.sort()
})

const filteredProducts = computed(() => {
  if (!selectedCategory.value) {
    return products.value
  }
  return products.value.filter(p => p.category === selectedCategory.value)
})

const totalPrice = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.price, 0)
})

const totalPhotoCount = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.photoCount, 0)
})

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
