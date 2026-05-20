# Vue3 B2B 网站 - 快速参考

## 📁 目录结构

```
frontend/
├── src/
│   ├── assets/          # 全局样式和图片资源
│   │   └── main.css     # 主样式文件（CSS变量、全局样式）
│   ├── components/      # 可复用组件
│   │   ├── Navbar.vue   # 导航栏
│   │   ├── Footer.vue   # 页脚
│   │   └── ProductCard.vue  # 产品卡片
│   ├── stores/          # Pinia 状态管理
│   │   ├── products.js  # 产品数据和方法
│   │   └── settings.js  # 网站设置
│   ├── views/           # 页面视图
│   │   ├── HomeView.vue           # 首页
│   │   ├── ProductsView.vue       # 产品列表
│   │   ├── ProductDetailView.vue  # 产品详情
│   │   ├── AboutView.vue          # 关于我们
│   │   ├── ContactView.vue        # 联系我们
│   │   ├── AdminLoginView.vue     # 管理员登录
│   │   └── AdminDashboardView.vue # 管理后台
│   ├── router/          # 路由配置
│   │   └── index.js     # 定义所有路由和守卫
│   ├── utils/           # 工具函数
│   │   └── api.js       # Axios API 客户端
│   ├── App.vue          # 根组件（包含 Navbar 和 Footer）
│   └── main.js          # 应用入口
├── index.html           # HTML 模板
├── vite.config.js       # Vite 配置
└── package.json         # 依赖和脚本
```

## 🔧 常用命令

```bash
npm run dev      # 启动开发服务器 (http://localhost:3000)
npm run build    # 构建生产版本
npm run preview  # 预览生产构建
```

## 🎨 修改样式

### 主题颜色

编辑 `src/assets/main.css`:

```css
:root {
  --primary-color: #2563eb;    /* 主色调 */
  --secondary-color: #1e40af;  /* 次要色 */
  --accent-color: #f59e0b;     /* 强调色 */
}
```

### 组件样式

每个 `.vue` 文件都有 `<style scoped>`，只影响当前组件。

## 📝 添加新页面

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

## 🔌 使用 Store

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

## 🌐 API 调用

```vue
<script setup>
import api from '../utils/api'

// GET 请求
const response = await api.get('/products')

// POST 请求
const response = await api.post('/products', { name: 'New Product' })
</script>
```

## 🎯 关键概念

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

### 生命周期

```javascript
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  // 组件挂载后执行
})
```

## 📦 安装新依赖

```bash
npm install package-name
```

常用包推荐：
- `lodash-es` - 工具函数库
- `dayjs` - 日期处理
- `vee-validate` - 表单验证
- `vue-i18n` - 国际化

## 🐛 调试技巧

1. **Vue DevTools** - 安装浏览器扩展
2. **Console.log** - 在组件中打印数据
3. **Network Tab** - 检查 API 请求
4. **Vite Error Overlay** - 查看编译错误

## 🚀 性能优化

- ✅ 路由懒加载（已配置）
- ✅ 组件按需导入
- ✅ 图片懒加载
- ✅ 使用 `v-show` vs `v-if`
- ✅ 避免不必要的计算

## 📱 响应式设计

使用 CSS 媒体查询：

```css
@media (max-width: 768px) {
  /* 移动端样式 */
}
```

## 🔐 认证相关

Token 存储在 `localStorage`:

```javascript
// 获取 token
const token = localStorage.getItem('admin_token')

// 清除 token（登出）
localStorage.removeItem('admin_token')
```

## 📞 常见问题

**Q: 如何修改端口？**  
A: 编辑 `vite.config.js` 中的 `server.port`

**Q: 如何代理其他 API？**  
A: 在 `vite.config.js` 的 `server.proxy` 中添加

**Q: 构建后路径不对？**  
A: 检查 `vite.config.js` 中的 `build.outDir`

**Q: 如何清除缓存？**  
A: 硬刷新 (Ctrl+Shift+R) 或清除浏览器缓存

---

更多详细信息请查看 [README.md](README.md)
