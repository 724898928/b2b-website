# 国际化(i18n)实施指南

## 已完成的工作

✅ 已安装 vue-i18n 包
✅ 已创建 i18n 配置文件 (src/i18n/index.js)
✅ 已创建中英文语言包 (src/i18n/locales/en.json, zh.json)
✅ 已在 main.js 中集成 i18n
✅ 已在 Navbar.vue 中添加语言切换功能
✅ 已在 AdminDashboardView 中部分更新国际化

## 需要手动完成的国际化

由于 AdminDashboardView.vue 文件较大（1260行），以下是需要国际化的关键部分：

### 1. Overview 页面 (第 41-100 行)
```vue
<!-- 需要替换的文本 -->
<h3 class="stat-label">Total Products</h3>
<!-- 改为 -->
<h3 class="stat-label">{{ t('admin.dashboard.overview.totalProducts') }}</h3>

<h3 class="stat-label">Total Inquiries</h3>
<!-- 改为 -->
<h3 class="stat-label">{{ t('admin.dashboard.overview.totalInquiries') }}</h3>

<h3 class="stat-label">Pending Inquiries</h3>
<!-- 改为 -->
<h3 class="stat-label">{{ t('admin.dashboard.overview.pendingInquiries') }}</h3>

<h2 class="section-title">Recent Inquiries</h2>
<!-- 改为 -->
<h2 class="section-title">{{ t('admin.dashboard.overview.recentInquiries') }}</h2>

<p>No recent inquiries</p>
<!-- 改为 -->
<p>{{ t('admin.dashboard.overview.noRecentInquiries') }}</p>
```

### 2. Products 页面 (第 102-155 行)
```vue
<h2 class="section-title">Manage Products</h2>
<!-- 改为 -->
<h2 class="section-title">{{ t('admin.dashboard.products.manageProducts') }}</h2>

<button>+ Add Product</button>
<!-- 改为 -->
<button>{{ t('admin.dashboard.products.addProduct') }}</button>

<p>Loading products...</p>
<!-- 改为 -->
<p>{{ t('common.loading') }}</p>

<p>No products found...</p>
<!-- 改为 -->
<p>{{ t('admin.dashboard.products.noProducts') }}</p>
```

### 3. Inquiries 页面 (第 157-213 行)
类似 Products 页面的处理方式

### 4. Settings 页面 (第 215-309 行)
```vue
<h2 class="section-title">Website Settings</h2>
<!-- 改为 -->
<h2 class="section-title">{{ t('admin.dashboard.settings.websiteSettings') }}</h2>

<h3 class="settings-section-title">Basic Information</h3>
<!-- 改为 -->
<h3 class="settings-section-title">{{ t('admin.dashboard.settings.basicInfo') }}</h3>
```

### 5. 产品表单 Modal (第 311-365 行)
```vue
<h2 class="modal-title">{{ editingProduct ? 'Edit Product' : 'Add New Product' }}</h2>
<!-- 改为 -->
<h2 class="modal-title">{{ editingProduct ? t('admin.dashboard.productForm.editTitle') : t('admin.dashboard.productForm.addTitle') }}</h2>
```

## 关键修改点

### 1. 添加 i18n 导入（在 script setup 开头）
```javascript
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
```

### 2. 将 navItems 改为 computed
```javascript
const navItems = computed(() => [
  { id: 'overview', label: t('admin.dashboard.nav.overview'), icon: '📊' },
  // ...其他项
])
```

### 3. 更新 handleLogout 确认消息
```javascript
const handleLogout = () => {
  if (confirm(t('admin.dashboard.logoutConfirm'))) {
    localStorage.removeItem('admin_token')
    router.push('/admin')
  }
}
```

## 其他需要国际化的页面

### HomeView.vue
- 首页标题、副标题
- 精选产品部分
- 为什么选择我们部分

### ProductsView.vue
- 页面标题
- 搜索框占位符
- 分类筛选标签
- 空状态提示

### ProductDetailView.vue
- 产品详情标签
- 规格、描述等标题
- 相关产品部分

### ContactView.vue
- 表单标签
- 提交按钮
- 成功/错误消息

### AboutView.vue
- 公司介绍内容
- 使命、愿景、价值观

## 测试国际化

1. 启动开发服务器：`npm run dev`
2. 访问网站，在导航栏切换语言
3. 检查所有文本是否正确切换
4. 测试管理员面板的所有功能

## 语言包扩展

如需添加更多语言：
1. 在 `src/i18n/locales/` 创建新文件（如 `ja.json`）
2. 复制 en.json 的结构并翻译
3. 在 `src/i18n/index.js` 中导入新语言
4. 在 Navbar.vue 的语言选择器中添加新选项

## 注意事项

- 所有用户可见的文本都应该使用 `t()` 函数
- 保持翻译键的命名一致性
- 对于动态内容（如产品名称），不需要翻译
- 状态值（pending/processing/completed）已在语言包中定义
- 使用 `t('key', { name: value })` 进行插值
