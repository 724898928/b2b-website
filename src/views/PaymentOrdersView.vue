<template>
  <div class="container" style="margin-top: 2rem; margin-bottom: 3rem;">
    <h1 style="margin-bottom: 2rem;">支付订单管理</h1>

    <!-- Filters -->
    <div style="background: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 2rem;">
      <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
        <select v-model="filterStatus" class="form-input" style="max-width: 200px;">
          <option value="">全部状态</option>
          <option value="pending">待支付</option>
          <option value="completed">已支付</option>
          <option value="failed">支付失败</option>
          <option value="refunded">已退款</option>
        </select>
        
        <select v-model="filterMethod" class="form-input" style="max-width: 200px;">
          <option value="">全部支付方式</option>
          <option value="wechat">微信支付</option>
          <option value="alipay">支付宝</option>
          <option value="paypal">PayPal</option>
        </select>
        
        <button @click="loadOrders" class="btn btn-primary">刷新</button>
      </div>
    </div>

    <!-- Orders Table -->
    <div v-if="isLoading" class="spinner"></div>
    
    <div v-else style="background: white; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden;">
      <table style="width: 100%; border-collapse: collapse;">
        <thead style="background: var(--bg-light);">
          <tr>
            <th style="padding: 1rem; text-align: left; border-bottom: 2px solid var(--border-color);">订单号</th>
            <th style="padding: 1rem; text-align: left; border-bottom: 2px solid var(--border-color);">支付方式</th>
            <th style="padding: 1rem; text-align: right; border-bottom: 2px solid var(--border-color);">金额</th>
            <th style="padding: 1rem; text-align: center; border-bottom: 2px solid var(--border-color);">状态</th>
            <th style="padding: 1rem; text-align: left; border-bottom: 2px solid var(--border-color);">创建时间</th>
            <th style="padding: 1rem; text-align: center; border-bottom: 2px solid var(--border-color);">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id" style="border-bottom: 1px solid var(--border-color);">
            <td style="padding: 1rem; font-family: monospace;">{{ order.order_no }}</td>
            <td style="padding: 1rem;">
              <span :class="['badge', `badge-${order.payment_method}`]">
                {{ formatPaymentMethod(order.payment_method) }}
              </span>
            </td>
            <td style="padding: 1rem; text-align: right; font-weight: 600;">
              {{ order.currency }} {{ order.amount.toFixed(2) }}
            </td>
            <td style="padding: 1rem; text-align: center;">
              <span 
                :style="{ 
                  color: getPaymentStatusColor(order.status),
                  fontWeight: 600
                }"
              >
                {{ formatPaymentStatus(order.status) }}
              </span>
            </td>
            <td style="padding: 1rem; color: var(--text-light);">
              {{ new Date(order.created_at).toLocaleString('zh-CN') }}
            </td>
            <td style="padding: 1rem; text-align: center;">
              <button 
                @click="viewOrderDetail(order)" 
                class="btn btn-primary" 
                style="padding: 0.5rem 1rem;"
              >
                查看详情
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="orders.length === 0" style="padding: 3rem; text-align: center;">
        <p style="color: var(--text-light);">暂无支付订单</p>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.pages > 1" style="margin-top: 2rem; display: flex; justify-content: center; gap: 0.5rem;">
      <button 
        v-for="page in pagination.pages" 
        :key="page"
        @click="changePage(page)"
        :class="['btn', currentPage === page ? 'btn-primary' : 'btn-secondary']"
        style="min-width: 40px;"
      >
        {{ page }}
      </button>
    </div>

    <!-- Order Detail Modal -->
    <div v-if="showDetailModal && selectedOrder" class="modal-overlay" @click.self="closeDetailModal">
      <div class="modal-content" style="max-width: 600px;">
        <h2 style="margin-bottom: 1.5rem;">订单详情</h2>
        
        <div style="line-height: 2;">
          <p><strong>订单号:</strong> {{ selectedOrder.order_no }}</p>
          <p><strong>支付方式:</strong> {{ formatPaymentMethod(selectedOrder.payment_method) }}</p>
          <p><strong>金额:</strong> {{ selectedOrder.currency }} {{ selectedOrder.amount.toFixed(2) }}</p>
          <p><strong>状态:</strong> 
            <span :style="{ color: getPaymentStatusColor(selectedOrder.status) }">
              {{ formatPaymentStatus(selectedOrder.status) }}
            </span>
          </p>
          <p><strong>描述:</strong> {{ selectedOrder.description }}</p>
          <p v-if="selectedOrder.transaction_id"><strong>交易ID:</strong> {{ selectedOrder.transaction_id }}</p>
          <p><strong>创建时间:</strong> {{ new Date(selectedOrder.created_at).toLocaleString('zh-CN') }}</p>
          <p v-if="selectedOrder.paid_at"><strong>支付时间:</strong> {{ new Date(selectedOrder.paid_at).toLocaleString('zh-CN') }}</p>
        </div>
        
        <div style="margin-top: 2rem; display: flex; justify-content: flex-end;">
          <button @click="closeDetailModal" class="btn btn-secondary">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getPaymentOrders, formatPaymentMethod, formatPaymentStatus, getPaymentStatusColor } from '../utils/payment'

const isLoading = ref(false)
const orders = ref([])
const currentPage = ref(1)
const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0,
  pages: 0
})

const filterStatus = ref('')
const filterMethod = ref('')
const showDetailModal = ref(false)
const selectedOrder = ref(null)

const loadOrders = async () => {
  isLoading.value = true
  
  try {
    const result = await getPaymentOrders(currentPage.value, pagination.limit)
    
    if (result.success) {
      orders.value = result.data
      Object.assign(pagination, result.pagination)
    }
  } catch (error) {
    console.error('Load orders error:', error)
  } finally {
    isLoading.value = false
  }
}

const changePage = (page) => {
  currentPage.value = page
  loadOrders()
}

const viewOrderDetail = (order) => {
  selectedOrder.value = order
  showDetailModal.value = true
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedOrder.value = null
}

onMounted(() => {
  loadOrders()
})
</script>

<style scoped>
.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.85rem;
  font-weight: 600;
}

.badge-wechat {
  background: #dcfce7;
  color: #166534;
}

.badge-alipay {
  background: #dbeafe;
  color: #1e40af;
}

.badge-paypal {
  background: #fef3c7;
  color: #92400e;
}

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
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}
</style>
