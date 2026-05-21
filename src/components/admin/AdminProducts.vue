<template>
  <div class="tab-content">
    <div class="section-header">
      <h2 class="section-title">{{ t('admin.products.manageProducts') }}</h2>
      <button @click="openAddModal" class="btn btn-primary">{{ t('admin.products.addProduct') }}</button>
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
                  <button @click="openEditModal(product)" class="btn btn-small btn-primary">{{ t('admin.products.edit') }}</button>
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

    <!-- Product Modal -->
    <AdminProductModal
      v-model="showModal"
      :product="selectedProduct"
      @saved="onProductSaved"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useProductStore } from '../../stores/products'
import AdminProductModal from './AdminProductModal.vue'

const { t } = useI18n()
const productStore = useProductStore()

const showModal = ref(false)
const selectedProduct = ref(null)

const openAddModal = () => {
  selectedProduct.value = null
  showModal.value = true
}

const openEditModal = (product) => {
  selectedProduct.value = product
  showModal.value = true
}

const onProductSaved = () => {
  // Modal handles save, we just need to refresh if needed
}

const deleteProductConfirm = async (product) => {
  if (!confirm(t('admin.products.deleteConfirm', { name: product.name }))) {
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
</script>

<style scoped>
.tab-content {
  width: 100%;
  max-width: 100%;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

.featured-badge {
  color: #f59e0b;
  font-weight: 600;
}

.text-muted {
  color: #94a3b8;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}
</style>