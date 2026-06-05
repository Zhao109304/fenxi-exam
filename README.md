# 🏥 医学考试平台

一个现代化的医学考试学习平台，支持多科目在线练习、错题管理和学习进度追踪。

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Platform](https://img.shields.io/badge/platform-Vercel-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ 功能特性

- 📚 **多科目支持** - 药物分析、临床医学、思想道德与法治
- 📝 **在线考试** - 模拟真实考试环境
- 📊 **错题管理** - 自动收集错题，支持针对性复习
- 🔄 **进度追踪** - 记录学习历史，分析薄弱环节
- 🎨 **精美界面** - 现代 UI 设计，流畅的交互动效
- 📱 **响应式设计** - 完美适配桌面和移动设备
- 🔒 **用户系统** - 注册登录，数据云端同步
- 🌐 **一键部署** - 支持 Vercel、Netlify 等主流平台

## 🚀 快速开始

### 本地开发

#### 1. 克隆项目
```bash
git clone https://github.com/YOUR_USERNAME/medical-exam-platform.git
cd medical-exam-platform
```

#### 2. 安装后端依赖
```bash
cd server
npm install
```

#### 3. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件，填入数据库连接信息
```

#### 4. 启动后端服务
```bash
npm start
# 服务运行在 http://localhost:3001
```

#### 5. 启动前端
```bash
# 在项目根目录启动 HTTP 服务器
python -m http.server 8080
# 或使用 Node.js
npx serve .

# 访问 http://localhost:8080
```

### 在线部署

详细部署指南请查看：
- [部署指南](DEPLOYMENT_GUIDE.md) - 完整的 Vercel 部署教程
- [部署清单](DEPLOYMENT_CHECKLIST.md) - 快速检查清单

#### Vercel 部署（推荐）

1. **创建 GitHub 仓库**并推送代码

2. **创建 Neon 数据库**
   - 访问 [Neon](https://neon.tech)
   - 创建 PostgreSQL 项目
   - 复制连接字符串

3. **部署到 Vercel**
   - 访问 [Vercel](https://vercel.com)
   - 导入 GitHub 仓库
   - 配置环境变量：
     - `DATABASE_URL`: PostgreSQL 连接字符串
     - `JWT_SECRET`: 随机密钥
   - 点击 Deploy

## 📁 项目结构

```
medical-exam-platform/
├── index.html              # 主页面
├── app.js                  # 前端应用逻辑
├── style.css               # 样式文件
├── questions.js             # 药物分析题目
├── questions_linchuang.js   # 临床医学题目
├── questions_sixiangdaode.js # 思想道德题目
├── server/                 # 本地开发后端
│   ├── server.js
│   ├── storage.js
│   └── package.json
├── api/                    # Vercel Serverless Functions
│   ├── vercel-api.js      # API 入口
│   ├── db.js              # 数据库操作
│   └── index.js           # Express 路由
├── vercel.json             # Vercel 配置
├── netlify.toml            # Netlify 配置
├── .env.example            # 环境变量示例
├── deploy.bat              # Windows 部署脚本
├── DEPLOYMENT_GUIDE.md     # 部署指南
├── DEPLOYMENT_CHECKLIST.md # 部署清单
└── README.md               # 项目文档
```

## 🛠️ 技术栈

### 前端
- **HTML5** - 语义化标签
- **CSS3** - 现代 CSS 特性，Flexbox、Grid、动画
- **Vanilla JavaScript** - 原生 JS，无框架依赖
- **Google Fonts** - Noto Sans SC 字体

### 后端
- **Node.js** - 服务端运行环境
- **Express.js** - Web 框架（本地开发）
- **JSON Web Token (JWT)** - 用户认证
- **bcryptjs** - 密码加密
- **PostgreSQL** - 关系型数据库

### 部署
- **Vercel** - Serverless Functions 和托管
- **Neon** - Serverless PostgreSQL
- **GitHub** - 代码托管和 CI/CD

## 📖 使用指南

### 注册账号
1. 访问应用首页
2. 点击"立即注册"
3. 填写用户名（至少 3 个字符）
4. 设置密码（至少 6 个字符）
5. 点击注册

### 开始考试
1. 登录后进入首页
2. 选择考试科目（药物分析/临床医学/思想道德）
3. 点击"开始考试"
4. 认真作答每道题目
5. 完成后查看成绩

### 复习错题
1. 进入科目详情页
2. 点击"错题重做"
3. 系统会自动加载您的错题
4. 重新作答并查看解析
5. 巩固薄弱知识点

### 查看学习进度
- 首页显示各科目的完成情况
- 包括：总题数、错题数、考试次数
- 数据自动云端同步

## 🔧 自定义配置

### 添加新科目

1. 在 `questions_xxx.js` 中添加题目数据：
```javascript
const questions_xxx = [
    {
        id: 1,
        type: 'single',  // single/multiple/truefalse
        question: '题目内容',
        options: ['A. 选项A', 'B. 选项B', 'C. 选项C', 'D. 选项D'],
        answer: 'A'
    }
];
```

2. 在 `index.html` 中添加科目选择按钮

3. 在 `app.js` 中注册科目：
```javascript
const questionData = {
    // ... 其他科目
    xxx: window.questions_xxx || []
};
```

### 修改样式

编辑 `style.css` 文件：
- 颜色变量在 `:root` 中定义
- 支持 CSS 渐变、阴影、动画
- 响应式断点：`768px`、`480px`

## 🐛 问题排查

### 数据库连接失败
- 检查 `DATABASE_URL` 是否正确
- 确保包含 `?sslmode=require`
- 检查数据库是否正常运行

### 前端无法访问 API
- 检查后端服务是否启动
- 确认 API 地址配置正确
- 查看浏览器控制台错误信息

### 部署失败
- 查看 Vercel 构建日志
- 确保所有环境变量已配置
- 检查代码是否有语法错误

## 📝 开发指南

### 代码规范
- 使用有意义的变量命名
- 添加必要的注释说明
- 保持代码结构清晰

### Git 工作流
```bash
# 创建功能分支
git checkout -b feature/new-feature

# 开发完成后提交
git add .
git commit -m "feat: 添加新功能"

# 推送到远程
git push origin feature/new-feature

# 创建 Pull Request
```

### 测试建议
- 本地测试所有功能
- 检查响应式布局
- 验证移动端兼容性

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源。

## 🙏 致谢

- [Vercel](https://vercel.com) - 优秀的部署平台
- [Neon](https://neon.tech) - Serverless PostgreSQL
- [Google Fonts](https://fonts.google.com) - 精美的开源字体

## 📞 联系方式

- 项目主页：https://github.com/YOUR_USERNAME/medical-exam-platform
- 问题反馈：https://github.com/YOUR_USERNAME/medical-exam-platform/issues

---

<p align="center">
  <strong>如果这个项目对您有帮助，请给我们一个 ⭐️</strong>
</p>
