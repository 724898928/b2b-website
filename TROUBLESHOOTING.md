# 常见问题解答 (FAQ)

## 🐛 已修复的问题

### 问题 1: Tags with side effect (<script> and <style>) are ignored in client component templates

**错误信息**:
```
Tags with side effect (<script> and <style>) are ignored in client component templates.
```

**原因**: 
在 Vue3 中，不能在 `<template>` 标签内部使用 `<style>` 或 `<script>` 标签。这些标签必须放在模板外部，作为组件的顶级元素。

**错误示例**:
```vue
<template>
  <div>
    <h1>Hello</h1>
    <style>
      .title { color: red; }
    </style>
  </div>
</template>
```

**正确做法**:
```vue
<template>
  <div>
    <h1 class="title">Hello</h1>
  </div>
</template>

<script setup>
// JavaScript 代码
</script>

<style scoped>
.title {
  color: red;
}
</style>
```

**修复位置**: `frontend/src/views/HomeView.vue`

**解决方案**:
将模板内的 `<style>` 标签移动到组件底部的 `<style scoped>` 块中。

---

## 💡 Vue3 组件结构规范

### 正确的单文件组件 (SFC) 结构

```vue
<template>
  <!-- HTML 模板 - 只能包含 HTML 和 Vue 指令 -->
  <div class="component">
    <h1>{{ title }}</h1>
  </div>
</template>

<script setup>
// JavaScript/TypeScript 代码
import { ref } from 'vue'

const title = ref('Hello')
</script>

<style scoped>
/* CSS 样式 */
.component {
  padding: 20px;
}
</style>
```

### 重要规则

1. **`<template>`** - 只能包含 HTML 和 Vue 模板语法
   - ✅ HTML 元素
   - ✅ Vue 指令 (v-if, v-for, etc.)
   - ✅ 插值表达式 {{ }}
   - ❌ `<script>` 标签
   - ❌ `<style>` 标签

2. **`<script setup>`** - JavaScript/TypeScript 逻辑
   - 导入语句
   - 响应式数据定义
   - 函数和方法
   - 生命周期钩子

3. **`<style scoped>`** - 组件样式
   - CSS 规则
   - 媒体查询
   - CSS 变量

---

## 🔍 其他常见问题

### 问题 2: 端口被占用

**错误**: `Port 3000 is already in use`

**解决**:
```javascript
// 修改 frontend/vite.config.js
export default defineConfig({
  server: {
    port: 3001,  // 改为其他端口
  }
})
```

### 问题 3: API 请求失败

**错误**: `Network Error` 或 `404 Not Found`

**检查清单**:
1. 确保后端正在运行 (`npm run dev`)
2. 检查后端地址是否正确 (默认 http://localhost:8787)
3. 验证 `vite.config.js` 中的代理配置

### 问题 4: 依赖安装失败

**错误**: `npm install` 报错

**解决**:
```bash
# 清除缓存
npm cache clean --force

# 删除 node_modules
rm -rf node_modules package-lock.json
rm -rf frontend/node_modules frontend/package-lock.json

# 重新安装
npm install
cd frontend && npm install
```

### 问题 5: 路由跳转后页面空白

**原因**: 组件导入路径错误

**解决**: 检查 `router/index.js` 中的导入路径是否正确

---

## 📚 学习资源

- [Vue3 官方文档](https://vuejs.org/guide/introduction.html)
- [Vue SFC 规范](https://vuejs.org/api/sfc-spec.html)
- [Vite 配置指南](https://vitejs.dev/config/)
- [Vue Router 文档](https://router.vuejs.org/)

---

## 🆘 获取帮助

如果遇到问题：

1. 检查浏览器控制台错误信息
2. 查看终端输出的错误日志
3. 阅读相关文档
4. 搜索错误信息
5. 检查文件路径和拼写

---

**最后更新**: 2026-05-20
