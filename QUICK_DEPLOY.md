# 🚀 Vercel 部署 - 5分钟快速指南

## 步骤 1: 准备代码 (2分钟)

### 1.1 创建 GitHub 仓库
```
1. 访问 https://github.com
2. 点击 "+" → "New repository"
3. 名称: medical-exam-platform
4. 点击 "Create repository"
```

### 1.2 推送代码
```bash
cd e:\临时\fuxi

# 初始化（如果需要）
git init

# 添加远程仓库（替换 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/medical-exam-platform.git

# 提交和推送
git add .
git commit -m "Initial commit"
git push -u origin main
```

## 步骤 2: 创建数据库 (1分钟)

### 2.1 注册 Neon
```
1. 访问 https://neon.tech
2. 点击 "Sign in with GitHub"
3. 创建新项目：
   - Name: medical-exam-db
   - Region: 选择最近区域
4. 点击 "Create Project"
```

### 2.2 获取连接字符串
```
1. 在 Dashboard 中点击 "Connection Details"
2. 复制 "Connection string"
3. 格式类似：
   postgresql://user:pass@ep-xxx-xxx-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

## 步骤 3: 部署到 Vercel (2分钟)

### 3.1 登录 Vercel
```
1. 访问 https://vercel.com
2. 点击 "Sign Up"
3. 选择 "Continue with GitHub"
4. 授权访问
```

### 3.2 导入项目
```
1. 点击 "Add New" → "Project"
2. 找到您的仓库 "medical-exam-platform"
3. 点击 "Import"
```

### 3.3 配置环境变量
```
在 "Environment Variables" 部分：

Variable 1:
Name: DATABASE_URL
Value: (粘贴 Neon 的连接字符串)
Env: ✓ Production  ✓ Preview  ✓ Development

Variable 2:
Name: JWT_SECRET  
Value: (任意随机字符串，例如：my-super-secret-key-2024)
Env: ✓ Production  ✓ Preview  ✓ Development

点击 "Save"
```

### 3.4 部署
```
点击 "Deploy"
等待 1-2 分钟...

🎉 部署成功！
```

## 步骤 4: 测试应用 (30秒)

```
1. Vercel 会显示您的访问地址：
   https://medical-exam-platform.vercel.app
   
2. 点击链接访问应用

3. 测试功能：
   ✓ 注册新账号
   ✓ 登录
   ✓ 开始考试
   ✓ 查看成绩
```

## 🎯 遇到问题？

### 问题: 数据库连接失败
```
解决方案：
1. 检查 Neon 的 DATABASE_URL 是否正确
2. 确保包含 ?sslmode=require
3. 检查 Neon 的使用量是否超限（Free 计划 0.5GB）
```

### 问题: 部署失败
```
解决方案：
1. 查看 Vercel Dashboard 的构建日志
2. 确保环境变量已设置
3. 检查 vercel.json 配置
```

### 问题: API 不工作
```
解决方案：
1. 检查 Vercel Functions 日志
2. 确认 DATABASE_URL 格式正确
3. 验证 JWT_SECRET 已设置
```

## 📚 完整文档

- **详细部署指南**: [DEPLOYMENT_GUIDE.md](e:\临时\fuxi\DEPLOYMENT_GUIDE.md)
- **部署检查清单**: [DEPLOYMENT_CHECKLIST.md](e:\临时\fuxi\DEPLOYMENT_CHECKLIST.md)
- **项目 README**: [README.md](e:\临时\fuxi\README.md)

## 🌟 后续优化

### 1. 自定义域名
```
1. 购买域名（Namesilo、Cloudflare）
2. 在 Vercel → Settings → Domains 添加
3. 配置 DNS 记录
4. 等待 SSL 证书自动配置
```

### 2. 持续部署
```
每次推送到 GitHub，Vercel 会自动：
- 构建项目
- 运行测试
- 部署到生产环境

无需手动操作！
```

## 💡 Pro 技巧

1. **预览部署**: 每次 PR 会自动创建预览环境
2. **回滚**: 在 Deployments 中可以回滚到之前的版本
3. **监控**: Vercel 提供免费的性能和错误监控
4. **分析**: 集成 Vercel Analytics 了解访问情况

## 📞 需要帮助？

- **Vercel 文档**: https://vercel.com/docs
- **Neon 文档**: https://neon.tech/docs
- **GitHub Issues**: https://github.com/YOUR_USERNAME/medical-exam-platform/issues

---

<div align="center">
  <strong>🎉 恭喜！您的考试平台已成功上线！</strong>
  
  分享给您的同学和朋友，一起学习进步！
</div>
