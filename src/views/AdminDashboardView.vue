<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2 class="sidebar-logo">B2B Admin</h2>
      </div>
      <nav class="sidebar-nav">
        <div
          v-for="item in navItems"
          :key="item.id"
          :class="['nav-item', { active: activeTab === item.id }]"
          @click="handleNavClick(item)"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label">{{ navLabels[item.id] }}</span>
        </div>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Top Bar -->
      <header class="top-bar">
        <div class="top-bar-left">
          <h1 class="page-title">{{ t('admin.dashboard.title') }}</h1>
          <div class="user-info">
            <span class="welcome-text">{{ t('admin.dashboard.welcomeBack') }}, Admin</span>
            <span class="admin-badge">{{ t('admin.dashboard.superAdmin') }}</span>
          </div>
        </div>
        <div class="top-bar-right">
          <button @click="previewSite" class="btn btn-primary">{{ t('admin.dashboard.preview') }}</button>
          <button @click="handleLogout" class="btn btn-warning">{{ t('admin.dashboard.logout') }}</button>
        </div>
      </header>

      <!-- Content Area -->
      <main class="content-area">
        <!-- Overview Tab -->
        <div v-if="activeTab === 'overview'" class="tab-content">
          <!-- Stats Cards -->
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon"></div>
              <div class="stat-content">
                <h3 class="stat-label">{{ t('admin.overview.totalProducts') }}</h3>
                <p class="stat-value">{{ productStore.products.length }}</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">💬</div>
              <div class="stat-content">
                <h3 class="stat-label">{{ t('admin.overview.totalInquiries') }}</h3>
                <p class="stat-value">{{ inquiries.length }}</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">⏳</div>
              <div class="stat-content">
                <h3 class="stat-label">{{ t('admin.overview.pendingInquiries') }}</h3>
                <p class="stat-value">{{ pendingInquiriesCount }}</p>
              </div>
            </div>
          </div>

          <!-- Recent Inquiries -->
          <div class="section-card">
            <h2 class="section-title">{{ t('admin.overview.recentInquiries') }}</h2>
            <div class="table-container">
              <table v-if="recentInquiries.length > 0" class="data-table">
                <thead>
                  <tr>
                    <th>{{ t('admin.overview.name') }}</th>
                    <th>{{ t('admin.overview.email') }}</th>
                    <th>{{ t('admin.overview.product') }}</th>
                    <th>{{ t('admin.overview.status') }}</th>
                    <th>{{ t('admin.overview.date') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="inquiry in recentInquiries" :key="inquiry.id">
                    <td>{{ inquiry.name }}</td>
                    <td>{{ inquiry.email }}</td>
                    <td>{{ inquiry.product_name || '-' }}</td>
                    <td>
                      <span :class="['status-badge', `status-${inquiry.status}`]">
                        {{ inquiry.status }}
                      </span>
                    </td>
                    <td>{{ formatDate(inquiry.created_at) }}</td>
                  </tr>
                </tbody>
              </table>
              <div v-else class="empty-state">
                <p>{{ t('admin.overview.noRecentInquiries') }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Products Tab -->
        <div v-if="activeTab === 'products'" class="tab-content">
          <div class="section-header">
            <h2 class="section-title">{{ t('admin.products.manageProducts') }}</h2>
            <button @click="openProductModal()" class="btn btn-primary">{{ t('admin.products.addProduct') }}</button>
          </div>

          <div class="section-card">
            <div v-if="productStore.isLoading" class="loading-state">
              <div class="spinner"></div>
              <p>{{ t('common.loading') }}</p>
            </div>

            <div v-else class="table-container">
              <table v-if="productStore.products.length > 0" class="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>{{ t('admin.products.category') }}</th>
                    <th>{{ t('admin.products.featured') }}</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="product in productStore.products" :key="product.id">
                    <td>{{ product.id }}</td>
                    <td>{{ product.name }}</td>
                    <td>{{ product.category || '-' }}</td>
                    <td>
                      <span v-if="product.is_featured" class="featured-badge">⭐ {{ t('admin.products.yes') }}</span>
                      <span v-else class="text-muted">{{ t('admin.products.no') }}</span>
                    </td>
                    <td>
                      <span :class="['status-badge', product.is_active ? 'status-active' : 'status-inactive']">
                        {{ product.is_active ? t('status.active') : t('status.inactive') }}
                      </span>
                    </td>
                    <td>
                      <div class="action-buttons">
                        <button @click="editProduct(product)" class="btn btn-small btn-primary">{{ t('admin.products.edit') }}</button>
                        <button @click="deleteProductConfirm(product)" class="btn btn-small btn-danger">{{ t('admin.products.delete') }}</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-else class="empty-state">
                <p>{{ t('admin.products.noProducts') }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Inquiries Tab -->
        <div v-if="activeTab === 'inquiries'" class="tab-content">
          <h2 class="section-title">{{ t('admin.inquiries.manageInquiries') }}</h2>

          <div class="section-card">
            <div v-if="inquiriesLoading" class="loading-state">
              <div class="spinner"></div>
              <p>{{ t('common.loading') }}</p>
            </div>

            <div v-else class="table-container">
              <table v-if="inquiries.length > 0" class="data-table">
                <thead>
                  <tr>
                    <th>{{ t('admin.products.id') }}</th>
                    <th>{{ t('admin.inquiries.name') }}</th>
                    <th>{{ t('admin.inquiries.email') }}</th>
                    <th>{{ t('admin.inquiries.company') }}</th>
                    <th>{{ t('admin.inquiries.product') }}</th>
                    <th>{{ t('admin.inquiries.message') }}</th>
                    <th>{{ t('admin.inquiries.status') }}</th>
                    <th>{{ t('admin.inquiries.date') }}</th>
                    <th>{{ t('admin.inquiries.actions') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="inquiry in inquiries" :key="inquiry.id">
                    <td>{{ inquiry.id }}</td>
                    <td>{{ inquiry.name }}</td>
                    <td>{{ inquiry.email }}</td>
                    <td>{{ inquiry.company || '-' }}</td>
                    <td>{{ inquiry.product_name || '-' }}</td>
                    <td>
                      <span class="message-preview">{{ truncateMessage(inquiry.message) }}</span>
                    </td>
                    <td>
                      <select
                        v-model="inquiry.status"
                        @change="updateInquiryStatus(inquiry)"
                        class="status-select"
                      >
                        <option value="pending">{{ t('admin.inquiries.pending') }}</option>
                        <option value="processing">{{ t('admin.inquiries.processing') }}</option>
                        <option value="completed">{{ t('admin.inquiries.completed') }}</option>
                      </select>
                    </td>
                    <td>{{ formatDate(inquiry.created_at) }}</td>
                    <td>
                      <div class="action-buttons">
                        <button @click="viewInquiry(inquiry)" class="btn btn-small btn-primary">{{ t('admin.inquiries.view') }}</button>
                        <button @click="deleteInquiryConfirm(inquiry)" class="btn btn-small btn-danger">{{ t('admin.inquiries.delete') }}</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-else class="empty-state">
                <p>{{ t('admin.inquiries.noInquiries') }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Settings Tab -->
        <div v-if="activeTab === 'settings'" class="tab-content">
          <h2 class="section-title">{{ t('admin.settings.websiteSettings') }}</h2>

          <div class="settings-container">
            <!-- Basic Information -->
            <div class="settings-section">
              <h3 class="settings-section-title">{{ t('admin.settings.basicInfo') }}</h3>
              <div class="form-group">
                <label class="form-label">{{ t('admin.settings.websiteName') }}</label>
                <input v-model="settingsForm.site_name" type="text" class="form-input" required>
              </div>

              <div class="form-group">
                <label class="form-label">{{ t('admin.settings.websiteDescription') }}</label>
                <textarea v-model="settingsForm.site_description" class="form-textarea" rows="3"></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">{{ t('admin.settings.companyIntro') }}</label>
                <textarea v-model="settingsForm.company_intro" class="form-textarea" rows="5"></textarea>
              </div>
            </div>

            <!-- Contact Information -->
            <div class="settings-section">
              <h3 class="settings-section-title">{{ t('admin.settings.contactInfo') }}</h3>
              <div class="form-group">
                <label class="form-label">{{ t('admin.settings.email') }}</label>
                <input v-model="settingsForm.email" type="email" class="form-input" required>
              </div>

              <div class="form-group">
                <label class="form-label">{{ t('admin.settings.phone') }}</label>
                <input v-model="settingsForm.phone" type="tel" class="form-input">
              </div>

              <div class="form-group">
                <label class="form-label">{{ t('admin.settings.address') }}</label>
                <input v-model="settingsForm.address" type="text" class="form-input">
              </div>
            </div>

            <!-- Social Media Links -->
            <div class="settings-section">
              <h3 class="settings-section-title">{{ t('admin.settings.socialMedia') }}</h3>
              <div class="form-group">
                <label class="form-label">{{ t('admin.settings.linkedinUrl') }}</label>
                <input v-model="settingsForm.linkedin" type="url" class="form-input" placeholder="https://linkedin.com/company/yourcompany">
              </div>

              <div class="form-group">
                <label class="form-label">{{ t('admin.settings.facebookUrl') }}</label>
                <input v-model="settingsForm.facebook" type="url" class="form-input" placeholder="https://facebook.com/yourcompany">
              </div>

              <div class="form-group">
                <label class="form-label">{{ t('admin.settings.twitterUrl') }}</label>
                <input v-model="settingsForm.twitter" type="url" class="form-input" placeholder="https://twitter.com/yourcompany">
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="settings-actions">
              <button @click="saveSettings" class="btn btn-primary" :disabled="isSavingSettings">
                {{ isSavingSettings ? t('admin.settings.saving') : t('admin.settings.saveSettings') }}
              </button>
              <button @click="resetSettings" class="btn btn-warning">{{ t('admin.settings.reset') }}</button>
            </div>

            <div v-if="settingsStatus" :class="['notification', settingsStatus.type]">
              {{ settingsStatus.message }}
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Product Modal -->
    <div v-if="showProductModal" class="modal-overlay" @click.self="closeProductModal">
      <div class="modal-content">
        <h2 class="modal-title">{{ editingProduct ? t('admin.productForm.editTitle') : t('admin.productForm.addTitle') }}</h2>

        <form @submit.prevent="saveProduct">
          <div class="form-group">
            <label class="form-label">{{ t('admin.productForm.productName') }} *</label>
            <input v-model="productForm.name" type="text" class="form-input" required>
          </div>

          <div class="form-group">
            <label class="form-label">{{ t('admin.productForm.category') }}</label>
            <input v-model="productForm.category" type="text" class="form-input" :placeholder="t('admin.productForm.categoryPlaceholder')">
          </div>

          <div class="form-group">
            <label class="form-label">{{ t('admin.productForm.description') }}</label>
            <textarea v-model="productForm.description" class="form-textarea" rows="3"></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">{{ t('admin.productForm.detailedDescription') }}</label>
            <textarea v-model="productForm.detailed_description" class="form-textarea" rows="5"></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">{{ t('admin.productForm.specifications') }}</label>
            <textarea v-model="productForm.specifications" class="form-textarea" rows="5"></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">{{ t('admin.productForm.imageUrl') }}</label>
            <input v-model="productForm.image_url" type="url" class="form-input" :placeholder="t('admin.productForm.imageUrlPlaceholder')">
          </div>

          <div class="form-group">
            <label class="form-label">{{ t('admin.productForm.galleryImages') }}</label>
            <textarea v-model="galleryImagesText" class="form-textarea" rows="3" :placeholder="t('admin.productForm.galleryPlaceholder')"></textarea>
          </div>

          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input v-model="productForm.is_featured" type="checkbox">
              <span>{{ t('admin.productForm.featuredProduct') }}</span>
            </label>
            <label class="checkbox-label">
              <input v-model="productForm.is_active" type="checkbox">
              <span>{{ t('admin.productForm.active') }}</span>
            </label>
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeProductModal" class="btn btn-secondary">{{ t('admin.productForm.cancel') }}</button>
            <button type="submit" class="btn btn-primary" :disabled="isSavingProduct">
              {{ isSavingProduct ? t('admin.productForm.saving') : t('admin.productForm.save') }}
            </button>
          </div>

          <div v-if="productStatus" :class="['notification', productStatus.type]">
            {{ productStatus.message }}
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useProductStore } from '../stores/products'
import { useSettingsStore } from '../stores/settings'
import api from '../utils/api'

const { t } = useI18n()
const router = useRouter()
const productStore = useProductStore()
const settingsStore = useSettingsStore()

// Navigation
const activeTab = ref('overview')
const navItems = [
  { id: 'overview', key: 'admin.dashboard.nav.overview', icon: '📊' },
  { id: 'products', key: 'admin.dashboard.nav.products', icon: '📦' },
  { id: 'inquiries', key: 'admin.dashboard.nav.inquiries', icon: '💬' },
  { id: 'settings', key: 'admin.dashboard.nav.settings', icon: '⚙️' },
  { id: 'logout', key: 'admin.dashboard.nav.logout', icon: '🚪' }
]

// Computed nav labels
const navLabels = computed(() => {
  return {
    overview: t('admin.dashboard.nav.overview'),
    products: t('admin.dashboard.nav.products'),
    inquiries: t('admin.dashboard.nav.inquiries'),
    settings: t('admin.dashboard.nav.settings'),
    logout: t('admin.dashboard.nav.logout')
  }
})

// Inquiries
const inquiries = ref([])
const inquiriesLoading = ref(false)

// Product Modal
const showProductModal = ref(false)
const editingProduct = ref(null)
const isSavingProduct = ref(false)
const productStatus = ref(null)

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

// Settings
const isSavingSettings = ref(false)
const settingsStatus = ref(null)

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

// Computed
const recentInquiries = computed(() => {
  return inquiries.value.slice(0, 5)
})

const pendingInquiriesCount = computed(() => {
  return inquiries.value.filter(i => i.status === 'pending').length
})

// Methods
const handleNavClick = (item) => {
  if (item.id === 'logout') {
    handleLogout()
    return
  }
  activeTab.value = item.id
}

const handleLogout = () => {
  if (confirm(t('admin.dashboard.logoutConfirm'))) {
    localStorage.removeItem('admin_token')
    router.push('/admin')
  }
}

const previewSite = () => {
  window.open('/', '_blank')
}

const loadInquiries = async () => {
  inquiriesLoading.value = true
  try {
    const response = await api.get('/inquiries')
    if (response.data.success) {
      inquiries.value = response.data.data || []
    }
  } catch (error) {
    console.error('Error loading inquiries:', error)
  } finally {
    inquiriesLoading.value = false
  }
}

const updateInquiryStatus = async (inquiry) => {
  try {
    await api.put(`/inquiries/${inquiry.id}/status`, { status: inquiry.status })
  } catch (error) {
    console.error('Error updating inquiry status:', error)
    alert(t('admin.inquiries.updateError'))
  }
}

const viewInquiry = (inquiry) => {
  alert(`${t('admin.inquiries.inquiryFrom')} ${inquiry.name}:\n\n${inquiry.message}`)
}

const deleteInquiryConfirm = async (inquiry) => {
  if (!confirm(t('admin.inquiries.deleteConfirm', {name: inquiry.name}))) {
    return
  }

  try {
    await api.delete(`/inquiries/${inquiry.id}`)
    await loadInquiries()
    alert(t('admin.inquiries.deleteSuccess'))
  } catch (error) {
    console.error('Error deleting inquiry:', error)
    alert(t('admin.inquiries.deleteError'))
  }
}

const truncateMessage = (message) => {
  if (!message) return '-'
  return message.length > 50 ? message.substring(0, 50) + '...' : message
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const openProductModal = (product = null) => {
  if (product) {
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
  } else {
    editingProduct.value = null
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

  showProductModal.value = true
  productStatus.value = null
}

const closeProductModal = () => {
  showProductModal.value = false
  editingProduct.value = null
  productStatus.value = null
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

const editProduct = (product) => {
  openProductModal(product)
}

const saveProduct = async () => {
  isSavingProduct.value = true
  productStatus.value = null

  try {
    try {
      productForm.gallery_images = galleryImagesText.value.trim()
        ? JSON.parse(galleryImagesText.value)
        : []
    } catch {
      productStatus.value = {
        type: 'error',
        message: t('admin.productForm.invalidGalleryFormat')
      }
      isSavingProduct.value = false
      return
    }

    if (editingProduct.value) {
      await productStore.updateProduct(editingProduct.value.id, productForm)
      productStatus.value = {
        type: 'success',
        message: t('admin.productForm.success')
      }
    } else {
      await productStore.createProduct(productForm)
      productStatus.value = {
        type: 'success',
        message: t('admin.productForm.success')
      }
    }

    setTimeout(() => {
      closeProductModal()
    }, 1500)
  } catch (error) {
    console.error('Error saving product:', error)
    productStatus.value = {
      type: 'error',
      message: t('admin.productForm.error')
    }
  } finally {
    isSavingProduct.value = false
  }
}

const deleteProductConfirm = async (product) => {
  if (!confirm(t('admin.products.deleteConfirm', {name: product.name}))) {
    return
  }

  try {
    await productStore.deleteProduct(product.id)
    alert(t('admin.products.deleteSuccess'))
  } catch (error) {
    console.error('Error deleting product:', error)
    alert(t('admin.products.deleteError'))
  }
}

const saveSettings = async () => {
  isSavingSettings.value = true
  settingsStatus.value = null

  try {
    await settingsStore.updateSettings(settingsForm)
    settingsStatus.value = {
      type: 'success',
      message: t('admin.settings.saveSuccess')
    }

    setTimeout(() => {
      settingsStatus.value = null
    }, 3000)
  } catch (error) {
    console.error('Error saving settings:', error)
    settingsStatus.value = {
      type: 'error',
      message: t('admin.settings.saveError')
    }
  } finally {
    isSavingSettings.value = false
  }
}

const resetSettings = () => {
  Object.assign(settingsForm, settingsStore.settings)
  settingsStatus.value = {
    type: 'success',
    message: t('admin.settings.resetSuccess')
  }
  setTimeout(() => {
    settingsStatus.value = null
  }, 2000)
}

onMounted(async () => {
  await productStore.loadAllProducts()
  await loadInquiries()
  Object.assign(settingsForm, settingsStore.settings)
})
</script>

<style scoped>
/* Layout */
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f8f9fa;
}

/* Sidebar */
.sidebar {
  width: 240px;
  background: #1e293b;
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  z-index: 100;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-logo {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #f59e0b;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.875rem 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
  color: #94a3b8;
  gap: 0.75rem;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: white;
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-left: 3px solid #3b82f6;
}

.nav-icon {
  font-size: 1.125rem;
}

.nav-label {
  font-size: 0.875rem;
  font-weight: 500;
}

/* Main Content */
.main-content {
  flex: 1;
  margin-left: 240px;
  display: flex;
  flex-direction: column;
}

/* Top Bar */
.top-bar {
  background: white;
  padding: 1.5rem 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 50;
}

.top-bar-left {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.page-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.welcome-text {
  font-size: 0.875rem;
  color: #64748b;
}

.admin-badge {
  background: #3b82f6;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.top-bar-right {
  display: flex;
  gap: 0.75rem;
}

/* Content Area */
.content-area {
  padding: 2rem;
  flex: 1;
  min-width: 0;
}

.tab-content {
  width: 100%;
  max-width: 100%;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  width: 100%;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 0;
}

.stat-icon {
  font-size: 2.5rem;
}

.stat-content {
  flex: 1;
}

.stat-label {
  margin: 0 0 0.5rem;
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.stat-value {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: #3b82f6;
}

/* Section */
.section-card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  margin: 0 0 1.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

/* Table */
.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead {
  background: #f8f9fa;
}

.data-table th {
  padding: 1rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  border-bottom: 2px solid #e2e8f0;
}

.data-table td {
  padding: 1rem;
  font-size: 0.875rem;
  color: #475569;
  border-bottom: 1px solid #e2e8f0;
}

.data-table tbody tr:hover {
  background: #f8f9fa;
}

/* Status Badges */
.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-active, .status-completed {
  background: #d1fae5;
  color: #065f46;
}

.status-inactive, .status-inactive {
  background: #fef3c7;
  color: #92400e;
}

.status-pending {
  background: #dbeafe;
  color: #1e40af;
}

.status-processing {
  background: #fef3c7;
  color: #92400e;
}

.featured-badge {
  color: #f59e0b;
  font-weight: 600;
}

/* Buttons */
.btn {
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background: #4b5563;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
}

.btn-warning {
  background: #f59e0b;
  color: white;
}

.btn-warning:hover {
  background: #d97706;
}

.btn-small {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

/* Status Select */
.status-select {
  padding: 0.375rem 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  cursor: pointer;
}

/* Empty State */
.empty-state {
  padding: 3rem;
  text-align: center;
  color: #64748b;
}

/* Loading State */
.loading-state {
  padding: 3rem;
  text-align: center;
  color: #64748b;
}

.spinner {
  display: inline-block;
  width: 2rem;
  height: 2rem;
  border: 3px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Settings */
.settings-container {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 100%;
}

.settings-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.settings-section:last-of-type {
  border-bottom: none;
}

.settings-section-title {
  margin: 0 0 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #3b82f6;
}

.settings-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;
}

/* Form */
.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #1e293b;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.625rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
}

.form-textarea {
  resize: vertical;
  font-family: inherit;
}

.checkbox-group {
  display: flex;
  gap: 2rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: #1e293b;
}

.checkbox-label input[type="checkbox"] {
  width: 1rem;
  height: 1rem;
  cursor: pointer;
}

/* Modal */
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
  z-index: 1000;
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

.modal-title {
  margin: 0 0 1.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

/* Notification */
.notification {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 0.375rem;
  text-align: center;
  font-size: 0.875rem;
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

.message-preview {
  display: inline-block;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    width: 200px;
  }

  .main-content {
    margin-left: 200px;
  }

  .top-bar {
    padding: 1rem;
  }

  .content-area {
    padding: 1rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .data-table {
    font-size: 0.75rem;
  }

  .data-table th,
  .data-table td {
    padding: 0.5rem;
  }
}

/* 宽屏幕优化 */
@media (min-width: 1920px) {
  .content-area {
    padding: 2.5rem 3rem;
  }

  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }

  .stat-card {
    padding: 2rem;
  }

  .section-card {
    padding: 2rem;
  }
}
</style>
