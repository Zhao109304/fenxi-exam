# 医学考试平台 - Vercel 部署指南

本指南将帮助您将医学考试平台部署到 Vercel。

## 准备工作

### 1. 检查 Vercel 账号
确保您已经拥有 Vercel 账号（免费注册：https://vercel.com）

### 2. 创建 GitHub 仓库

#### 如果您还没有 GitHub 仓库：

1. 登录 GitHub（https://github.com）
2. 点击右上角的 "+" 按钮，选择 "New repository"
3. 填写仓库名称（如：`medical-exam-platform`）
4. 选择 "Private" 或 "Public"
5. 点击 "Create repository"

#### 初始化本地仓库并推送：

```bash
# 进入项目目录
cd e:\临时\fuxi

# 初始化 Git（如果还没有）
git init

# 添加所有文件（排除 node_modules 等）
git add .

# 提交更改
git commit -m "feat: 医学考试平台初始版本"

# 添加远程仓库（将 YOUR_USERNAME 和 YOUR_REPO 替换为您的 GitHub 用户名和仓库名）
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# 推送到 GitHub
git push -u origin main
```

## 部署到 Vercel

### 方法一：通过 Vercel 网站部署（推荐）

1. **登录 Vercel**
   - 访问 https://vercel.com
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "Add New" → "Project"
   - 选择您刚创建的 GitHub 仓库
   - Vercel 会自动检测项目类型

3. **配置项目**
   - **Framework Preset**: 选择 "Other"
   - **Root Directory**: 保持默认（`.`）
   - **Build Command**: 留空
   - **Output Directory**: 保持默认（`.`）

4. **环境变量**（可选）
   - 如果需要配置环境变量，点击 "Environment Variables"
   - 添加 `JWT_SECRET` 等变量

5. **部署**
   - 点击 "Deploy"
   - 等待构建完成（约 1-2 分钟）

6. **获取访问地址**
   - 部署成功后，Vercel 会提供一个 `.vercel.app` 域名
   - 您也可以绑定自定义域名

### 方法二：使用 Vercel CLI 部署

```bash
# 安装 Vercel CLI（如果还没有）
npm install -g vercel

# 在项目目录中运行
cd e:\临时\fuxi
vercel

# 按照提示操作：
# - Set up and deploy? Yes
# - Which scope? 选择您的账号
# - Link to existing project? No
# - Project name? medical-exam-platform
# - Directory? ./
# - Override settings? No

# 生产环境部署
vercel --prod
```

## 重要配置说明

### 1. Vercel 配置文件

项目已包含 `vercel.json` 配置文件：

```json
{
  "version": 2,
  "builds": [
    { "src": "api/**/*.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/index.js" }
  ]
}
```

### 2. API 路由

由于 Vercel Serverless Functions 的限制，建议：

#### 选项 A：使用 Vercel Serverless Functions（当前配置）

将 `api/index.js` 改写为适配 Vercel 的格式：

```javascript
// api/index.js
module.exports = (req, res) => {
  const { method, url } = req;
  
  // 处理不同的 API 路由
  if (url.startsWith('/api/login')) {
    // 处理登录逻辑
  } else if (url.startsWith('/api/register')) {
    // 处理注册逻辑
  }
  // ... 其他路由
  
  res.status(200).json({ message: 'API Working' });
};
```

#### 选项 B：使用外部后端服务（推荐）

1. **Render** (https://render.com)
   - 免费部署 Node.js 后端
   - 连接您的数据库

2. **Railway** (https://railway.app)
   - 简单的部署平台
   - 支持 PostgreSQL

3. **Supabase** (https://supabase.com)
   - 完整的 BaaS 解决方案
   - 内置数据库和认证

### 3. 前端 API 地址配置

在 `app.js` 中，更新 API 地址为您的后端地址：

```javascript
// app.js
const API_BASE_URL = isLocal ? 'http://localhost:3001/api' : 'https://your-backend-service.vercel.app/api';
```

## 后续更新

### 推送更新自动部署

每当您向 GitHub 推送代码时，Vercel 会自动重新部署：

```bash
# 提交更改
git add .
git commit -m "feat: 添加新功能"
git push

# Vercel 会自动检测并部署
```

### 查看部署状态

1. 访问 https://vercel.com/dashboard
2. 点击您的项目
3. 查看 "Deployments" 选项卡

## 自定义域名（可选）

1. 在 Vercel 项目设置中，选择 "Domains"
2. 添加您的自定义域名
3. 按照指示配置 DNS 记录
4. 等待 SSL 证书自动配置

## 常见问题

### Q: 部署失败怎么办？

1. 检查 "Deployments" 中的构建日志
2. 确保所有依赖正确安装
3. 检查 API 路由配置

### Q: 如何查看日志？

在 Vercel Dashboard 中：
- 点击项目 → "Functions" → 选择函数 → "Logs"

### Q: 如何回滚？

在 "Deployments" 中：
- 找到之前的部署 → 点击 "..." → "Promote to Production"

## 项目文件说明

```
e:\临时\fuxi\
├── index.html          # 前端主页面
├── app.js              # 前端逻辑
├── style.css           # 样式文件
├── questions.js        # 药物分析题目
├── questions_linchuang.js    # 临床医学题目
├── questions_sixiangdaode.js # 思想道德题目
├── server/             # 本地后端（用于开发）
│   ├── server.js
│   └── storage.js
├── vercel.json         # Vercel 配置文件
├── netlify.toml        # Netlify 配置文件（备选）
└── deploy/             # 备用部署文件
```

## 技术支持

- Vercel 文档：https://vercel.com/docs
- GitHub 集成：https://vercel.com/docs/git-integrations
- Serverless Functions：https://vercel.com/docs/serverless-functions

---

祝您部署成功！🎉
