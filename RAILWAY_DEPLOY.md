# 🚂 Railway 完整部署指南

## 为什么选择 Railway？

✅ **操作简单** - 图形界面，直观易用  
✅ **自带数据库** - PostgreSQL 直接集成  
✅ **免费额度** - 每月 500 小时，足够个人使用  
✅ **支持后端** - 完整 Node.js 环境  
✅ **自动部署** - 连接 GitHub 后自动更新  

---

## 📋 完整部署步骤（10分钟）

### 步骤 1：将代码推送到 GitHub（如果还没推送）

在终端执行：
```bash
cd e:\临时\fuxi
git add .
git commit -m "Medical Exam Platform - Railway Ready"
git push origin main
```

---

### 步骤 2：注册 Railway 账号

1. **访问** https://railway.app
2. **点击** "Sign Up"
3. **选择** "Continue with GitHub"（推荐）
4. **授权** Railway 访问您的 GitHub 仓库
5. **完成** 注册

---

### 步骤 3：创建新项目

1. **登录** Railway Dashboard
2. **点击** "New Project" 按钮（右上角）
3. **选择** "Deploy from GitHub repo"
4. **查找**您的仓库 `fenxi-exam`
5. **点击** "Deploy"

---

### 步骤 4：添加 PostgreSQL 数据库

1. **在项目面板中**，点击 "Add a database"
2. **选择** "PostgreSQL"
3. **Railway 自动创建**数据库
4. **等待创建完成**（约 30 秒）
5. **点击** PostgreSQL 服务
6. **复制** "Connection URL"（格式：`postgres://user:password@host:port/dbname`）

---

### 步骤 5：配置环境变量

1. **返回**项目主面板
2. **点击**您的后端服务（显示为 GitHub 仓库名）
3. **选择** "Variables" 标签
4. **添加以下变量**：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `DATABASE_URL` | 从步骤 4 复制的连接 URL | **必需！** |
| `JWT_SECRET` | `your-secret-key-change-me-2024` | 任意随机字符串 |
| `PORT` | `3001` | 后端端口 |

**提示**： Railway 会自动设置 `PORT` 环境变量，但您可以手动确认。

---

### 步骤 6：等待部署完成

Railway 会自动：
1. 安装依赖（`npm install`）
2. 构建项目
3. 启动后端服务

**部署时间**：约 2-3 分钟

---

### 步骤 7：获取访问地址

1. **点击**您的服务
2. **在 "Settings"** 中查看
3. **找到** "Networking" → "Public Networking"
4. **点击** "Generate Domain"
5. **复制**生成的域名（例如：`your-app.railway.app`）

**您的后端地址**：`https://your-app.railway.app`

---

## 🌐 前端部署

### 方案 A：部署前端到 Railway（推荐）

Railway 也可以托管静态网站！

1. **在 Railway 中添加新服务**
2. **选择** "Empty Service"
3. **上传** `index.html`, `app.js`, `style.css` 等文件
4. **或者**连接另一个 GitHub 仓库存放前端代码

### 方案 B：使用 Netlify（最简单）

1. **访问** https://netlify.com
2. **注册/登录**
3. **拖拽**您的 HTML/CSS/JS 文件到页面
4. **完成！** 自动生成免费域名

### 方案 C：Vercel（如果能登录）

参考 [FINAL_DEPLOY.md](file:///e:/临时/fuxi/FINAL_DEPLOY.md) 的前端部分

---

## ⚙️ 配置修改

### 更新前端 API 地址

如果您的后端部署在其他地方，修改 `app.js` 中的 API 地址：

```javascript
// 找到 app.js 中的这行，改为您的 Railway 后端地址
const API_BASE_URL = 'https://your-app.railway.app';
```

---

## 🔍 验证部署成功

### 1. 测试健康检查
访问：`https://your-app.railway.app/api/health`

应该看到：
```json
{"status":"ok","message":"服务运行正常"}
```

### 2. 测试注册
发送 POST 请求到：
```
https://your-app.railway.app/api/register
Content-Type: application/json

{"username":"test","password":"123456"}
```

应该看到：
```json
{"success":true,"message":"注册成功",...}
```

---

## 🛠️ 常见问题

### 问题 1：数据库连接失败
```
检查：
1. DATABASE_URL 是否正确复制
2. PostgreSQL 服务是否正在运行
3. Railway 日志中的具体错误信息
```

### 问题 2：部署失败
```
解决：
1. 查看 "Deployments" 标签页的日志
2. 检查 railway.json 配置
3. 确保 package.json 正确
```

### 问题 3：后端无法访问
```
检查：
1. Public Networking 是否已启用
2. 端口是否正确配置
3. 防火墙设置
```

### 问题 4：前端无法连接后端
```
解决：
1. 修改 app.js 中的 API_BASE_URL
2. 确保后端 CORS 配置正确
3. 检查浏览器控制台错误
```

---

## 📊 Railway 免费额度

| 资源 | 免费额度 |
|------|---------|
| **计算时间** | 500 小时/月 |
| **存储** | 1 GB |
| **带宽** | 100 GB/月 |
| **数据库** | 1 个 PostgreSQL |

**个人使用完全足够！**

---

## 🚀 快速参考

### Railway Dashboard
https://railway.app/dashboard

### 项目链接
https://github.com/Zhao109304/fenxi-exam

### Railway 文档
- 快速开始：https://docs.railway.app/getting-started
- PostgreSQL：https://docs.railway.app/databases/postgresql
- 部署：https://docs.railway.app/deploy/deployments

---

## ✨ 部署成功后的功能

✅ **完整用户系统** - 注册/登录  
✅ **在线考试** - 3个科目  
✅ **错题管理** - 自动收集复习  
✅ **数据云端同步** - PostgreSQL 存储  
✅ **精美界面** - 现代化 UI  

---

**有任何问题，随时告诉我！** 🎉
