<template>
  <div>
    <!-- Page Header -->
    <section class="hero" style="padding: 3rem 2rem;">
      <div class="container">
        <h1>{{ t('productDetail.title') }}</h1>
      </div>
    </section>

    <!-- Product Detail Section -->
    <section class="container" style="margin-top: 2rem; margin-bottom: 3rem;">
      <div v-if="productStore.isLoading" class="spinner"></div>
      
      <div v-else-if="!product" style="text-align: center; padding: 3rem;">
        <p style="color: var(--text-light); font-size: 1.2rem;">{{ t('products.noProducts') }}</p>
        <router-link to="/products" class="btn btn-primary" style="margin-top: 1rem;">{{ t('common.back') }}</router-link>
      </div>
      
      <div v-else style="background: white; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; padding: 2rem;">
          <!-- Product Image -->
          <div>
            <img 
              :src="product.image_url || '/images/placeholder.jpg'" 
              :alt="product.name"
              style="width: 100%; border-radius: 0.5rem;"
              @error="handleImageError"
            >
            
            <!-- Gallery Images -->
            <div v-if="galleryImages.length > 0" style="margin-top: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <img 
                v-for="(img, index) in galleryImages" 
                :key="index"
                :src="img"
                :alt="`Gallery ${index + 1}`"
                style="width: 80px; height: 80px; object-fit: cover; border-radius: 0.25rem; cursor: pointer;"
                @click="mainImage = img"
              >
            </div>
          </div>
          
          <!-- Product Info -->
          <div>
            <div v-if="product.category" style="margin-bottom: 1rem;">
              <span style="background: var(--primary-color); color: white; padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.85rem;">
                {{ product.category }}
              </span>
              <span v-if="product.is_featured" style="background: var(--accent-color); color: white; padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.85rem; margin-left: 0.5rem;">
                {{ t('admin.products.featured') }}
              </span>
            </div>
            
            <h1 style="font-size: 2rem; margin-bottom: 1rem; color: var(--text-dark);">{{ product.name }}</h1>
            
            <p style="color: var(--text-light); font-size: 1.1rem; line-height: 1.8; margin-bottom: 2rem;">
              {{ product.description || t('productDetail.noDescription') }}
            </p>
            
            <router-link to="/contact" class="btn btn-primary">{{ t('productDetail.inquireNow') }}</router-link>
          </div>
        </div>
        
        <!-- Detailed Description -->
        <div v-if="product.detailed_description" style="padding: 2rem; border-top: 1px solid var(--border-color);">
          <h2 style="font-size: 1.5rem; margin-bottom: 1rem; color: var(--primary-color);">{{ t('productDetail.description') }}</h2>
          <div style="line-height: 1.8; color: var(--text-light);" v-html="product.detailed_description"></div>
        </div>
        
        <!-- Specifications -->
        <div v-if="product.specifications" style="padding: 2rem; border-top: 1px solid var(--border-color);">
          <h2 style="font-size: 1.5rem; margin-bottom: 1rem; color: var(--primary-color);">{{ t('productDetail.specifications') }}</h2>
          <div style="line-height: 1.8; color: var(--text-light);" v-html="product.specifications"></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useProductStore } from '../stores/products'

const { t } = useI18n()
const route = useRoute()
const productStore = useProductStore()
const mainImage = ref('')

const product = computed(() => productStore.currentProduct)

const galleryImages = computed(() => {
  if (product.value && product.value.gallery_images) {
    try {
      return typeof product.value.gallery_images === 'string' 
        ? JSON.parse(product.value.gallery_images) 
        : product.value.gallery_images
    } catch {
      return []
    }
  }
  return []
})

const handleImageError = (e) => {
  e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found'
}

onMounted(async () => {
  const productId = route.params.id
  try {
    await productStore.loadProduct(productId)
    if (product.value) {
      mainImage.value = product.value.image_url
    }
  } catch (error) {
    console.error('Error loading product:', error)
  }
})
</script>

<style scoped>
@media (max-width: 768px) {
  div[style*="grid-template-columns: 1fr 1fr"] {
    grid-template-columns: 1fr !important;
  }
}
</style>
