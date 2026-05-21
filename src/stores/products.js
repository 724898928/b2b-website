import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../utils/api'

export const useProductStore = defineStore('products', () => {
  const products = ref([])
  const featuredProducts = ref([])
  const currentProduct = ref(null)
  const isLoading = ref(false)

  async function loadAllProducts() {
    isLoading.value = true
    try {
      const response = await api.get('/products')
      if (response.data.success) {
        products.value = response.data.data || []
      }
    } catch (error) {
      console.error('Error loading products:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function loadFeaturedProducts() {
    try {
      const response = await api.get('/products/featured')
      if (response.data.success) {
        featuredProducts.value = response.data.data || []
      }
    } catch (error) {
      console.warn('Featured products API unavailable, using empty list:', error.message)
      // 即使 API 失败，也不抛出异常，让页面继续显示
      featuredProducts.value = []
    }
  }

  async function loadProduct(id) {
    isLoading.value = true
    try {
      const response = await api.get(`/products/${id}`)
      if (response.data.success) {
        currentProduct.value = response.data.data
        return response.data.data
      }
    } catch (error) {
      console.error('Error loading product:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function createProduct(productData) {
    try {
      const response = await api.post('/products', productData)
      if (response.data.success) {
        await loadAllProducts()
        return response.data
      }
    } catch (error) {
      console.error('Error creating product:', error)
      throw error
    }
  }

  async function updateProduct(id, productData) {
    try {
      const response = await api.put(`/products/${id}`, productData)
      if (response.data.success) {
        await loadAllProducts()
        return response.data
      }
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    }
  }

  async function deleteProduct(id) {
    try {
      const response = await api.delete(`/products/${id}`)
      if (response.data.success) {
        await loadAllProducts()
        return response.data
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      throw error
    }
  }

  function getCategories() {
    const categories = [...new Set(products.value.map(p => p.category).filter(c => c))]
    return categories
  }

  function filterProducts(category, searchTerm) {
    return products.value.filter(product => {
      const matchesCategory = !category || product.category === category
      const matchesSearch = !searchTerm ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      return matchesCategory && matchesSearch
    })
  }

  return {
    products,
    featuredProducts,
    currentProduct,
    isLoading,
    loadAllProducts,
    loadFeaturedProducts,
    loadProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getCategories,
    filterProducts
  }
})
