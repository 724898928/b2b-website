<template>
  <div class="admin-layout admin-app">
    <!-- Sidebar -->
    <AdminSidebar
      :nav-items="navItems"
      :active-tab="activeTab"
      :collapsed="sidebarCollapsed"
      @navigate="handleNavClick"
      @toggle-collapse="toggleSidebar"
    />

    <!-- Main Content -->
    <div class="main-content" :style="{ marginLeft: sidebarCollapsed ? '64px' : '240px' }">
      <!-- Top Bar -->
      <AdminTopBar
        @preview="previewSite"
        @logout="handleLogout"
      />

      <!-- Content Area -->
      <main class="content-area">
        <AdminOverview
          v-if="activeTab === 'overview'"
          :products="productStore.products"
          :inquiries="inquiries"
        />

        <AdminProducts
          v-if="activeTab === 'products'"
        />

        <AdminInquiries
          v-if="activeTab === 'inquiries'"
          :inquiries="inquiries"
          :loading="inquiriesLoading"
          @refresh="loadInquiries"
        />

        <AdminSettings
          v-if="activeTab === 'settings'"
        />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useProductStore } from '../stores/products'
import api from '../utils/api'
import AdminSidebar from '../components/admin/AdminSidebar.vue'
import AdminTopBar from '../components/admin/AdminTopBar.vue'
import AdminOverview from '../components/admin/AdminOverview.vue'
import AdminProducts from '../components/admin/AdminProducts.vue'
import AdminInquiries from '../components/admin/AdminInquiries.vue'
import AdminSettings from '../components/admin/AdminSettings.vue'

const { t } = useI18n()
const router = useRouter()
const productStore = useProductStore()

// Navigation
const activeTab = ref('overview')
const sidebarCollapsed = ref(false)
const navItems = [
  { id: 'overview', key: 'admin.dashboard.nav.overview', icon: '📊' },
  { id: 'products', key: 'admin.dashboard.nav.products', icon: '📦' },
  { id: 'inquiries', key: 'admin.dashboard.nav.inquiries', icon: '💬' },
  { id: 'settings', key: 'admin.dashboard.nav.settings', icon: '⚙️' },
  { id: 'logout', key: 'admin.dashboard.nav.logout', icon: '🚪' }
]

// Shared inquiries data
const inquiries = ref([])
const inquiriesLoading = ref(false)

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

// Navigation handler
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

onMounted(async () => {
  await productStore.loadAllProducts()
  await loadInquiries()
})
</script>

<style scoped>
/* Layout */
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f8f9fa;
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s ease;
}

/* Content Area */
.content-area {
  padding: 2rem;
  flex: 1;
  min-width: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .content-area {
    padding: 1rem;
  }
}

@media (min-width: 1920px) {
  .content-area {
    padding: 2.5rem 3rem;
  }
}
</style>

