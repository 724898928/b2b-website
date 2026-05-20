# B2B Product Exhibition - Vue3 Frontend

这是一个基于Vue3的B2B产品展示网站前端应用。

## 技术栈

- **Vue 3** - 渐进式JavaScript框架
- **Vue Router** - 官方路由管理器
- **Pinia** - Vue状态管理库
- **Axios** - HTTP客户端
- **Vite** - 下一代前端构建工具

## 项目结构

```
frontend/
├── src/
│   ├── assets/          # 静态资源
│   │   └── main.css     # 全局样式
│   ├── components/      # 可复用组件
│   │   ├── Navbar.vue
│   │   ├── Footer.vue
│   │   └── ProductCard.vue
│   ├── stores/          # Pinia状态管理
│   │   ├── settings.js  # 网站设置store
│   │   └── products.js  # 产品store
│   ├── utils/           # 工具函数
│   │   └── api.js       # API客户端配置
│   ├── views/           # 页面视图
│   │   ├── HomeView.vue
│   │   ├── ProductsView.vue
│   │   ├── ProductDetailView.vue
│   │   ├── AboutView.vue
│   │   ├── ContactView.vue
│   │   ├── AdminLoginView.vue
│   │   └── AdminDashboardView.vue
│   ├── router/          # 路由配置
│   │   └── index.js
│   ├── App.vue          # 根组件
│   └── main.js          # 入口文件
├── index.html           # HTML模板
├── vite.config.js       # Vite配置
└── package.json         # 项目依赖
```

## 安装和运行

### 1. 安装依赖

```bash
cd frontend
npm install
```

### 2. 开发模式

首先启动Cloudflare Workers后端（在项目根目录）：

```bash
cd ..
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

### 后台管理
- ✅ 管理员登录认证
- ✅ 产品管理（增删改查）
- ✅ 网站设置管理
- ✅ 图片URL管理
- ✅ 产品分类和标签

## API集成

前端通过Axios与后端API通信，所有API请求都经过统一的拦截器处理：

- 自动添加认证token
- 统一错误处理
- 401自动跳转登录

## 状态管理

使用Pinia进行状态管理：

- **settings store**: 管理网站设置（名称、描述、联系方式等）
- **products store**: 管理产品数据和操作

## 路由保护

管理后台路由需要认证：

```javascript
{
  path: '/admin/dashboard',
  meta: { requiresAuth: true }
}
```

未认证的访问会被重定向到登录页面。

## 样式系统

使用CSS变量实现主题系统：

```css
:root {
  --primary-color: #2563eb;
  --secondary-color: #1e40af;
  --accent-color: #f59e0b;
  ...
}
```

## 注意事项

1. **开发环境**: 确保Cloudflare Workers后端正在运行
2. **API代理**: Vite配置中已设置API代理到后端
3. **认证Token**: 登录后token存储在localStorage中
4. **图片处理**: 目前使用外部URL，可以集成上传功能

## 部署

### 前端部署选项

1. **Cloudflare Pages**: 
   ```bash
   npm run build
   # 将 dist 目录部署到 Cloudflare Pages
   ```

2. **Netlify/Vercel**: 
   - 连接GitHub仓库
   - 设置构建命令: `cd frontend && npm run build`
   - 设置输出目录: `frontend/dist`

3. **静态服务器**: 
   - 将 `dist` 目录部署到任何静态文件服务器

## 开发建议

1. **组件化**: 保持组件小而专注
2. **组合式API**: 使用 `<script setup>` 语法
3. **响应式**: 合理使用 `ref` 和 `reactive`
4. **性能**: 使用懒加载路由和组件
5. **代码规范**: 遵循Vue3最佳实践

## 后续改进

- [ ] 添加图片上传功能
- [ ] 实现产品评论系统
- [ ] 添加多语言支持
- [ ] 优化SEO（SSR或预渲染）
- [ ] 添加单元测试
- [ ] 实现产品对比功能
- [ ] 添加购物车功能

## 许可证

MIT License
