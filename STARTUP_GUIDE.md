# 🚀 项目启动指南

## 问题说明
项目出现空白页面的原因是：
1. Mock 服务器未正确启动
2. API 请求失败导致页面阻塞
3. 错误处理不当

## 已修复的问题

### 1. ✅ Vite 配置优化
- 开发模式下自动启用 Mock 服务器
- 添加明确的端口配置（8787）

### 2. ✅ Settings Store 增强
- 设置默认值（即使 API 失败也能显示）
- 添加初始化状态追踪
- 防止重复加载

### 3. ✅ Products Store 改进
- API 失败时不抛出异常
- 使用空列表作为降级方案

### 4. ✅ API 客户端优化
- 添加 5 秒超时设置
- 网络错误静默处理
- 返回降级数据而非阻塞页面

## 🎯 启动步骤

### 方式一：使用 Mock 数据（推荐）

```bash
# 1. 安装依赖（如果还没安装 vue-i18n）
npm install

# 2. 启动开发服务器
npm run dev

# 3. 打开浏览器访问
http://localhost:3000
```

### 方式二：明确启用 Mock

```bash
# 明确指定使用 Mock 数据
USE_MOCK=true npm run dev
```

## ✅ 验证清单

启动后应该看到：
- ✅ 页面正常显示（不是空白）
- ✅ 导航栏显示 "GlobalMart"
- ✅ Hero 区域有标题和描述
- ✅ "Featured Products" 区域显示产品卡片
- ✅ Footer 显示完整信息

## 🔍 调试信息

如果页面仍然空白，请检查：

### 1. 浏览器控制台
按 F12 打开开发者工具，查看是否有错误：
- 应该看到：`🎭 Mock server listening on http://localhost:8787`
- 应该看到：`✅ Mock server enabled`

### 2. 网络请求
在 Network 标签中：
- `/api/settings` 应该返回 200
- `/api/products/featured` 应该返回 200

### 3. 端口占用
如果 8787 端口被占用，终端会提示：
```
❌ Port 8787 is already in use!
```

解决方法：
```bash
# 查找占用端口的进程
lsof -ti:8787

# 杀掉进程
lsof -ti:8787 | xargs kill -9
```

## 📝 Mock 数据说明

项目包含完整的 Mock 数据：
- ✅ 6 个精选产品
- ✅ 网站设置（GlobalMart）
- ✅ 联系信息
- ✅ 社交媒体链接

##  页面功能

首页应该显示：
1. **Hero 区域** - 大标题和描述
2. **公司介绍** - About Our Company
3. **特色功能** - Why Choose Us（4个卡片）
4. **精选产品** - Featured Products（6个产品卡片）
5. **CTA 区域** - 行动号召
6. **Footer** - 页脚信息

## 🆘 常见问题

### Q: 页面仍然空白？
A: 请确保：
1. 已运行 `npm install`
2. Mock 服务器正常启动（查看终端输出）
3. 清除浏览器缓存（Ctrl+Shift+R）

### Q: 产品列表为空？
A: 检查 Network 标签中 `/api/products/featured` 的响应

### Q: 如何查看 Mock 数据？
A: 查看 `mock/data.js` 文件

## 📞 技术支持

如果问题仍未解决，请提供：
1. 浏览器控制台的完整错误信息
2. 终端的启动日志
3. Network 标签中的 API 请求状态
