# 🚀 完整后端部署方案（Vercel + PostgreSQL）

## 完整部署步骤（10分钟）

### 步骤 1：将代码推送到 GitHub

```bash
cd e:\临时\fuxi

# 提交所有更改
git add .
git commit -m "Final: Medical Exam Platform with Backend"

# 1. 如果还没有 GitHub 仓库：
#    访问 https://github.com/new 创建仓库（名为 medical-exam-platform）

# 2. 添加远程仓库并推送（替换 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/medical-exam-platform.git
git push -u origin main
```

---

### 步骤 2：创建免费的 PostgreSQL 数据库（Neon）

1. **访问** https://neon.tech
2. **点击** "Sign in with GitHub"
3. **创建新项目**：
   - Project Name: `medical-exam-db`
   - Region: 选择您最近的区域（如 `Singapore`）
   - Postgres version: 默认即可
4. **点击** "Create Project"
5. **复制连接字符串**：
   - 在 Dashboard 上，点击 "Connection Details"
   - 选择 "Connection String"
   - 复制完整的字符串（格式类似）：
     ```
     postgresql://user:password@ep-xxx-xxx-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
     ```
   - **保存这个字符串！**

---

### 步骤 3：部署到 Vercel（含后端）

1. **访问** https://vercel.com
2. **点击** "Add New" → "Project"
3. **选择仓库**：找到 `medical-exam-platform` 并点击 "Import"
4. **配置项目**：
   - **Project Name**: `medical-exam-platform` (默认即可)
   - **Root Directory**: 保持默认 `./`
   - **Framework Preset**: 选择 `Other`
5. **添加环境变量**（在 Environment Variables 部分）：

   | 变量名 | 值 |
   |--------|-----|
   | `DATABASE_URL` | 粘贴刚才从 Neon 复制的连接字符串 |
   | `JWT_SECRET` | 输入任意长随机字符串（例如：`my-super-secret-jwt-key-2024-change-this`） |

   **重要**：确保勾选所有环境（Production、Preview、Development）
6. **点击** "Deploy"
7. **等待 1-2 分钟**，部署完成！

---

### 步骤 4：测试您的应用

1. **访问部署地址**（Vercel 会显示类似 `https://medical-exam-platform-xxxxx.vercel.app`）
2. **测试功能**：
   - ✓ 注册新账号
   - ✓ 登录
   - ✓ 开始考试
   - ✓ 查看错题
   - ✓ 数据自动保存

---

## 📋 已准备好的文件

✅ **[package.json](file:///e:/临时/fuxi/package.json)** - 依赖配置（包含 pg）  
✅ **[vercel.json](file:///e:/临时/fuxi/vercel.json)** - Vercel 部署配置  
✅ **[api/vercel-api.js](file:///e:/临时/fuxi/api/vercel-api.js)** - 完整后端 API（Serverless）  
✅ **[api/db.js](file:///e:/临时/fuxi/api/db.js)** - 数据库操作  
✅ **[app.js](file:///e:/临时/fuxi/app.js)** - 前端（已配置 API 地址）  
✅ **[README.md](file:///e:/临时/fuxi/README.md)** - 完整项目文档  

---

## 🔍 验证部署是否成功

### 检查 1：健康检查
访问：
```
https://your-app.vercel.app/api/health
```
应该看到：`{"status":"ok","message":"服务运行正常"}`

### 检查 2：API 日志
在 Vercel Dashboard 中：
- 点击您的项目
- 选择 "Functions" 标签
- 查看 "Log" 部分是否有错误

### 检查 3：数据库连接
尝试在应用中注册新用户，应该能成功！

---

## 🛠️ 如果遇到问题

### 问题 1：数据库连接失败
```
解决：检查 DATABASE_URL 是否包含 ?sslmode=require
确认 Neon 数据库正在运行（查看 Neon Dashboard）
```

### 问题 2：API 500 错误
```
解决：查看 Vercel Functions 的日志
检查环境变量是否都设置了
```

### 问题 3：前端 404
```
解决：检查 vercel.json 中的路由配置
确认所有文件都在根目录
```

---

## 📖 更多详细文档

查看以下文件获取更多信息：
- [QUICK_DEPLOY.md](file:///e:/临时/fuxi/QUICK_DEPLOY.md) - 5分钟快速部署
- [DEPLOYMENT_GUIDE.md](file:///e:/临时/fuxi/DEPLOYMENT_GUIDE.md) - 详细说明
- [DEPLOYMENT_CHECKLIST.md](file:///e:/临时/fuxi/DEPLOYMENT_CHECKLIST.md) - 检查清单

---

## ✨ 部署成功后

您现在拥有了：
- ✓ 完整的医学考试平台
- ✓ 用户认证系统
- ✓ 错题记录功能
- ✓ 数据云端同步
- ✓ 免费部署（Vercel Hobby + Neon Free）

**分享给您的朋友吧！** 🎉
