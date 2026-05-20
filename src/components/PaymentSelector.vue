<template>
  <div class="payment-method-selector">
    <h3 style="margin-bottom: 1rem;">选择支付方式</h3>
    
    <div class="payment-options">
      <!-- WeChat Pay -->
      <div 
        class="payment-option" 
        :class="{ selected: selectedMethod === 'wechat' }"
        @click="selectMethod('wechat')"
      >
        <div class="payment-icon wechat">💚</div>
        <div class="payment-info">
          <div class="payment-name">微信支付</div>
          <div class="payment-desc">WeChat Pay</div>
        </div>
      </div>

      <!-- Alipay -->
      <div 
        class="payment-option" 
        :class="{ selected: selectedMethod === 'alipay' }"
        @click="selectMethod('alipay')"
      >
        <div class="payment-icon alipay">💙</div>
        <div class="payment-info">
          <div class="payment-name">支付宝</div>
          <div class="payment-desc">Alipay</div>
        </div>
      </div>

      <!-- PayPal -->
      <div 
        class="payment-option" 
        :class="{ selected: selectedMethod === 'paypal' }"
        @click="selectMethod('paypal')"
      >
        <div class="payment-icon paypal">🅿️</div>
        <div class="payment-info">
          <div class="payment-name">PayPal</div>
          <div class="payment-desc">International Payment</div>
        </div>
      </div>
    </div>

    <button 
      class="btn btn-primary" 
      style="width: 100%; margin-top: 1.5rem;"
      :disabled="!selectedMethod || isProcessing"
      @click="handlePayment"
    >
      {{ isProcessing ? '处理中...' : '确认支付' }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  createWeChatPayOrder, 
  createAlipayOrder, 
  createPayPalOrder,
  getWeChatQRCodeURL 
} from '../utils/payment'

const props = defineProps({
  orderData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['payment-success', 'payment-error'])

const selectedMethod = ref(null)
const isProcessing = ref(false)

const selectMethod = (method) => {
  selectedMethod.value = method
}

const handlePayment = async () => {
  if (!selectedMethod.value) return
  
  isProcessing.value = true
  
  try {
    let result
    
    switch (selectedMethod.value) {
      case 'wechat':
        result = await createWeChatPayOrder(props.orderData)
        handleWeChatPayResult(result)
        break
        
      case 'alipay':
        result = await createAlipayOrder(props.orderData)
        handleAlipayResult(result)
        break
        
      case 'paypal':
        result = await createPayPalOrder(props.orderData)
        handlePayPalResult(result)
        break
    }
  } catch (error) {
    console.error('Payment error:', error)
    emit('payment-error', error)
  } finally {
    isProcessing.value = false
  }
}

const handleWeChatPayResult = (result) => {
  if (result.success) {
    // Show QR code for scanning
    const qrCodeURL = getWeChatQRCodeURL(result.data.code_url)
    emit('payment-success', {
      method: 'wechat',
      data: result.data,
      qrCodeURL
    })
  }
}

const handleAlipayResult = (result) => {
  if (result.success) {
    // Redirect to Alipay or show QR code
    emit('payment-success', {
      method: 'alipay',
      data: result.data
    })
  }
}

const handlePayPalResult = (result) => {
  if (result.success) {
    // Redirect to PayPal approval URL
    window.location.href = result.data.approve_url
  }
}
</script>

<style scoped>
.payment-method-selector {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.payment-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.payment-option {
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 2px solid var(--border-color);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s;
}

.payment-option:hover {
  border-color: var(--primary-color);
  background: var(--bg-light);
}

.payment-option.selected {
  border-color: var(--primary-color);
  background: #eff6ff;
}

.payment-icon {
  font-size: 2rem;
  margin-right: 1rem;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.payment-icon.wechat {
  background: #dcfce7;
}

.payment-icon.alipay {
  background: #dbeafe;
}

.payment-icon.paypal {
  background: #fef3c7;
}

.payment-info {
  flex: 1;
}

.payment-name {
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.payment-desc {
  color: var(--text-light);
  font-size: 0.9rem;
}
</style>
