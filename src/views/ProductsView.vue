<template>
  <div>
    <!-- Page Header -->
    <section class="hero" style="padding: 3rem 2rem;">
      <div class="container">
        <h1>Our Products</h1>
        <p>Explore our comprehensive range of high-quality products</p>
      </div>
    </section>

    <!-- Products Section -->
    <section class="container" style="margin-top: 2rem; margin-bottom: 3rem;">
      <!-- Filter Bar -->
      <div style="background: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 2rem;">
        <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
          <label style="font-weight: 500;">Category:</label>
          <select v-model="selectedCategory" class="form-input" style="max-width: 200px;">
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Search products..."
            class="form-input"
            style="flex: 1; min-width: 200px;"
            @keyup.enter="handleSearch"
          />
          <button @click="handleSearch" class="btn btn-primary">Search</button>
        </div>
      </div>

      <!-- Products Grid -->
      <div v-if="productStore.isLoading" class="spinner"></div>
      
      <div v-else-if="filteredProducts.length === 0" style="text-align: center; padding: 3rem;">
        <p style="color: var(--text-light); font-size: 1.2rem;">No products found matching your criteria.</p>
      </div>
      
      <div v-else class="grid grid-3">
        <ProductCard 
          v-for="product in filteredProducts" 
          :key="product.id" 
          :product="product"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProductStore } from '../stores/products'
import ProductCard from '../components/ProductCard.vue'

const productStore = useProductStore()
const selectedCategory = ref('')
const searchTerm = ref('')

const categories = computed(() => productStore.getCategories())
const filteredProducts = computed(() => 
  productStore.filterProducts(selectedCategory.value, searchTerm.value)
)

const handleSearch = () => {
  // Search is handled automatically by computed property
}

onMounted(async () => {
  try {
    await productStore.loadAllProducts()
  } catch (error) {
    console.error('Error loading products:', error)
  }
})
</script>
