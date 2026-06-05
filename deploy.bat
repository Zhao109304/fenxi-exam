@echo off
REM ============================================
REM 医学考试平台 - Vercel 快速部署脚本
REM ============================================

echo.
echo ============================================
echo 医学考试平台 - Vercel 部署脚本
echo ============================================
echo.

REM 检查 Git
echo [1/5] 检查 Git 安装...
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git 未安装！请先安装 Git: https://git-scm.com
    pause
    exit /b 1
)
echo ✅ Git 已安装

REM 检查 Vercel CLI
echo.
echo [2/5] 检查 Vercel CLI...
vercel --version >nul 2>&1
if errorlevel 1 (
    echo ⚙️ Vercel CLI 未安装，正在安装...
    npm install -g vercel
    echo ✅ Vercel CLI 已安装
) else (
    echo ✅ Vercel CLI 已安装
)

REM 检查 GitHub 仓库
echo.
echo [3/5] 检查 GitHub 仓库配置...
git remote -v | findstr "origin" >nul
if errorlevel 1 (
    echo ❌ 未找到 GitHub 远程仓库！
    echo.
    echo 请先创建 GitHub 仓库：
    echo 1. 访问 https://github.com
    echo 2. 创建新仓库 (例如: medical-exam-platform)
    echo 3. 复制仓库 URL
    echo 4. 运行以下命令：
    echo    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
    echo    git push -u origin main
    echo.
    echo 创建仓库后，重新运行此脚本
    pause
    exit /b 1
)
echo ✅ GitHub 仓库已配置

REM 提交代码
echo.
echo [4/5] 准备提交代码...
echo.
echo 以下文件将被提交：
git status --short
echo.

set /p commit_msg="请输入提交信息（直接回车使用默认信息）: "
if "%commit_msg%"=="" set commit_msg="feat: 准备部署到 Vercel"

git add .
git commit -m "%commit_msg%"
echo ✅ 代码已提交

REM 推送到 GitHub
echo.
echo [5/5] 推送到 GitHub...
git push origin main
if errorlevel 1 (
    echo.
    echo ❌ 推送失败！请检查：
    echo 1. GitHub 仓库是否正确
    echo 2. 是否有推送权限
    echo 3. 分支名称是否正确
    pause
    exit /b 1
)
echo ✅ 代码已推送到 GitHub

echo.
echo ============================================
echo 🎉 准备完成！
echo ============================================
echo.
echo 下一步：
echo 1. 访问 https://vercel.com
echo 2. 使用 GitHub 账号登录
echo 3. 点击 "Add New" -^> "Project"
echo 4. 选择您的仓库并导入
echo 5. 配置环境变量：
echo    - DATABASE_URL: 您的 PostgreSQL 连接字符串
echo    - JWT_SECRET: 任意随机字符串
echo 6. 点击 "Deploy"
echo.
echo 详细说明请查看：
echo - DEPLOYMENT_GUIDE.md
echo - DEPLOYMENT_CHECKLIST.md
echo.
echo ============================================

pause
