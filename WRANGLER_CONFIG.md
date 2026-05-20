# Wrangler 配置整合说明

## ✅ 配置整合完成

原有的 `wrangler.toml` 配置文件已成功整合到 `frontend` 目录中。

## 📁 配置文件位置

### 新位置（当前使用）
```
frontend/wrangler.toml  ← 主要配置文件
```

### 旧位置（已废弃）
```
wrangler.toml  ← 根目录的旧配置，不再使用
```

## 🔧 配置内容

`frontend/wrangler.toml` 包含完整的 Cloudflare Workers 配置：

```toml
name = "b2b-website"
main = "worker.js"
compatibility_date = "2025-01-01"

# D1 Database binding
[[d1_databases]]
binding = "DB"
database_name = "b2b_database"
database_id = "5e2e1192-2772-4a63-aa5e-3afb8d2ae09b"

# Environment variables
[vars]
ENVIRONMENT = "development"

# R2 Storage for images
[[r2_buckets]]
binding = "IMAGES"
bucket_name = "product-images"

[[kv_namespaces]]
binding = "STATIC_ASSETS"
id = "ebdc3ec82b3a4953bbd98053247b3fb1"

# Assets directory for serving the Vue3 SPA
[assets]
directory = "./dist"
```

## 🚀 使用方法

### 从根目录运行（推荐）

所有命令都已更新为指向 frontend 目录：

```bash
# 在项目根目录执行

# 启动开发服务器
npm run dev

# 启动前端开发服务器
npm run dev:frontend

# 同时启动前后端
npm run dev:all

# 构建前端
npm run build:frontend

# 部署到 Cloudflare
npm run deploy
```

### 从 frontend 目录运行

```bash
cd frontend

# 启动 Workers 开发服务器
npm run worker:dev

# 部署 Workers
npm run worker:deploy

# 构建前端
npm run build

# 启动前端开发服务器
npm run dev
```

## 📝 配置说明

### 主要配置项

1. **name**: Workers 项目名称
2. **main**: 入口文件 (`worker.js`)
3. **compatibility_date**: 兼容性日期

### 资源绑定

#### D1 数据库
```toml
[[d1_databases]]
binding = "DB"
database_name = "b2b_database"
database_id = "your-database-id"
```

#### R2 存储桶
```toml
[[r2_buckets]]
binding = "IMAGES"
bucket_name = "product-images"
```

#### KV 命名空间
```toml
[[kv_namespaces]]
binding = "STATIC_ASSETS"
id = "your-kv-namespace-id"
```

#### 静态资源
```toml
[assets]
directory = "./dist"
```
这会告诉 Workers 从 `dist` 目录提供 Vue3 构建的静态文件。

## ⚙️ 环境变量管理

### 方式 1: wrangler.toml (开发环境)
```toml
[vars]
ENVIRONMENT = "development"
```

### 方式 2: Wrangler Secrets (生产环境 - 推荐)
```bash
cd frontend

# 添加密钥
wrangler secret put JWT_SECRET
wrangler secret put API_KEY

# 查看密钥列表
wrangler secret list

# 删除密钥
wrangler secret delete SECRET_NAME
```

## 🔄 迁移步骤（已完成）

1. ✅ 创建 `frontend/wrangler.toml`
2. ✅ 更新入口文件为 `worker.js`
3. ✅ 添加 assets 配置
4. ✅ 更新根目录 package.json 脚本
5. ✅ 所有命令指向 frontend 目录

## 📋 检查清单

在部署前确认：

- [ ] D1 数据库 ID 正确
- [ ] R2 存储桶已创建
- [ ] KV 命名空间 ID 正确
- [ ] JWT Secret 已设置（使用 secrets）
- [ ] 数据库 schema 已初始化
- [ ] 前端已构建 (`npm run build`)

## 🐛 常见问题

### Q1: 找不到 wrangler.toml

**解决**: 确保在 `frontend` 目录下运行 wrangler 命令，或使用根目录的 npm scripts。

### Q2: 数据库连接失败

**解决**: 
1. 检查 `database_id` 是否正确
2. 确认数据库已初始化
3. 运行 `wrangler d1 execute b2b_database --file=../schema/schema.sql`

### Q3: 静态资源 404

**解决**:
1. 确保已运行 `npm run build`
2. 检查 `dist` 目录是否存在
3. 验证 `[assets]` 配置中的路径

### Q4: 环境变量未生效

**解决**:
1. 开发环境：检查 `wrangler.toml` 中的 `[vars]`
2. 生产环境：使用 `wrangler secret put` 设置

## 📚 相关文档

- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)
- [D1 数据库文档](https://developers.cloudflare.com/d1/)
- [R2 存储文档](https://developers.cloudflare.com/r2/)
- [KV 存储文档](https://developers.cloudflare.com/kv/)

## 💡 最佳实践

1. **不要提交敏感信息到 Git**
   - 使用 Wrangler Secrets 管理密钥
   - 将 wrangler.toml 中的敏感值替换为占位符

2. **区分开发和生产配置**
   ```toml
   # 开发环境
   [vars]
   ENVIRONMENT = "development"
   
   # 生产环境使用不同的配置
   [env.production]
   ENVIRONMENT = "production"
   ```

3. **定期备份配置**
   - 保存 database_id 和 kv namespace id
   - 记录所有 secrets

4. **使用 .env 文件（可选）**
   ```bash
   # frontend/.env
   VITE_API_URL=http://localhost:8787
   ```

---

**配置整合日期**: 2026-05-20  
**状态**: ✅ 已完成  
**下一步**: 运行 `npm run dev` 测试配置
