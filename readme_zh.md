# 中文文档

## 目录

1. [项目概述](#项目概述)
2. [技术栈](#技术栈)
3. [项目结构](#项目结构)
4. [安装与运行](#安装与运行)
5. [功能特性](#功能特性)
6. [API集成](#api集成)
7. [支付集成](#支付集成)
8. [状态管理](#状态管理)
9. [路由保护](#路由保护)
10. [样式系统](#样式系统)
11. [Cloudflare Workers配置](#cloudflare-workers配置)
12. [部署](#部署)
13. [开发最佳实践](#开发最佳实践)
14. [常见问题](#常见问题)
15. [快速参考](#快速参考)
16. [后续改进](#后续改进)
17. [许可证](#许可证)

---

## 项目概述

这是一个基于Vue3的B2B产品展示网站前端应用，集成了Cloudflare Workers后端，支持微信支付、支付宝和PayPal等多种支付方式。

## 技术栈

- **Vue 3** - 渐进式JavaScript框架
- **Vue Router** - 官方路由管理器
- **Pinia** - Vue状态管理库
- **Axios** - HTTP客户端
- **Vite** - 下一代前端构建工具
- **Cloudflare Workers** - 无服务器平台
- **Cloudflare D1** - SQLite数据库
- **Cloudflare R2** - 对象存储
- **Cloudflare KV** - 键值存储

## 项目结构

```
b2b-website/
├── api/                      # Cloudflare Workers后端API
│   ├── handlers/            # API处理器
│   │   ├── admin.js         # 管理员认证和管理
│   │   ├── products.js      # 产品CRUD操作
│   │   ├── inquiries.js     # 询盘管理
│   │   ├── settings.js      # 网站设置(KV)
│   │   ├── payment.js       # 支付处理
│   │   └── upload.js        # 图片上传(R2)
│   ├── utils/               # 工具函数
│   │   └── auth.js          # JWT认证和密码哈希
│   └── router.js            # API路由分发
├── src/                     # Vue3前端应用
│   ├── assets/              # 静态资源
│   │   └── main.css         # 全局样式
│   ├── components/          # 可复用组件
│   │   ├── Navbar.vue
│   │   ├── Footer.vue
│   │   ├── ProductCard.vue
│   │   ├── PaymentSelector.vue
│   │   └── PaymentResult.vue
│   ├── stores/              # Pinia状态管理
│   │   ├── settings.js      # 网站设置store
│   │   └── products.js      # 产品store
│   ├── utils/               # 工具函数
│   │   ├── api.js           # API客户端配置
│   │   └── payment.js       # 支付工具
│   ├── views/               # 页面视图
│   │   ├── HomeView.vue
│   │   ├── ProductsView.vue
│   │   ├── ProductDetailView.vue
│   │   ├── AboutView.vue
│   │   ├── ContactView.vue
│   │   ├── AdminLoginView.vue
│   │   ├── AdminDashboardView.vue
│   │   ├── PaymentDemoView.vue
│   │   └── PaymentOrdersView.vue
│   ├── router/              # 路由配置
│   │   └── index.js
│   ├── App.vue              # 根组件
│   └── main.js              # 入口文件
├── schema/                  # 数据库Schema
│   └── schema.sql
├── index.html               # HTML模板
├── vite.config.js           # Vite配置
├── worker.js                # Cloudflare Workers入口文件
├── wrangler.toml            # Workers配置
└── package.json             # 项目依赖
```

## 安装与运行

### 前置要求

- Node.js 16+ 
- npm 或 yarn
- Wrangler CLI（用于Cloudflare Workers）

### 1. 安装依赖

```bash
npm install
cd frontend && npm install
```

### 2. 开发模式

首先启动Cloudflare Workers后端（在项目根目录）：

```bash
npm run dev
```

然后在另一个终端启动Vue3前端：

```bash
cd frontend
npm run dev
```

前端应用将在 http://localhost:3000 运行，API请求会自动代理到 http://localhost:8787

### 3. 构建生产版本

```bash
npm run build
```

构建后的文件将输出到 `./dist` 目录。

### 4. 预览生产构建

```bash
npm run preview
```

## 功能特性

### 前台功能
- ✅ 响应式设计，支持移动端
- ✅ 首页展示特色产品
- ✅ 产品列表和搜索过滤
- ✅ 产品详情页
- ✅ 公司简介页面
- ✅ 联系表单
- ✅ 动态网站设置
- ✅ 多种支付方式（微信、支付宝、PayPal）

### 后台管理
- ✅ 管理员登录认证
- ✅ 产品管理（增删改查）
- ✅ 网站设置管理
- ✅ 图片URL管理
- ✅ 产品分类和标签
- ✅ 询盘管理
- ✅ 支付订单管理
- ✅ 统计数据仪表板

## API集成

### 已完成的整合工作

所有原有的Cloudflare Workers API handlers已成功整合到 `api` 目录中。

### API端点

#### 产品API (`/api/products`)
- `GET /api/products` - 获取所有产品
- `GET /api/products/featured` - 获取特色产品
- `GET /api/products/:id` - 获取单个产品
- `POST /api/products` - 创建产品（需要超级管理员）
- `PUT /api/products/:id` - 更新产品（需要超级管理员）
- `DELETE /api/products/:id` - 删除产品（需要超级管理员）

#### 管理员API (`/api/admin`)
- `POST /api/admin/login` - 管理员登录
- `POST /api/admin/verify` - 验证Token
- `POST /api/admin/logout` - 登出
- `GET /api/admin/stats` - 获取统计数据

#### 询盘API (`/api/inquiries`)
- `POST /api/inquiries` - 提交询盘
- `GET /api/inquiries` - 获取所有询盘（管理员）
- `GET /api/inquiries/:id` - 获取单个询盘（管理员）
- `PUT /api/inquiries/:id/status` - 更新状态（管理员）
- `DELETE /api/inquiries/:id` - 删除询盘（超级管理员）

#### 设置API (`/api/settings`)
- `GET /api/settings` - 获取网站设置
- `POST /api/settings` - 更新设置（超级管理员）

#### 上传API (`/api/upload`)
- `POST /api/upload/image` - 上传图片到R2
- `GET /api/upload/image/:key` - 获取图片

### 核心功能

✅ **认证系统**
- JWT Token生成和验证
- SHA-256密码哈希
- 基于角色的访问控制（RBAC）
  - Super Admin: 完整权限
  - Admin: 只读权限

✅ **数据库集成**
- Cloudflare D1 (SQLite)
- 产品、询盘、管理员数据表

✅ **存储集成**
- Cloudflare R2: 图片存储
- Cloudflare KV: 网站设置存储

✅ **CORS支持**
- 跨域请求头配置
- OPTIONS预检请求处理

### API客户端配置

前端通过Axios与后端API通信，所有API请求都经过统一的拦截器处理：

- 自动添加认证token
- 统一错误处理
- 401自动跳转登录

```javascript
// API调用示例
import api from '../utils/api'

// GET请求
const response = await api.get('/products')

// POST请求
const response = await api.post('/products', { name: 'New Product' })
```

## 支付集成

### 支持的支付方式

- ✅ **微信支付**
- ✅ **支付宝**
- ✅ **PayPal**

### 支付API端点

#### 微信支付
- `POST /api/payment/wechat/create` - 创建支付订单
- `POST /api/payment/wechat/notify` - 支付回调

#### 支付宝
- `POST /api/payment/alipay/create` - 创建支付订单
- `POST /api/payment/alipay/notify` - 支付回调

#### PayPal
- `POST /api/payment/paypal/create` - 创建支付订单
- `POST /api/payment/paypal/capture` - 捕获支付

#### 订单管理
- `GET /api/payment/orders?page=1&limit=20` - 获取订单列表（管理员）
- `GET /api/payment/orders/:order_no` - 获取单个订单

### 前端支付组件

#### PaymentSelector
支付方式选择组件，支持三种支付方式切换。

**Props:**
- `orderData`: Object - 订单数据

**Events:**
- `payment-success`: 支付创建成功
- `payment-error`: 支付创建失败

#### PaymentResult
支付结果展示组件，显示二维码或跳转信息。

**Props:**
- `paymentData`: Object - 支付数据

**Events:**
- `cancel`: 取消支付
- `check-status`: 检查支付状态

### 使用示例

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
  </div>
</template>

<script setup>
import PaymentSelector from '../components/PaymentSelector.vue'

const orderData = {
  orderNo: `ORDER${Date.now()}`,
  amount: 100,
  description: '产品购买',
  currency: 'CNY'
}

const handlePaymentSuccess = (data) => {
  console.log('支付成功:', data)
}

const handlePaymentError = (error) => {
  console.error('支付失败:', error)
}
</script>
```

### 支付订单状态流转

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

### 生产环境配置

在 `api/handlers/payment.js` 中配置：

```javascript
// 微信支付配置
const WECHAT_CONFIG = {
  appid: 'YOUR_WECHAT_APPID',
  mch_id: 'YOUR_MERCHANT_ID',
  api_key: 'YOUR_API_KEY',
  notify_url: 'https://yourdomain.com/api/payment/wechat/notify'
}

// 支付宝配置
const ALIPAY_CONFIG = {
  app_id: 'YOUR_ALIPAY_APPID',
  private_key: 'YOUR_PRIVATE_KEY',
  alipay_public_key: 'ALIPAY_PUBLIC_KEY',
  notify_url: 'https://yourdomain.com/api/payment/alipay/notify',
  return_url: 'https://yourdomain.com/payment/success'
}

// PayPal配置
const PAYPAL_CONFIG = {
  client_id: 'YOUR_PAYPAL_CLIENT_ID',
  client_secret: 'YOUR_PAYPAL_CLIENT_SECRET',
  sandbox: true, // 生产环境设为false
  base_url: 'https://api-m.sandbox.paypal.com'
}
```

⚠️ **重要**: 生产环境需配置真实API密钥！

## 状态管理

使用Pinia进行状态管理：

- **settings store**: 管理网站设置（名称、描述、联系方式等）
- **products store**: 管理产品数据和操作

### 使用Store

```vue
<script setup>
import { useProductStore } from '../stores/products'

const productStore = useProductStore()

// 访问状态
console.log(productStore.products)

// 调用方法
await productStore.loadAllProducts()
</script>
```

## 路由保护

管理后台路由需要认证：

```javascript
{
  path: '/admin/dashboard',
  meta: { requiresAuth: true }
}
```

未认证的访问会被重定向到登录页面。

Token存储在`localStorage`中：

```javascript
// 获取token
const token = localStorage.getItem('admin_token')

// 清除token（登出）
localStorage.removeItem('admin_token')
```

## 样式系统

使用CSS变量实现主题系统：

```css
:root {
  --primary-color: #2563eb;
  --secondary-color: #1e40af;
  --accent-color: #f59e0b;
  /* ... */
}
```

### 修改主题颜色

编辑 `src/assets/main.css`：

```css
:root {
  --primary-color: #2563eb;    /* 主色调 */
  --secondary-color: #1e40af;  /* 次要色 */
  --accent-color: #f59e0b;     /* 强调色 */
}
```

每个`.vue`文件都有`<style scoped>`，只影响当前组件。

## Cloudflare Workers配置

### 配置文件位置

```
wrangler.toml  ← 主要配置文件
```

### 配置内容

```toml
name = "b2b-website"
main = "worker.js"
compatibility_date = "2025-01-01"

# D1数据库绑定
[[d1_databases]]
binding = "DB"
database_name = "b2b_database"
database_id = "your-database-id"

# 环境变量
[vars]
ENVIRONMENT = "development"

# R2存储桶（图片）
[[r2_buckets]]
binding = "IMAGES"
bucket_name = "product-images"

[[kv_namespaces]]
binding = "STATIC_ASSETS"
id = "your-kv-namespace-id"

# 静态资源目录（Vue3 SPA）
[assets]
directory = "./dist"
```

### Worker入口文件

`worker.js`统一处理API和前端资源：

```javascript
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 处理API请求
    if (url.pathname.startsWith('/api/')) {
      return handleApiRequest(request, env);
    }

    // 提供Vue3 SPA静态资源
    return env.ASSETS.fetch(request);
  },
};
```

### 环境变量管理

#### 方式1: wrangler.toml（开发环境）
```toml
[vars]
ENVIRONMENT = "development"
```

#### 方式2: Wrangler Secrets（生产环境 - 推荐）
```bash
# 添加密钥
wrangler secret put JWT_SECRET
wrangler secret put API_KEY

# 查看密钥列表
wrangler secret list

# 删除密钥
wrangler secret delete SECRET_NAME
```

### 默认管理员账户

首次部署后，使用以下凭据登录：

- **超级管理员**: 
  - 用户名: `admin123`
  - 密码: `admin123`

- **普通管理员**: 
  - 用户名: `staff`
  - 密码: `staff123`

⚠️ **重要**: 首次登录后请立即修改密码！

## 部署

### 前端部署选项

1. **Cloudflare Pages**: 
   ```bash
   npm run build
   # 将dist目录部署到Cloudflare Pages
   ```

2. **Netlify/Vercel**: 
   - 连接GitHub仓库
   - 设置构建命令: `npm run build`
   - 设置输出目录: `dist`

3. **静态服务器**: 
   - 将`dist`目录部署到任何静态文件服务器

4. **Cloudflare Workers**（推荐）:
   ```bash
   # 构建前端
   npm run build
   
   # 部署到Cloudflare
   npm run deploy
   ```

### 整合架构的优势

相比分离的前后端架构：

✅ **单一部署** - 前后端一起部署到Cloudflare  
✅ **更低延迟** - API和前端在同一边缘节点  
✅ **简化运维** - 只需管理一个项目  
✅ **成本优化** - 共享Cloudflare免费额度  
✅ **自动扩展** - Cloudflare全球CDN  

## 开发最佳实践

1. **组件化**: 保持组件小而专注
2. **组合式API**: 使用`<script setup>`语法
3. **响应式**: 合理使用`ref`和`reactive`
4. **性能**: 使用懒加载路由和组件
5. **代码规范**: 遵循Vue3最佳实践

### 添加新页面

1. **创建视图组件** - `src/views/NewPage.vue`
2. **添加路由** - `src/router/index.js`:
   ```javascript
   {
     path: '/new-page',
     name: 'new-page',
     component: () => import('../views/NewPage.vue')
   }
   ```
3. **添加导航链接** - `src/components/Navbar.vue`

### 性能优化

- ✅ 路由懒加载（已配置）
- ✅ 组件按需导入
- ✅ 图片懒加载
- ✅ 使用`v-show` vs `v-if`
- ✅ 避免不必要的计算

### 常用包推荐

```bash
npm install lodash-es dayjs vee-validate vue-i18n
```

- `lodash-es` - 工具函数库
- `dayjs` - 日期处理
- `vee-validate` - 表单验证
- `vue-i18n` - 国际化

## 常见问题

### 问题1: 模板中忽略带有副作用的标签

**错误信息**:
```
Tags with side effect (<script> and <style>) are ignored in client component templates.
```

**原因**: 
在Vue3中，不能在`<template>`标签内部使用`<style>`或`<script>`标签。这些标签必须放在模板外部，作为组件的顶级元素。

**解决方案**:
将模板内的`<style>`标签移动到组件底部的`<style scoped>`块中。

### 问题2: 端口被占用

**错误**: `Port 3000 is already in use`

**解决方案**:
```javascript
// 修改vite.config.js
export default defineConfig({
  server: {
    port: 3001,  // 改为其他端口
  }
})
```

### 问题3: API请求失败

**错误**: `Network Error` 或 `404 Not Found`

**检查清单**:
1. 确保后端正在运行（`npm run dev`）
2. 检查后端地址是否正确（默认http://localhost:8787）
3. 验证`vite.config.js`中的代理配置

### 问题4: 依赖安装失败

**错误**: `npm install`报错

**解决方案**:
```bash
# 清除缓存
npm cache clean --force

# 删除node_modules
rm -rf node_modules package-lock.json

# 重新安装
npm install
```

### 问题5: 路由跳转后页面空白

**原因**: 组件导入路径错误

**解决方案**: 检查`router/index.js`中的导入路径是否正确

### 调试技巧

1. **Vue DevTools** - 安装浏览器扩展
2. **Console.log** - 在组件中打印数据
3. **Network Tab** - 检查API请求
4. **Vite Error Overlay** - 查看编译错误

## 快速参考

### 常用命令

```bash
npm run dev      # 启动开发服务器 (http://localhost:3000)
npm run build    # 构建生产版本
npm run preview  # 预览生产构建
```

### 响应式数据

```javascript
import { ref, reactive } from 'vue'

const count = ref(0)           // 基本类型
const user = reactive({        // 对象
  name: 'John',
  age: 30
})
```

### 计算属性

```javascript
import { computed } from 'vue'

const doubleCount = computed(() => count.value * 2)
```

### 生命周期钩子

```javascript
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  // 组件挂载后执行
})
```

### 响应式设计

使用CSS媒体查询：

```css
@media (max-width: 768px) {
  /* 移动端样式 */
}
```

## 后续改进

- [ ] 添加退款功能
- [ ] 实现支付统计报表
- [ ] 支持更多支付方式
- [ ] 添加订阅支付
- [ ] 实现分账功能
- [ ] 支付安全审计
- [ ] 实现产品评论系统
- [ ] 添加多语言支持
- [ ] 优化SEO（SSR或预渲染）
- [ ] 添加单元测试
- [ ] 实现产品对比功能
- [ ] 添加购物车功能

## 许可证

MIT License

---

**最后更新**: 2026-05-20  
**版本**: 2.0.0  
**状态**: ✅ 已完成整合并测试