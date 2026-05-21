<template>
  <div class="tab-content">
    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">📦</div>
        <div class="stat-content">
          <h3 class="stat-label">{{ t('admin.overview.totalProducts') }}</h3>
          <p class="stat-value">{{ products.length }}</p>
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
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  products: {
    type: Array,
    default: () => []
  },
  inquiries: {
    type: Array,
    default: () => []
  }
})

const recentInquiries = computed(() => {
  return props.inquiries.slice(0, 5)
})

const pendingInquiriesCount = computed(() => {
  return props.inquiries.filter(i => i.status === 'pending').length
})

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

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 1920px) {
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }

  .stat-card {
    padding: 2rem;
  }
}
</style>