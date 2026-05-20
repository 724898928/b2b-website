/**
 * Payment Utility Functions
 */

import api from './api'

/**
 * Create WeChat Pay Order
 */
export async function createWeChatPayOrder(orderData) {
  const response = await api.post('/payment/wechat/create', {
    out_trade_no: orderData.orderNo,
    total_fee: orderData.amount * 100, // Convert to cents
    body: orderData.description,
    trade_type: orderData.tradeType || 'NATIVE',
    notify_url: orderData.notifyUrl
  })
  
  return response.data
}

/**
 * Create Alipay Order
 */
export async function createAlipayOrder(orderData) {
  const response = await api.post('/payment/alipay/create', {
    out_trade_no: orderData.orderNo,
    total_amount: orderData.amount,
    subject: orderData.description,
    notify_url: orderData.notifyUrl,
    return_url: orderData.returnUrl
  })
  
  return response.data
}

/**
 * Create PayPal Order
 */
export async function createPayPalOrder(orderData) {
  const response = await api.post('/payment/paypal/create', {
    amount: orderData.amount,
    currency: orderData.currency || 'USD',
    description: orderData.description
  })
  
  return response.data
}

/**
 * Capture PayPal Payment
 */
export async function capturePayPalPayment(orderNo, paypalOrderId) {
  const response = await api.post('/payment/paypal/capture', {
    order_no: orderNo,
    paypal_order_id: paypalOrderId
  })
  
  return response.data
}

/**
 * Get Payment Order Details
 */
export async function getPaymentOrder(orderNo) {
  const response = await api.get(`/payment/orders/${orderNo}`)
  return response.data
}

/**
 * Get Payment Orders List (Admin)
 */
export async function getPaymentOrders(page = 1, limit = 20) {
  const response = await api.get(`/payment/orders?page=${page}&limit=${limit}`)
  return response.data
}

/**
 * Generate QR Code URL for WeChat Pay
 */
export function getWeChatQRCodeURL(codeURL) {
  // Use a QR code generation service
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(codeURL)}`
}

/**
 * Format payment method display name
 */
export function formatPaymentMethod(method) {
  const methods = {
    wechat: '微信支付',
    alipay: '支付宝',
    paypal: 'PayPal'
  }
  return methods[method] || method
}

/**
 * Format payment status display
 */
export function formatPaymentStatus(status) {
  const statuses = {
    pending: '待支付',
    completed: '已支付',
    failed: '支付失败',
    refunded: '已退款'
  }
  return statuses[status] || status
}

/**
 * Get payment status color
 */
export function getPaymentStatusColor(status) {
  const colors = {
    pending: '#f59e0b',    // Orange
    completed: '#10b981',  // Green
    failed: '#ef4444',     // Red
    refunded: '#6b7280'    // Gray
  }
  return colors[status] || '#6b7280'
}
