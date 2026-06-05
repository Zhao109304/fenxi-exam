// Vercel Serverless Function Wrapper
// 这个文件将 Express 应用适配到 Vercel Serverless Functions

const { createServer } = require('http');
const { parse } = require('url');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

// 数据库连接
let pool = null;

function getPool() {
    if (!pool) {
        const connectionString = process.env.DATABASE_URL;
        
        if (!connectionString) {
            throw new Error('DATABASE_URL 环境变量未配置');
        }
        
        pool = new Pool({
            connectionString: connectionString,
            ssl: connectionString.includes('neon.tech') || connectionString.includes('supabase.co')
                ? { rejectUnauthorized: false }
                : false
        });
    }
    return pool;
}

const JWT_SECRET = process.env.JWT_SECRET || 'exam-platform-secret-key-2024';

// 处理 API 请求
module.exports = async (req, res) => {
    // 设置 CORS 头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // 处理 OPTIONS 请求
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    const parsedUrl = parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method;
    
    try {
        // 健康检查
        if (path === '/api/health' && method === 'GET') {
            return res.status(200).json({ 
                status: 'ok', 
                message: '服务运行正常' 
            });
        }
        
        // 注册
        if (path === '/api/register' && method === 'POST') {
            const body = JSON.parse(req.body || '{}');
            const { username, password } = body;
            
            if (!username || !password) {
                return res.status(400).json({ 
                    success: false, 
                    message: '账号和密码不能为空' 
                });
            }
            
            if (username.length < 3) {
                return res.status(400).json({ 
                    success: false, 
                    message: '账号至少需要3个字符' 
                });
            }
            
            if (password.length < 6) {
                return res.status(400).json({ 
                    success: false, 
                    message: '密码至少需要6个字符' 
                });
            }
            
            // 检查用户是否存在
            const client = await getPool().connect();
            try {
                const existingUser = await client.query(
                    'SELECT * FROM users WHERE username = $1',
                    [username]
                );
                
                if (existingUser.rows.length > 0) {
                    return res.status(400).json({ 
                        success: false, 
                        message: '该账号已存在' 
                    });
                }
                
                // 创建用户
                const hashedPassword = bcrypt.hashSync(password, 10);
                await client.query(
                    'INSERT INTO users (username, password) VALUES ($1, $2)',
                    [username, hashedPassword]
                );
                
                const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '30d' });
                
                return res.status(200).json({
                    success: true,
                    message: '注册成功',
                    token,
                    username
                });
            } finally {
                client.release();
            }
        }
        
        // 登录
        if (path === '/api/login' && method === 'POST') {
            const body = JSON.parse(req.body || '{}');
            const { username, password } = body;
            
            if (!username || !password) {
                return res.status(400).json({ 
                    success: false, 
                    message: '账号和密码不能为空' 
                });
            }
            
            const client = await getPool().connect();
            try {
                const result = await client.query(
                    'SELECT * FROM users WHERE username = $1',
                    [username]
                );
                
                if (result.rows.length === 0) {
                    return res.status(400).json({ 
                        success: false, 
                        message: '账号不存在' 
                    });
                }
                
                const user = result.rows[0];
                
                if (!bcrypt.compareSync(password, user.password)) {
                    return res.status(400).json({ 
                        success: false, 
                        message: '密码错误' 
                    });
                }
                
                const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '30d' });
                
                return res.status(200).json({
                    success: true,
                    message: '登录成功',
                    token,
                    username
                });
            } finally {
                client.release();
            }
        }
        
        // Token 验证
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: '未登录' 
            });
        }
        
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            return res.status(403).json({ 
                success: false, 
                message: 'Token无效' 
            });
        }
        
        const username = decoded.username;
        
        // 保存科目数据
        if (path === '/api/sync/subject' && method === 'POST') {
            const body = JSON.parse(req.body || '{}');
            const { subject, wrongQuestions, examHistory } = body;
            
            if (!subject) {
                return res.status(400).json({ 
                    success: false, 
                    message: '学科不能为空' 
                });
            }
            
            const client = await getPool().connect();
            try {
                await client.query(`
                    INSERT INTO user_subjects (username, subject, wrong_questions, exam_history, last_sync_at)
                    VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
                    ON CONFLICT (username, subject) DO UPDATE 
                    SET wrong_questions = $3, exam_history = $4, last_sync_at = CURRENT_TIMESTAMP
                `, [username, subject, JSON.stringify(wrongQuestions || []), examHistory || 0]);
                
                return res.status(200).json({
                    success: true,
                    message: '数据保存成功'
                });
            } finally {
                client.release();
            }
        }
        
        // 获取科目数据
        if (path.startsWith('/api/sync/subject/') && method === 'GET') {
            const subject = path.split('/').pop();
            
            const client = await getPool().connect();
            try {
                const result = await client.query(
                    'SELECT wrong_questions, exam_history FROM user_subjects WHERE username = $1 AND subject = $2',
                    [username, subject]
                );
                
                if (result.rows.length === 0) {
                    return res.status(200).json({
                        success: true,
                        data: { wrongQuestions: [], examHistory: 0 }
                    });
                }
                
                const row = result.rows[0];
                return res.status(200).json({
                    success: true,
                    data: {
                        wrongQuestions: JSON.parse(row.wrong_questions || '[]'),
                        examHistory: row.exam_history || 0
                    }
                });
            } finally {
                client.release();
            }
        }
        
        // 获取用户信息
        if (path === '/api/user/info' && method === 'GET') {
            return res.status(200).json({
                success: true,
                username
            });
        }
        
        // 404
        return res.status(404).json({ 
            success: false, 
            message: 'API 不存在' 
        });
        
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ 
            success: false, 
            message: '服务器错误: ' + error.message 
        });
    }
};
