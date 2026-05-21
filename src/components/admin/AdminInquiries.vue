<template>
  <div class="tab-content">
    <h2 class="section-title">{{ t('admin.inquiries.manageInquiries') }}</h2>

    <div class="section-card">
      <div v-if="loading" class="loading-state">
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
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import api from '../../utils/api'

const { t } = useI18n()

defineProps({
  inquiries: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['refresh'])

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
  if (!confirm(t('admin.inquiries.deleteConfirm', { name: inquiry.name }))) {
    return
  }

  try {
    await api.delete(`/inquiries/${inquiry.id}`)
    emit('refresh')
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
</script>

<style scoped>
.tab-content {
  width: 100%;
  max-width: 100%;
}

.section-title {
  margin: 0 0 1.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.status-select {
  padding: 0.375rem 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  cursor: pointer;
}

.message-preview {
  display: inline-block;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>