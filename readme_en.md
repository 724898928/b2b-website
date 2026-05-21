# English Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Installation & Running](#installation--running)
5. [Features](#features)
6. [API Integration](#api-integration)
7. [Payment Integration](#payment-integration)
8. [State Management](#state-management)
9. [Route Protection](#route-protection)
10. [Styling System](#styling-system)
11. [Cloudflare Workers Configuration](#cloudflare-workers-configuration)
12. [Deployment](#deployment)
13. [Development Best Practices](#development-best-practices)
14. [Troubleshooting](#troubleshooting)
15. [Quick Reference](#quick-reference)
16. [Future Improvements](#future-improvements)
17. [License](#license)

---

## Project Overview

This is a Vue3-based B2B product exhibition website frontend application with integrated Cloudflare Workers backend, supporting multiple payment methods including WeChat Pay, Alipay, and PayPal.

## Tech Stack

- **Vue 3** - Progressive JavaScript Framework
- **Vue Router** - Official Router Manager
- **Pinia** - Vue State Management Library
- **Axios** - HTTP Client
- **Vite** - Next Generation Frontend Build Tool
- **Cloudflare Workers** - Serverless Platform
- **Cloudflare D1** - SQLite Database
- **Cloudflare R2** - Object Storage
- **Cloudflare KV** - Key-Value Storage

## Project Structure

```
b2b-website/
├── api/                      # Cloudflare Workers Backend API
│   ├── handlers/            # API Handlers
│   │   ├── admin.js         # Admin Authentication & Management
│   │   ├── products.js      # Product CRUD Operations
│   │   ├── inquiries.js     # Inquiry Management
│   │   ├── settings.js      # Website Settings (KV)
│   │   ├── payment.js       # Payment Processing
│   │   └── upload.js        # Image Upload (R2)
│   ├── utils/               # Utility Functions
│   │   └── auth.js          # JWT Authentication & Password Hashing
│   └── router.js            # API Route Dispatcher
├── src/                     # Vue3 Frontend Application
│   ├── assets/              # Static Assets
│   │   └── main.css         # Global Styles
│   ├── components/          # Reusable Components
│   │   ├── Navbar.vue
│   │   ├── Footer.vue
│   │   ├── ProductCard.vue
│   │   ├── PaymentSelector.vue
│   │   └── PaymentResult.vue
│   ├── stores/              # Pinia State Management
│   │   ├── settings.js      # Website Settings Store
│   │   └── products.js      # Products Store
│   ├── utils/               # Utility Functions
│   │   ├── api.js           # API Client Configuration
│   │   └── payment.js       # Payment Utilities
│   ├── views/               # Page Views
│   │   ├── HomeView.vue
│   │   ├── ProductsView.vue
│   │   ├── ProductDetailView.vue
│   │   ├── AboutView.vue
│   │   ├── ContactView.vue
│   │   ├── AdminLoginView.vue
│   │   ├── AdminDashboardView.vue
│   │   ├── PaymentDemoView.vue
│   │   └── PaymentOrdersView.vue
│   ├── router/              # Router Configuration
│   │   └── index.js
│   ├── App.vue              # Root Component
│   └── main.js              # Entry File
├── schema/                  # Database Schema
│   └── schema.sql
├── index.html               # HTML Template
├── vite.config.js           # Vite Configuration
├── worker.js                # Cloudflare Workers Entry Point
├── wrangler.toml            # Workers Configuration
└── package.json             # Project Dependencies
```

## Installation & Running

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Wrangler CLI (for Cloudflare Workers)

### 1. Install Dependencies

```bash
npm install
cd frontend && npm install
```

### 2. Development Mode

Start Cloudflare Workers backend (in project root):

```bash
npm run dev
```

In another terminal, start Vue3 frontend:

```bash
cd frontend
npm run dev
```

The frontend application will run at http://localhost:3000, and API requests will be automatically proxied to http://localhost:8787.

### 3. Build Production Version

```bash
npm run build
```

Built files will be output to the `./dist` directory.

### 4. Preview Production Build

```bash
npm run preview
```

## Features

### Frontend Features
- ✅ Responsive Design, Mobile Support
- ✅ Homepage Showcasing Featured Products
- ✅ Product List with Search & Filter
- ✅ Product Detail Pages
- ✅ Company About Page
- ✅ Contact Form
- ✅ Dynamic Website Settings
- ✅ Multiple Payment Methods (WeChat Pay, Alipay, PayPal)

### Admin Dashboard
- ✅ Administrator Login Authentication
- ✅ Product Management (CRUD)
- ✅ Website Settings Management
- ✅ Image URL Management
- ✅ Product Categories & Tags
- ✅ Inquiry Management
- ✅ Payment Orders Management
- ✅ Statistics Dashboard

## API Integration

### Completed Integration Work

All original Cloudflare Workers API handlers have been successfully integrated into the `api` directory.

### API Endpoints

#### Products API (`/api/products`)
- `GET /api/products` - Get all products
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Super Admin required)
- `PUT /api/products/:id` - Update product (Super Admin required)
- `DELETE /api/products/:id` - Delete product (Super Admin required)

#### Admin API (`/api/admin`)
- `POST /api/admin/login` - Admin login
- `POST /api/admin/verify` - Verify token
- `POST /api/admin/logout` - Logout
- `GET /api/admin/stats` - Get statistics

#### Inquiries API (`/api/inquiries`)
- `POST /api/inquiries` - Submit inquiry
- `GET /api/inquiries` - Get all inquiries (Admin)
- `GET /api/inquiries/:id` - Get single inquiry (Admin)
- `PUT /api/inquiries/:id/status` - Update status (Admin)
- `DELETE /api/inquiries/:id` - Delete inquiry (Super Admin)

#### Settings API (`/api/settings`)
- `GET /api/settings` - Get website settings
- `POST /api/settings` - Update settings (Super Admin)

#### Upload API (`/api/upload`)
- `POST /api/upload/image` - Upload image to R2
- `GET /api/upload/image/:key` - Get image

### Core Features

✅ **Authentication System**
- JWT Token generation and validation
- SHA-256 password hashing
- Role-Based Access Control (RBAC)
  - Super Admin: Full permissions
  - Admin: Read-only permissions

✅ **Database Integration**
- Cloudflare D1 (SQLite)
- Products, inquiries, admins tables

✅ **Storage Integration**
- Cloudflare R2: Image storage
- Cloudflare KV: Website settings storage

✅ **CORS Support**
- Cross-origin request headers configuration
- OPTIONS preflight request handling

### API Client Configuration

Frontend communicates with backend API through Axios with unified interceptors:

- Automatically add authentication token
- Unified error handling
- 401 auto-redirect to login

```javascript
// Example API call
import api from '../utils/api'

// GET request
const response = await api.get('/products')

// POST request
const response = await api.post('/products', { name: 'New Product' })
```

## Payment Integration

### Supported Payment Methods

- ✅ **WeChat Pay**
- ✅ **Alipay**
- ✅ **PayPal**

### Payment API Endpoints

#### WeChat Pay
- `POST /api/payment/wechat/create` - Create payment order
- `POST /api/payment/wechat/notify` - Payment callback

#### Alipay
- `POST /api/payment/alipay/create` - Create payment order
- `POST /api/payment/alipay/notify` - Payment callback

#### PayPal
- `POST /api/payment/paypal/create` - Create payment order
- `POST /api/payment/paypal/capture` - Capture payment

#### Order Management
- `GET /api/payment/orders?page=1&limit=20` - Get order list (Admin)
- `GET /api/payment/orders/:order_no` - Get single order

### Frontend Payment Components

#### PaymentSelector
Payment method selection component supporting three payment methods.

**Props:**
- `orderData`: Object - Order data

**Events:**
- `payment-success`: Payment creation successful
- `payment-error`: Payment creation failed

#### PaymentResult
Payment result display component showing QR code or redirect information.

**Props:**
- `paymentData`: Object - Payment data

**Events:**
- `cancel`: Cancel payment
- `check-status`: Check payment status

### Usage Example

```vue
<template>
  <div>
    <h2>Order Payment</h2>
    <p>Amount: ¥{{ orderAmount }}</p>
    
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
  description: 'Product Purchase',
  currency: 'CNY'
}

const handlePaymentSuccess = (data) => {
  console.log('Payment successful:', data)
}

const handlePaymentError = (error) => {
  console.error('Payment failed:', error)
}
</script>
```

### Payment Order Status Flow

```
pending (awaiting payment)
  ↓
completed (paid) ← Payment successful
  ↓
refunded (refunded) ← Refund requested
  
pending
  ↓
failed (payment failed) ← Payment failed or timeout
```

### Production Configuration

Configure in `api/handlers/payment.js`:

```javascript
// WeChat Pay Configuration
const WECHAT_CONFIG = {
  appid: 'YOUR_WECHAT_APPID',
  mch_id: 'YOUR_MERCHANT_ID',
  api_key: 'YOUR_API_KEY',
  notify_url: 'https://yourdomain.com/api/payment/wechat/notify'
}

// Alipay Configuration
const ALIPAY_CONFIG = {
  app_id: 'YOUR_ALIPAY_APPID',
  private_key: 'YOUR_PRIVATE_KEY',
  alipay_public_key: 'ALIPAY_PUBLIC_KEY',
  notify_url: 'https://yourdomain.com/api/payment/alipay/notify',
  return_url: 'https://yourdomain.com/payment/success'
}

// PayPal Configuration
const PAYPAL_CONFIG = {
  client_id: 'YOUR_PAYPAL_CLIENT_ID',
  client_secret: 'YOUR_PAYPAL_CLIENT_SECRET',
  sandbox: true, // Set to false for production
  base_url: 'https://api-m.sandbox.paypal.com'
}
```

⚠️ **Important**: Configure real API keys for production environment!

## State Management

Using Pinia for state management:

- **settings store**: Manages website settings (name, description, contact info, etc.)
- **products store**: Manages product data and operations

### Using Store

```vue
<script setup>
import { useProductStore } from '../stores/products'

const productStore = useProductStore()

// Access state
console.log(productStore.products)

// Call methods
await productStore.loadAllProducts()
</script>
```

## Route Protection

Admin dashboard routes require authentication:

```javascript
{
  path: '/admin/dashboard',
  meta: { requiresAuth: true }
}
```

Unauthenticated access will be redirected to the login page.

Token is stored in `localStorage`:

```javascript
// Get token
const token = localStorage.getItem('admin_token')

// Clear token (logout)
localStorage.removeItem('admin_token')
```

## Styling System

Uses CSS variables to implement theme system:

```css
:root {
  --primary-color: #2563eb;
  --secondary-color: #1e40af;
  --accent-color: #f59e0b;
  /* ... */
}
```

### Modify Theme Colors

Edit `src/assets/main.css`:

```css
:root {
  --primary-color: #2563eb;    /* Primary color */
  --secondary-color: #1e40af;  /* Secondary color */
  --accent-color: #f59e0b;     /* Accent color */
}
```

Each `.vue` file has `<style scoped>`, which only affects the current component.

## Cloudflare Workers Configuration

### Configuration File Location

```
wrangler.toml  ← Main configuration file
```

### Configuration Content

```toml
name = "b2b-website"
main = "worker.js"
compatibility_date = "2025-01-01"

# D1 Database binding
[[d1_databases]]
binding = "DB"
database_name = "b2b_database"
database_id = "your-database-id"

# Environment variables
[vars]
ENVIRONMENT = "development"

# R2 Storage for images
[[r2_buckets]]
binding = "IMAGES"
bucket_name = "product-images"

[[kv_namespaces]]
binding = "STATIC_ASSETS"
id = "your-kv-namespace-id"

# Assets directory for serving the Vue3 SPA
[assets]
directory = "./dist"
```

### Worker Entry Point

`worker.js` uniformly handles API and frontend resources:

```javascript
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle API requests
    if (url.pathname.startsWith('/api/')) {
      return handleApiRequest(request, env);
    }

    // Serve Vue3 SPA assets
    return env.ASSETS.fetch(request);
  },
};
```

### Environment Variables Management

#### Method 1: wrangler.toml (Development)
```toml
[vars]
ENVIRONMENT = "development"
```

#### Method 2: Wrangler Secrets (Production - Recommended)
```bash
# Add secrets
wrangler secret put JWT_SECRET
wrangler secret put API_KEY

# List secrets
wrangler secret list

# Delete secret
wrangler secret delete SECRET_NAME
```

### Default Admin Accounts

After first deployment, use these credentials to login:

- **Super Admin**: 
  - Username: `admin123`
  - Password: `admin123`

- **Admin**: 
  - Username: `staff`
  - Password: `staff123`

⚠️ **Important**: Please change passwords immediately after first login!

## Deployment

### Frontend Deployment Options

1. **Cloudflare Pages**: 
   ```bash
   npm run build
   # Deploy dist directory to Cloudflare Pages
   ```

2. **Netlify/Vercel**: 
   - Connect GitHub repository
   - Set build command: `npm run build`
   - Set output directory: `dist`

3. **Static Server**: 
   - Deploy `dist` directory to any static file server

4. **Cloudflare Workers** (Recommended):
   ```bash
   # Build frontend
   npm run build
   
   # Deploy to Cloudflare
   npm run deploy
   ```

### Advantages of Integrated Architecture

Compared to separated frontend-backend architecture:

✅ **Single Deployment** - Frontend and backend deployed together to Cloudflare  
✅ **Lower Latency** - API and frontend on same edge node  
✅ **Simplified Operations** - Only manage one project  
✅ **Cost Optimization** - Share Cloudflare free tier  
✅ **Auto Scaling** - Cloudflare global CDN  

## Development Best Practices

1. **Componentization**: Keep components small and focused
2. **Composition API**: Use `<script setup>` syntax
3. **Reactivity**: Use `ref` and `reactive` appropriately
4. **Performance**: Use lazy-loaded routes and components
5. **Code Standards**: Follow Vue3 best practices

### Adding New Pages

1. **Create view component** - `src/views/NewPage.vue`
2. **Add route** - `src/router/index.js`:
   ```javascript
   {
     path: '/new-page',
     name: 'new-page',
     component: () => import('../views/NewPage.vue')
   }
   ```
3. **Add navigation link** - `src/components/Navbar.vue`

### Performance Optimization

- ✅ Route lazy loading (configured)
- ✅ Component on-demand import
- ✅ Image lazy loading
- ✅ Use `v-show` vs `v-if`
- ✅ Avoid unnecessary computations

### Commonly Used Packages

```bash
npm install lodash-es dayjs vee-validate vue-i18n
```

- `lodash-es` - Utility functions library
- `dayjs` - Date handling
- `vee-validate` - Form validation
- `vue-i18n` - Internationalization

## Troubleshooting

### Issue 1: Tags with side effect ignored in templates

**Error Message**:
```
Tags with side effect (<script> and <style>) are ignored in client component templates.
```

**Cause**: 
In Vue3, you cannot use `<style>` or `<script>` tags inside `<template>` tags. These tags must be placed outside the template as top-level elements of the component.

**Solution**:
Move `<style>` tags inside template to `<style scoped>` block at component bottom.

### Issue 2: Port Already in Use

**Error**: `Port 3000 is already in use`

**Solution**:
```javascript
// Modify vite.config.js
export default defineConfig({
  server: {
    port: 3001,  // Change to different port
  }
})
```

### Issue 3: API Request Failed

**Error**: `Network Error` or `404 Not Found`

**Checklist**:
1. Ensure backend is running (`npm run dev`)
2. Check backend address (default http://localhost:8787)
3. Verify proxy configuration in `vite.config.js`

### Issue 4: Dependency Installation Failed

**Error**: `npm install` reports errors

**Solution**:
```bash
# Clear cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue 5: Blank Page After Route Navigation

**Cause**: Component import path error

**Solution**: Check import paths in `router/index.js` are correct

### Debugging Tips

1. **Vue DevTools** - Install browser extension
2. **Console.log** - Print data in components
3. **Network Tab** - Check API requests
4. **Vite Error Overlay** - View compilation errors

## Quick Reference

### Common Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build production version
npm run preview  # Preview production build
```

### Reactive Data

```javascript
import { ref, reactive } from 'vue'

const count = ref(0)           // Primitive type
const user = reactive({        // Object
  name: 'John',
  age: 30
})
```

### Computed Properties

```javascript
import { computed } from 'vue'

const doubleCount = computed(() => count.value * 2)
```

### Lifecycle Hooks

```javascript
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  // Execute after component mounted
})
```

### Responsive Design

Use CSS media queries:

```css
@media (max-width: 768px) {
  /* Mobile styles */
}
```

## Future Improvements

- [ ] Add refund functionality
- [ ] Implement payment statistics reports
- [ ] Support more payment methods
- [ ] Add subscription payments
- [ ] Implement split payment functionality
- [ ] Payment security audit
- [ ] Add product review system
- [ ] Multi-language support
- [ ] Optimize SEO (SSR or pre-rendering)
- [ ] Add unit tests
- [ ] Implement product comparison feature
- [ ] Add shopping cart functionality

## License

MIT License

---

**Last Updated**: 2026-05-20  
**Version**: 2.0.0  
**Status**: ✅ Completed integration and testing