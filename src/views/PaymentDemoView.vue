<template>
  <div class="container" style="margin-top: 2rem; margin-bottom: 3rem;">
    <h1 style="margin-bottom: 2rem;">支付演示</h1>

    <!-- Order Summary -->
    <div style="background: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 2rem;">
      <h2 style="margin-bottom: 1rem;">订单信息</h2>
      
      <div style="line-height: 2;">
        <p><strong>订单号:</strong> {{ orderData.orderNo }}</p>
        <p><strong>商品名称:</strong> {{ orderData.description }}</p>
        <p><strong>金额:</strong> 
          <span style="font-size: 1.5rem; color: var(--primary-color); font-weight: bold;">
            ¥{{ orderData.amount.toFixed(2) }}
          </span>
        </p>
      </div>
    </div>

    <!-- Payment Selection -->
    <div v-if="!showPaymentResult">
      <PaymentSelector 
        :order-data="orderData"
        @payment-success="handlePaymentSuccess"
        @payment-error="handlePaymentError"
      />
    </div>

    <!-- Payment Result -->
    <div v-else>
      <PaymentResult 
        :payment-data="paymentData"
        @cancel="handleCancel"
        @check-status="checkPaymentStatus"
      />
    </div>

    <!-- Payment Status Info -->
    <div style="margin-top: 2rem; background: #eff6ff; padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid var(--primary-color);">
      <h3 style="margin-bottom: 1rem;">💡 测试说明</h3>
      <ul style="line-height: 2; color: var(--text-dark);">
        <li>这是一个支付功能演示页面</li>
        <li>当前为开发模式，使用模拟数据</li>
        <li>生产环境需要配置真实的支付平台API密钥</li>
        <li>请参考 <a href="/PAYMENT_INTEGRATION.md" style="color: var(--primary-color);">支付集成文档</a> 进行配置</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PaymentSelector from '../components/PaymentSelector.vue'
import PaymentResult from '../components/PaymentResult.vue'

const orderData = ref({
  orderNo: `ORDER${Date.now()}`,
  amount: 99.99,
  description: '示例产品购买',
  currency: 'CNY'
})

const showPaymentResult = ref(false)
const paymentData = ref(null)

const handlePaymentSuccess = (data) => {
  console.log('Payment created:', data)
  paymentData.value = data
  showPaymentResult.value = true
}

const handlePaymentError = (error) => {
  console.error('Payment error:', error)
  alert('支付创建失败，请重试')
}

const handleCancel = () => {
  showPaymentResult.value = false
  paymentData.value = null
}

const checkPaymentStatus = async () => {
  // In production, call API to check payment status
  alert('正在检查支付状态...')
  
  // Simulate status check
  setTimeout(() => {
    alert('支付状态：待支付（演示模式）')
  }, 1000)
}
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
}
</style>
