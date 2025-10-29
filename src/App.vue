<template>
  <div class="app">
    <header>
      <h1>📸 Photo Studio Price Calculator</h1>
      <p>Select products to add to your cart</p>
    </header>

    <div class="main-content">
      <!-- Products Section -->
      <section class="products-section">
        <h2>Available Products</h2>
        
        <!-- Category Filter -->
        <div class="filter-section">
          <label for="category-filter">Filter by category:</label>
          <select id="category-filter" v-model="selectedCategory">
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>

        <!-- Products List -->
        <div class="products-grid">
          <div 
            v-for="product in filteredProducts" 
            :key="product.id" 
            class="product-card"
          >
            <div class="product-header">
              <span class="category-badge">{{ product.category }}</span>
            </div>
            <h3>{{ product.name }}</h3>
            <p class="description">{{ product.description }}</p>
            <div class="product-details">
              <div class="detail-item">
                <span class="label">Photos:</span>
                <span class="value">{{ product.photoCount }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Price:</span>
                <span class="value price">${{ product.price }}</span>
              </div>
              <div v-if="product.variation" class="detail-item variation">
                <span class="label">Variation:</span>
                <span class="value">{{ product.variation }}</span>
              </div>
            </div>
            <button @click="addToCart(product)" class="add-to-cart-btn">
              Add to Cart
            </button>
          </div>
        </div>
      </section>

      <!-- Cart Section -->
      <aside class="cart-section">
        <h2>🛒 Shopping Cart</h2>
        
        <div v-if="cart.length === 0" class="empty-cart">
          <p>Your cart is empty</p>
        </div>

        <div v-else>
          <div class="cart-items">
            <div 
              v-for="(item, index) in cart" 
              :key="index" 
              class="cart-item"
            >
              <div class="cart-item-info">
                <h4>{{ item.name }}</h4>
                <p class="cart-item-category">{{ item.category }}</p>
                <div class="cart-item-details">
                  <span>{{ item.photoCount }} photos</span>
                  <span class="cart-item-price">${{ item.price }}</span>
                </div>
              </div>
              <button @click="removeFromCart(index)" class="remove-btn">
                ✕
              </button>
            </div>
          </div>

          <!-- Totals -->
          <div class="cart-totals">
            <div class="total-row">
              <span class="total-label">Total Photos:</span>
              <span class="total-value">{{ totalPhotoCount }}</span>
            </div>
            <div class="total-row total-price-row">
              <span class="total-label">Total Price:</span>
              <span class="total-value">${{ totalPrice }}</span>
            </div>
          </div>

          <button @click="clearCart" class="clear-cart-btn">
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

<style scoped>
.app {
  min-height: 100vh;
}

header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #646cff;
}

header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #646cff;
}

header p {
  font-size: 1.1rem;
  opacity: 0.8;
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
}

@media (max-width: 1024px) {
  .main-content {
    grid-template-columns: 1fr;
  }
}

/* Products Section */
.products-section h2 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
}

.filter-section {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: rgba(100, 108, 255, 0.1);
  border-radius: 8px;
}

.filter-section label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.filter-section select {
  width: 100%;
  padding: 0.6rem;
  font-size: 1rem;
  border-radius: 6px;
  border: 1px solid #646cff;
  background-color: inherit;
  color: inherit;
  cursor: pointer;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.product-card {
  border: 1px solid rgba(100, 108, 255, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
  background: rgba(100, 108, 255, 0.05);
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(100, 108, 255, 0.2);
}

.product-header {
  margin-bottom: 1rem;
}

.category-badge {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  background-color: #646cff;
  color: white;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.product-card h3 {
  font-size: 1.3rem;
  margin-bottom: 0.8rem;
  color: #646cff;
}

.description {
  margin-bottom: 1rem;
  opacity: 0.8;
  line-height: 1.5;
}

.product-details {
  margin-bottom: 1rem;
  padding: 1rem;
  background: rgba(100, 108, 255, 0.1);
  border-radius: 8px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-item .label {
  font-weight: 600;
}

.detail-item .value {
  font-weight: 500;
}

.detail-item.variation {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(100, 108, 255, 0.2);
}

.price {
  color: #42b983;
  font-size: 1.1rem;
}

.add-to-cart-btn {
  width: 100%;
  background-color: #646cff;
  color: white;
  border: none;
  padding: 0.8rem;
  font-weight: 600;
}

.add-to-cart-btn:hover {
  background-color: #535bf2;
}

/* Cart Section */
.cart-section {
  position: sticky;
  top: 2rem;
  height: fit-content;
  border: 2px solid #646cff;
  border-radius: 12px;
  padding: 1.5rem;
  background: rgba(100, 108, 255, 0.05);
}

.cart-section h2 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

.empty-cart {
  text-align: center;
  padding: 2rem;
  opacity: 0.6;
}

.cart-items {
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 1.5rem;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem;
  margin-bottom: 1rem;
  background: rgba(100, 108, 255, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(100, 108, 255, 0.2);
}

.cart-item-info {
  flex: 1;
}

.cart-item-info h4 {
  font-size: 1rem;
  margin-bottom: 0.3rem;
}

.cart-item-category {
  font-size: 0.85rem;
  opacity: 0.7;
  margin-bottom: 0.5rem;
}

.cart-item-details {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
}

.cart-item-price {
  color: #42b983;
  font-weight: 600;
}

.remove-btn {
  background-color: #f44336;
  color: white;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  padding: 0;
  margin-left: 0.5rem;
}

.remove-btn:hover {
  background-color: #d32f2f;
}

.cart-totals {
  border-top: 2px solid #646cff;
  padding-top: 1rem;
  margin-bottom: 1rem;
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  font-size: 1.1rem;
}

.total-price-row {
  font-size: 1.3rem;
  font-weight: bold;
  color: #42b983;
}

.clear-cart-btn {
  width: 100%;
  background-color: #f44336;
  color: white;
  border: none;
  padding: 0.8rem;
  font-weight: 600;
}

.clear-cart-btn:hover {
  background-color: #d32f2f;
}
</style>
