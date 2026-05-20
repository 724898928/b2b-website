<template>
  <div>
    <!-- Admin Header -->
    <section class="hero" style="padding: 2rem;">
      <div class="container">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Manage products and website settings</p>
          </div>
          <button @click="handleLogout" class="btn btn-secondary">Logout</button>
        </div>
      </div>
    </section>

    <!-- Tabs -->
    <section class="container" style="margin-top: 2rem;">
      <div style="background: white; padding: 1rem; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 2rem;">
        <div style="display: flex; gap: 1rem;">
          <button 
            @click="activeTab = 'products'" 
            :class="['btn', activeTab === 'products' ? 'btn-primary' : 'btn-secondary']"
          >
            Products
          </button>
          <button 
            @click="activeTab = 'settings'" 
            :class="['btn', activeTab === 'settings' ? 'btn-primary' : 'btn-secondary']"
          >
            Settings
          </button>
        </div>
      </div>

      <!-- Products Tab -->
      <div v-if="activeTab === 'products'">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
          <h2>Products Management</h2>
          <button @click="showProductModal = true; editingProduct = null" class="btn btn-primary">
            Add New Product
          </button>
        </div>

        <div v-if="productStore.isLoading" class="spinner"></div>
        
        <div v-else style="background: white; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead style="background: var(--bg-light);">
              <tr>
                <th style="padding: 1rem; text-align: left; border-bottom: 2px solid var(--border-color);">Image</th>
                <th style="padding: 1rem; text-align: left; border-bottom: 2px solid var(--border-color);">Name</th>
                <th style="padding: 1rem; text-align: left; border-bottom: 2px solid var(--border-color);">Category</th>
                <th style="padding: 1rem; text-align: center; border-bottom: 2px solid var(--border-color);">Featured</th>
                <th style="padding: 1rem; text-align: center; border-bottom: 2px solid var(--border-color);">Active</th>
                <th style="padding: 1rem; text-align: center; border-bottom: 2px solid var(--border-color);">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in productStore.products" :key="product.id" style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 1rem;">
                  <img 
                    :src="product.image_url || '/images/placeholder.jpg'" 
                    :alt="product.name"
                    style="width: 50px; height: 50px; object-fit: cover; border-radius: 0.25rem;"
                  >
                </td>
                <td style="padding: 1rem;">{{ product.name }}</td>
                <td style="padding: 1rem;">{{ product.category || '-' }}</td>
                <td style="padding: 1rem; text-align: center;">
                  <span :style="{ color: product.is_featured ? '#10b981' : '#6b7280' }">
                    {{ product.is_featured ? '✓' : '✗' }}
                  </span>
                </td>
                <td style="padding: 1rem; text-align: center;">
                  <span :style="{ color: product.is_active ? '#10b981' : '#ef4444' }">
                    {{ product.is_active ? '✓' : '✗' }}
                  </span>
                </td>
                <td style="padding: 1rem; text-align: center;">
                  <button @click="editProduct(product)" class="btn btn-primary" style="margin-right: 0.5rem; padding: 0.5rem 1rem;">
                    Edit
                  </button>
                  <button @click="deleteProductConfirm(product)" class="btn btn-secondary" style="padding: 0.5rem 1rem;">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          
          <div v-if="productStore.products.length === 0" style="padding: 3rem; text-align: center;">
            <p style="color: var(--text-light);">No products found.</p>
          </div>
        </div>
      </div>

      <!-- Settings Tab -->
      <div v-if="activeTab === 'settings'">
        <h2 style="margin-bottom: 2rem;">Website Settings</h2>
        
        <div style="background: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); max-width: 800px;">
          <form @submit.prevent="saveSettings">
            <div class="form-group">
              <label class="form-label">Site Name</label>
              <input v-model="settingsForm.site_name" type="text" class="form-input" required>
            </div>
            
            <div class="form-group">
              <label class="form-label">Site Description</label>
              <textarea v-model="settingsForm.site_description" class="form-textarea" rows="3"></textarea>
            </div>
            
            <div class="form-group">
              <label class="form-label">Company Introduction</label>
              <textarea v-model="settingsForm.company_intro" class="form-textarea" rows="5"></textarea>
            </div>
            
            <div class="form-group">
              <label class="form-label">Email</label>
              <input v-model="settingsForm.email" type="email" class="form-input" required>
            </div>
            
            <div class="form-group">
              <label class="form-label">Phone</label>
              <input v-model="settingsForm.phone" type="tel" class="form-input">
            </div>
            
            <div class="form-group">
              <label class="form-label">Address</label>
              <textarea v-model="settingsForm.address" class="form-textarea" rows="2"></textarea>
            </div>
            
            <div class="form-group">
              <label class="form-label">LinkedIn URL</label>
              <input v-model="settingsForm.linkedin" type="url" class="form-input" placeholder="https://linkedin.com/company/...">
            </div>
            
            <div class="form-group">
              <label class="form-label">Facebook URL</label>
              <input v-model="settingsForm.facebook" type="url" class="form-input" placeholder="https://facebook.com/...">
            </div>
            
            <div class="form-group">
              <label class="form-label">Twitter URL</label>
              <input v-model="settingsForm.twitter" type="url" class="form-input" placeholder="https://twitter.com/...">
            </div>
            
            <button type="submit" class="btn btn-primary" :disabled="isSavingSettings">
              {{ isSavingSettings ? 'Saving...' : 'Save Settings' }}
            </button>
            
            <div v-if="settingsStatus" :class="['notification', settingsStatus.type]" style="margin-top: 1rem;">
              {{ settingsStatus.message }}
            </div>
          </form>
        </div>
      </div>
    </section>

    <!-- Product Modal -->
    <div v-if="showProductModal" class="modal-overlay" @click.self="closeProductModal">
      <div class="modal-content">
        <h2 style="margin-bottom: 1.5rem;">{{ editingProduct ? 'Edit Product' : 'Add New Product' }}</h2>
        
        <form @submit.prevent="saveProduct">
          <div class="form-group">
            <label class="form-label">Product Name *</label>
            <input v-model="productForm.name" type="text" class="form-input" required>
          </div>
          
          <div class="form-group">
            <label class="form-label">Category</label>
            <input v-model="productForm.category" type="text" class="form-input" placeholder="e.g., Electronics, Machinery">
          </div>
          
          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea v-model="productForm.description" class="form-textarea" rows="3"></textarea>
          </div>
          
          <div class="form-group">
            <label class="form-label">Detailed Description (HTML)</label>
            <textarea v-model="productForm.detailed_description" class="form-textarea" rows="5"></textarea>
          </div>
          
          <div class="form-group">
            <label class="form-label">Specifications (HTML)</label>
            <textarea v-model="productForm.specifications" class="form-textarea" rows="5"></textarea>
          </div>
          
          <div class="form-group">
            <label class="form-label">Image URL</label>
            <input v-model="productForm.image_url" type="url" class="form-input" placeholder="https://example.com/image.jpg">
          </div>
          
          <div class="form-group">
            <label class="form-label">Gallery Images (JSON array of URLs)</label>
            <textarea v-model="galleryImagesText" class="form-textarea" rows="3" placeholder='["url1", "url2"]'></textarea>
          </div>
          
          <div class="form-group" style="display: flex; gap: 2rem;">
            <label style="display: flex; align-items: center; cursor: pointer;">
              <input v-model="productForm.is_featured" type="checkbox" style="margin-right: 0.5rem;">
              Featured Product
            </label>
            <label style="display: flex; align-items: center; cursor: pointer;">
              <input v-model="productForm.is_active" type="checkbox" style="margin-right: 0.5rem;">
              Active
            </label>
          </div>
          
          <div style="display: flex; gap: 1rem; justify-content: flex-end;">
            <button type="button" @click="closeProductModal" class="btn btn-secondary">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="isSavingProduct">
              {{ isSavingProduct ? 'Saving...' : 'Save Product' }}
            </button>
          </div>
          
          <div v-if="productStatus" :class="['notification', productStatus.type]" style="margin-top: 1rem;">
            {{ productStatus.message }}
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '../stores/products'
import { useSettingsStore } from '../stores/settings'

const router = useRouter()
const productStore = useProductStore()
const settingsStore = useSettingsStore()

const activeTab = ref('products')
const showProductModal = ref(false)
const editingProduct = ref(null)
const isSavingProduct = ref(false)
const isSavingSettings = ref(false)
const productStatus = ref(null)
const settingsStatus = ref(null)

const productForm = reactive({
  name: '',
  category: '',
  description: '',
  detailed_description: '',
  specifications: '',
  image_url: '',
  gallery_images: [],
  is_featured: false,
  is_active: true
})

const galleryImagesText = ref('')

const settingsForm = reactive({
  site_name: '',
  site_description: '',
  company_intro: '',
  email: '',
  phone: '',
  address: '',
  linkedin: '',
  facebook: '',
  twitter: ''
})

const handleLogout = () => {
  localStorage.removeItem('admin_token')
  router.push('/admin')
}

const editProduct = (product) => {
  editingProduct.value = product
  Object.assign(productForm, {
    name: product.name,
    category: product.category || '',
    description: product.description || '',
    detailed_description: product.detailed_description || '',
    specifications: product.specifications || '',
    image_url: product.image_url || '',
    gallery_images: product.gallery_images || [],
    is_featured: !!product.is_featured,
    is_active: !!product.is_active
  })
  
  try {
    galleryImagesText.value = typeof product.gallery_images === 'string'
      ? product.gallery_images
      : JSON.stringify(product.gallery_images || [])
  } catch {
    galleryImagesText.value = '[]'
  }
  
  showProductModal.value = true
}

const closeProductModal = () => {
  showProductModal.value = false
  editingProduct.value = null
  productStatus.value = null
  
  // Reset form
  Object.assign(productForm, {
    name: '',
    category: '',
    description: '',
    detailed_description: '',
    specifications: '',
    image_url: '',
    gallery_images: [],
    is_featured: false,
    is_active: true
  })
  galleryImagesText.value = ''
}

const saveProduct = async () => {
  isSavingProduct.value = true
  productStatus.value = null
  
  try {
    // Parse gallery images
    try {
      productForm.gallery_images = galleryImagesText.value.trim()
        ? JSON.parse(galleryImagesText.value)
        : []
    } catch {
      productStatus.value = {
        type: 'error',
        message: 'Invalid gallery images format. Please use a valid JSON array.'
      }
      isSavingProduct.value = false
      return
    }
    
    if (editingProduct.value) {
      await productStore.updateProduct(editingProduct.value.id, productForm)
      productStatus.value = {
        type: 'success',
        message: 'Product updated successfully!'
      }
    } else {
      await productStore.createProduct(productForm)
      productStatus.value = {
        type: 'success',
        message: 'Product created successfully!'
      }
    }
    
    setTimeout(() => {
      closeProductModal()
    }, 1500)
  } catch (error) {
    console.error('Error saving product:', error)
    productStatus.value = {
      type: 'error',
      message: 'Failed to save product. Please try again.'
    }
  } finally {
    isSavingProduct.value = false
  }
}

const deleteProductConfirm = async (product) => {
  if (!confirm(`Are you sure you want to delete "${product.name}"?`)) {
    return
  }
  
  try {
    await productStore.deleteProduct(product.id)
    alert('Product deleted successfully!')
  } catch (error) {
    console.error('Error deleting product:', error)
    alert('Failed to delete product. Please try again.')
  }
}

const saveSettings = async () => {
  isSavingSettings.value = true
  settingsStatus.value = null
  
  try {
    await settingsStore.updateSettings(settingsForm)
    settingsStatus.value = {
      type: 'success',
      message: 'Settings saved successfully!'
    }
    
    setTimeout(() => {
      settingsStatus.value = null
    }, 3000)
  } catch (error) {
    console.error('Error saving settings:', error)
    settingsStatus.value = {
      type: 'error',
      message: 'Failed to save settings. Please try again.'
    }
  } finally {
    isSavingSettings.value = false
  }
}

onMounted(async () => {
  await productStore.loadAllProducts()
  
  // Load settings into form
  Object.assign(settingsForm, settingsStore.settings)
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 2rem;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.notification {
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: center;
}

.notification.success {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #10b981;
}

.notification.error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #ef4444;
}

@media (max-width: 768px) {
  table {
    font-size: 0.875rem;
  }
  
  th, td {
    padding: 0.5rem !important;
  }
}
</style>
