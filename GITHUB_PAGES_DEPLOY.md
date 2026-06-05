# 🌟 GitHub Pages 免费部署指南

## 为什么选择 GitHub Pages？

✅ **完全免费** - 没有带宽、存储、流量限制  
✅ **操作超简单** - 3分钟完成  
✅ **自动部署** - 推送代码后自动更新  
✅ **与 GitHub 集成** - 您已经在用 GitHub  
✅ **自定义域名** - 支持绑定自己的域名  

---

## 📋 完整部署步骤（3分钟）

### 步骤 1：进入 GitHub 仓库设置

1. **访问** https://github.com/Zhao109304/fenxi-exam
2. **点击** 仓库顶部的 **"Settings"** 标签

---

### 步骤 2：找到 GitHub Pages

在 Settings 页面：
1. **滚动**到左侧菜单最底部
2. **点击** **"Pages"** 选项

---

### 步骤 3：配置 GitHub Pages

在 Pages 设置页面：

1. **Source**（来源）
   - 选择 **"Deploy from a branch"**
   
2. **Branch**（分支）
   - 选择 **"main"**
   - 选择 **"/ (root)"** 作为文件夹
   
3. **Custom domain**（可选）
   - 如果您有域名，可以在这里填写
   - 如果没有，跳过此步

4. **Enforce HTTPS**（强制 HTTPS）
   - ✅ 勾选此项（推荐）

5. **点击** **"Save"** 按钮

---

### 步骤 4：等待部署

**等待 1-2 分钟**，GitHub 会自动构建并部署。

---

### 步骤 5：访问您的网站！

部署完成后，在 Pages 设置页面顶部会显示：
```
Your site is published at https://Zhao109304.github.io/fenxi-exam/
```

**直接访问这个链接即可！** 🎉

---

## ⚠️ 重要提示

### 部署可能需要几分钟

- 首次部署可能需要 **1-5 分钟**
- 代码更新后会自动重新部署（约 1-2 分钟）
- 如果页面没更新，**按 Ctrl+F5 强制刷新浏览器**

---

## 🌐 完整架构

部署后，您的项目将是：

### 后端（Railway）
```
https://xxx.railway.app  (您的后端服务)
```

### 前端（GitHub Pages）
```
https://Zhao109304.github.io/fenxi-exam/
```

---

## 🔧 配置前端 API 地址

### 如果您的后端在 Railway：

1. **打开** `app.js` 文件
2. **找到** 这一行：
   ```javascript
   const API_BASE_URL = isLocal ? 'http://localhost:3001/api' : '/api';
   ```
3. **改为** 您的 Railway 后端地址：
   ```javascript
   const API_BASE_URL = isLocal ? 'http://localhost:3001/api' : 'https://xxx.railway.app/api';
   ```
4. **提交并推送**：
   ```bash
   git add app.js
   git commit -m "Update API URL for Railway"
   git push origin main
   ```

### 如果您的后端也在 GitHub Pages 同源：

保持 `/api` 即可，因为 Railway 会处理 CORS。

---

## 📁 推送到 GitHub（如果还没推送）

在终端执行：
```bash
cd e:\临时\fuxi

# 添加所有更改
git add .

# 提交
git commit -m "Complete Medical Exam Platform"

# 推送到 GitHub
git push origin main
```

---

## 🔍 验证部署成功

### 1. 检查 GitHub Actions

1. 进入仓库主页
2. 点击 **"Actions"** 标签
3. 应该看到 **"GitHub Pages"** 工作流正在运行或已完成

### 2. 访问网站

访问：`https://Zhao109304.github.io/fenxi-exam/`

应该看到登录页面！

---

## 🛠️ 常见问题

### 问题 1：404 错误

**原因**：部署还在进行中

**解决**：
1. 等待 2-5 分钟
2. 进入 Actions 页面查看状态
3. 如果失败，点击查看错误日志

### 问题 2：样式/图片不显示

**原因**：CSS/JS 文件路径问题

**解决**：
1. 检查 `index.html` 中的 CSS/JS 引用路径
2. 确保使用相对路径或绝对路径
3. 常见问题：`./style.css` vs `/style.css`

### 问题 3：CORS 错误

**原因**：前端和后端域名不同

**解决**：
1. 在后端代码中配置 CORS（Railway 后端已配置）
2. 或使用后端提供的 API 地址

### 问题 4：网站显示 "Settings" 页面

**原因**：在仓库的 Settings 页面查看 Pages

**解决**：
1. 确保在正确的仓库中配置
2. 确认 Pages 已启用
3. 等待几分钟后再访问

---

## 🚀 部署后更新

每次您推送代码到 `main` 分支，GitHub Pages 会**自动重新部署**！

```bash
# 修改代码后
git add .
git commit -m "更新说明"
git push origin main

# 1-2 分钟后，网站自动更新！
```

---

## 💡 Pro 技巧

### 1. 查看部署状态

在仓库的 **Actions** 标签页中：
- 点击最新的 workflow run
- 可以看到详细的构建日志
- 如果失败，会有错误提示

### 2. 禁用 Pages

如果想临时禁用：
1. Settings → Pages
2. Source 选择 "None"
3. Save

### 3. 自定义域名

想要用您自己的域名？

1. Settings → Pages
2. 在 "Custom domain" 输入域名（如：`exam.yoursite.com`）
3. 在您的域名 DNS 中添加：
   - **Type**: CNAME
   - **Name**: exam（或您想要的前缀）
   - **Value**: `Zhao109304.github.io`
4. 勾选 "Enforce HTTPS"
5. 等待 DNS 生效（通常几分钟到几小时）

### 4. 更改默认分支

如果您的默认分支不是 `main`：
1. Settings → Pages
2. Branch 选择您想要部署的分支

---

## 📊 GitHub Pages vs 其他平台

| 特性 | GitHub Pages | Vercel | Netlify |
|------|-------------|---------|---------|
| **价格** | 完全免费 | 免费有额度 | 免费有额度 |
| **带宽** | 无限 | 100GB/月 | 100GB/月 |
| **存储** | 1GB | 100GB | 300GB |
| **私有仓库** | ❌ | ✅ | ✅ |
| **后端支持** | ❌ 静态 | ✅ Serverless | ✅ Serverless |
| **自定义域名** | ✅ | ✅ | ✅ |
| **HTTPS** | ✅ 免费 | ✅ | ✅ |

---

## 🎉 成功！

您现在拥有：
- ✅ **免费前端托管** - GitHub Pages（无限流量！）
- ✅ **免费后端** - Railway（含 PostgreSQL）
- ✅ **完整功能** - 注册/登录/考试/错题
- ✅ **自动部署** - 推送代码自动更新

---

## 📞 需要帮助？

如果在部署过程中遇到问题：
1. 检查 GitHub Actions 的构建日志
2. 确认文件路径是否正确
3. 等待几分钟后再试
4. 随时告诉我遇到的错误！

---

**您的医学考试平台即将上线！** 🚀✨

**GitHub Pages 链接**：`https://Zhao109304.github.io/fenxi-exam/`
