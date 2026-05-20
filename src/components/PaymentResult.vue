<template>
  <div class="payment-result">
    <!-- WeChat Pay QR Code -->
    <div v-if="paymentData.method === 'wechat'" class="wechat-payment">
      <h3 style="text-align: center; margin-bottom: 1rem;">微信支付</h3>
      <p style="text-align: center; color: var(--text-light); margin-bottom: 2rem;">
        请使用微信扫描二维码完成支付
      </p>
      
      <div style="text-align: center;">
        <img 
          :src="paymentData.qrCodeURL" 
          alt="WeChat Pay QR Code"
          style="width: 300px; height: 300px; border: 1px solid var(--border-color); border-radius: 0.5rem;"
        >
      </div>
      
      <div style="margin-top: 2rem; text-align: center;">
        <p style="color: var(--text-light);">订单号: {{ paymentData.data.order_no }}</p>
        <p style="color: var(--text-light);">
          二维码有效期: {{ Math.floor(paymentData.data.expires_in / 60) }} 分钟
        </p>
      </div>
      
      <div style="margin-top: 1.5rem; padding: 1rem; background: #fef3c7; border-radius: 0.5rem;">
        <p style="text-align: center; color: #92400e; font-size: 0.9rem;">
          💡 提示: 支付完成后页面将自动更新状态
        </p>
      </div>
    </div>

    <!-- Alipay Payment -->
    <div v-else-if="paymentData.method === 'alipay'" class="alipay-payment">
      <h3 style="text-align: center; margin-bottom: 1rem;">支付宝支付</h3>
      
      <div v-if="paymentData.data.qr_code" style="text-align: center;">
        <p style="color: var(--text-light); margin-bottom: 2rem;">
          请使用支付宝扫描二维码完成支付
        </p>
        <img 
          :src="paymentData.data.qr_code" 
          alt="Alipay QR Code"
          style="width: 300px; height: 300px; border: 1px solid var(--border-color); border-radius: 0.5rem;"
        >
      </div>
      
      <div v-else-if="paymentData.data.form" style="text-align: center;">
        <p style="color: var(--text-light); margin-bottom: 2rem;">
          即将跳转到支付宝支付页面...
        </p>
        <div v-html="paymentData.data.form"></div>
      </div>
      
      <div style="margin-top: 2rem; text-align: center;">
        <p style="color: var(--text-light);">订单号: {{ paymentData.data.order_no }}</p>
      </div>
    </div>

    <!-- PayPal Payment -->
    <div v-else-if="paymentData.method === 'paypal'" class="paypal-payment">
      <h3 style="text-align: center; margin-bottom: 1rem;">PayPal Payment</h3>
      <p style="text-align: center; color: var(--text-light); margin-bottom: 2rem;">
        Redirecting to PayPal...
      </p>
      <div style="text-align: center;">
        <div class="spinner"></div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div style="margin-top: 2rem; display: flex; gap: 1rem;">
      <button 
        class="btn btn-secondary" 
        style="flex: 1;"
        @click="$emit('cancel')"
      >
        取消支付
      </button>
      <button 
        class="btn btn-primary" 
        style="flex: 1;"
        @click="$emit('check-status')"
      >
        检查支付状态
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  paymentData: {
    type: Object,
    required: true
  }
})

defineEmits(['cancel', 'check-status'])
</script>

<style scoped>
.payment-result {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.spinner {
  border: 3px solid #f3f4f6;
  border-top: 3px solid var(--primary-color);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 2rem auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
