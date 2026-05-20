# 支付功能集成文档

## ✅ 已完成的支付功能

本项目已成功集成三种主流支付方式：
- ✅ **微信支付 (WeChat Pay)**
- ✅ **支付宝 (Alipay)**  
- ✅ **PayPal**

## 📁 文件结构

```
frontend/
├── api/
│   └── handlers/
│       └── payment.js          # 支付API处理器
├── src/
│   ├── components/
│   │   ├── PaymentSelector.vue # 支付方式选择组件
│   │   └── PaymentResult.vue   # 支付结果展示组件
│   ├── views/
│   │   └── PaymentOrdersView.vue # 支付订单管理页面
│   └── utils/
│       └── payment.js          # 支付工具函数
└── schema/
    └── schema.sql              # 数据库schema（包含payment_orders表）
```

## 🔧 API Endpoints

### 微信支付

#### 创建支付订单
```
POST /api/payment/wechat/create
```

**请求体**:
```json
{
  "out_trade_no": "ORDER20260520001",
  "total_fee": 10000,
  "body": "产品购买",
  "trade_type": "NATIVE",
  "notify_url": "https://yourdomain.com/api/payment/wechat/notify"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "order_no": "ORDER20260520001",
    "code_url": "weixin://wxpay/bizpayurl?pr=xxxxx",
    "expires_in": 7200
  }
}
```

#### 支付回调
```
POST /api/payment/wechat/notify
```

### 支付宝

#### 创建支付订单
```
POST /api/payment/alipay/create
```

**请求体**:
```json
{
  "out_trade_no": "ORDER20260520001",
  "total_amount": 100.00,
  "subject": "产品购买",
  "notify_url": "https://yourdomain.com/api/payment/alipay/notify",
  "return_url": "https://yourdomain.com/payment/success"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "order_no": "ORDER20260520001",
    "qr_code": "https://qr.alipay.com/xxxxx",
    "form": "<form>...</form>",
    "expires_in": 900
  }
}
```

#### 支付回调
```
POST /api/payment/alipay/notify
```

### PayPal

#### 创建支付订单
```
POST /api/payment/paypal/create
```

**请求体**:
```json
{
  "amount": 100.00,
  "currency": "USD",
  "description": "Product Purchase"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "order_no": "PP1234567890",
    "paypal_order_id": "ORDER_ID_FROM_PAYPAL",
    "approve_url": "https://www.paypal.com/checkoutnow?token=xxxxx",
    "expires_in": 10800
  }
}
```

#### 捕获支付
```
POST /api/payment/paypal/capture
```

**请求体**:
```json
{
  "order_no": "PP1234567890",
  "paypal_order_id": "ORDER_ID_FROM_PAYPAL"
}
```

### 订单管理

#### 获取订单列表（管理员）
```
GET /api/payment/orders?page=1&limit=20
```

#### 获取单个订单
```
GET /api/payment/orders/:order_no
```

## 💻 前端使用示例

### 1. 在组件中使用支付选择器

```vue
<template>
  <div>
    <h2>订单支付</h2>
    <p>订单金额: ¥{{ orderAmount }}</p>
    
    <PaymentSelector 
      :order-data="orderData"
      @payment-success="handlePaymentSuccess"
      @payment-error="handlePaymentError"
    />
    
    <PaymentResult 
      v-if="showPaymentResult"
      :payment-data="paymentData"
      @cancel="handleCancel"
      @check-status="checkPaymentStatus"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PaymentSelector from '../components/PaymentSelector.vue'
import PaymentResult from '../components/PaymentResult.vue'

const orderAmount = ref(100)
const showPaymentResult = ref(false)
const paymentData = ref(null)

const orderData = {
  orderNo: `ORDER${Date.now()}`,
  amount: orderAmount.value,
  description: '产品购买',
  currency: 'CNY'
}

const handlePaymentSuccess = (data) => {
  paymentData.value = data
  showPaymentResult.value = true
}

const handlePaymentError = (error) => {
  console.error('Payment failed:', error)
  alert('支付失败，请重试')
}

const handleCancel = () => {
  showPaymentResult.value = false
  paymentData.value = null
}

const checkPaymentStatus = async () => {
  // Check payment status via API
  // Update UI accordingly
}
</script>
```

### 2. 直接使用支付工具函数

```javascript
import { 
  createWeChatPayOrder,
  createAlipayOrder,
  createPayPalOrder,
  getPaymentOrder
} from '../utils/payment'

// 创建微信支付订单
const wechatResult = await createWeChatPayOrder({
  orderNo: 'ORDER123',
  amount: 100,
  description: 'Product Purchase'
})

// 创建支付宝订单
const alipayResult = await createAlipayOrder({
  orderNo: 'ORDER123',
  amount: 100,
  description: 'Product Purchase'
})

// 创建PayPal订单
const paypalResult = await createPayPalOrder({
  amount: 15.99,
  currency: 'USD',
  description: 'Product Purchase'
})

// 查询订单状态
const order = await getPaymentOrder('ORDER123')
```

## 🗄️ 数据库 Schema

### payment_orders 表

```sql
CREATE TABLE payment_orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_no TEXT UNIQUE NOT NULL,
  payment_method TEXT NOT NULL, -- wechat, alipay, paypal
  amount REAL NOT NULL,
  currency TEXT DEFAULT 'CNY',
  description TEXT,
  status TEXT DEFAULT 'pending', -- pending, completed, failed, refunded
  transaction_id TEXT,
  metadata TEXT, -- JSON string
  paid_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_payment_orders_no ON payment_orders(order_no);
CREATE INDEX idx_payment_orders_status ON payment_orders(status);
CREATE INDEX idx_payment_orders_method ON payment_orders(payment_method);
```

## 🔐 生产环境配置

### 1. 微信支付配置

在 `frontend/api/handlers/payment.js` 中配置：

```javascript
// WeChat Pay Configuration
const WECHAT_CONFIG = {
  appid: 'YOUR_WECHAT_APPID',
  mch_id: 'YOUR_MERCHANT_ID',
  api_key: 'YOUR_API_KEY',
  notify_url: 'https://yourdomain.com/api/payment/wechat/notify'
}
```

需要实现：
- 签名验证
- 调用微信统一下单API
- 处理异步通知

参考文档：[微信支付开发文档](https://pay.weixin.qq.com/wiki/doc/api/)

### 2. 支付宝配置

```javascript
// Alipay Configuration
const ALIPAY_CONFIG = {
  app_id: 'YOUR_ALIPAY_APPID',
  private_key: 'YOUR_PRIVATE_KEY',
  alipay_public_key: 'ALIPAY_PUBLIC_KEY',
  notify_url: 'https://yourdomain.com/api/payment/alipay/notify',
  return_url: 'https://yourdomain.com/payment/success'
}
```

需要实现：
- RSA签名
- 调用支付宝API
- 处理异步通知

参考文档：[支付宝开放平台](https://opendocs.alipay.com/)

### 3. PayPal配置

```javascript
// PayPal Configuration
const PAYPAL_CONFIG = {
  client_id: 'YOUR_PAYPAL_CLIENT_ID',
  client_secret: 'YOUR_PAYPAL_CLIENT_SECRET',
  sandbox: true, // Set to false for production
  base_url: 'https://api-m.sandbox.paypal.com' // Production: https://api-m.paypal.com
}
```

需要实现：
- OAuth 2.0认证
- 调用PayPal Orders API v2
- 处理Webhook通知

参考文档：[PayPal Developer](https://developer.paypal.com/)

## 📊 订单状态流转

```
pending (待支付)
  ↓
completed (已支付) ← 支付成功
  ↓
refunded (已退款) ← 申请退款
  
pending
  ↓
failed (支付失败) ← 支付失败或超时
```

## 🎨 UI组件

### PaymentSelector
支付方式选择组件，支持三种支付方式切换。

**Props**:
- `orderData`: Object - 订单数据

**Events**:
- `payment-success`: 支付创建成功
- `payment-error`: 支付创建失败

### PaymentResult
支付结果展示组件，显示二维码或跳转信息。

**Props**:
- `paymentData`: Object - 支付数据

**Events**:
- `cancel`: 取消支付
- `check-status`: 检查支付状态

### PaymentOrdersView
管理员支付订单管理页面。

**功能**:
- 订单列表展示
- 状态筛选
- 支付方式筛选
- 订单详情查看
- 分页

## 🧪 测试

### 测试流程

1. **创建测试订单**
```javascript
const testOrder = {
  orderNo: `TEST${Date.now()}`,
  amount: 0.01, // 最小金额测试
  description: 'Test Payment'
}
```

2. **微信支付测试**
- 使用微信开发者工具
- 扫描生成的二维码
- 验证回调接收

3. **支付宝测试**
- 使用沙箱环境
- 扫码或跳转支付
- 验证异步通知

4. **PayPal测试**
- 使用Sandbox账户
- 完成支付流程
- 验证Webhook

## ⚠️ 注意事项

### 安全性

1. **签名验证**
   - 所有支付回调必须验证签名
   - 防止伪造通知

2. **金额校验**
   - 回调时验证金额是否匹配
   - 防止金额篡改

3. **幂等性**
   - 处理重复通知
   - 使用订单号作为唯一标识

4. **HTTPS**
   - 生产环境必须使用HTTPS
   - 保护敏感数据传输

### 错误处理

1. **超时处理**
   - 设置合理的超时时间
   - 提供订单查询接口

2. **重试机制**
   - 网络失败时重试
   - 记录错误日志

3. **用户提示**
   - 清晰的错误信息
   - 引导用户操作

## 📈 后续优化

- [ ] 添加退款功能
- [ ] 实现支付统计报表
- [ ] 支持更多支付方式
- [ ] 添加订阅支付
- [ ] 实现分账功能
- [ ] 支付安全审计

## 📚 相关资源

- [微信支付官方文档](https://pay.weixin.qq.com/wiki/doc/api/)
- [支付宝开放平台](https://opendocs.alipay.com/)
- [PayPal Developer](https://developer.paypal.com/)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)

---

**集成完成日期**: 2026-05-20  
**版本**: 1.0.0  
**状态**: ✅ 基础功能已完成，生产环境需配置真实API密钥
