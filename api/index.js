const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { initDatabase, getUserByUsername, createUser, getSubjectData, saveSubjectData } = require('./db');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'exam-platform-secret-key-2024';

app.use(cors());
app.use(express.json());

let dbInitialized = false;

async function ensureDbInitialized() {
    if (!dbInitialized) {
        try {
            await initDatabase();
            dbInitialized = true;
        } catch (error) {
            console.error('数据库初始化失败:', error);
        }
    }
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: '未登录' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Token无效' });
        }
        req.user = user;
        next();
    });
}

app.get('/api/health', async (req, res) => {
    await ensureDbInitialized();
    res.json({ status: 'ok', message: '服务运行正常' });
});

app.post('/api/register', async (req, res) => {
    await ensureDbInitialized();
    
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: '账号和密码不能为空' });
    }

    if (username.length < 3) {
        return res.status(400).json({ success: false, message: '账号至少需要3个字符' });
    }

    if (password.length < 6) {
        return res.status(400).json({ success: false, message: '密码至少需要6个字符' });
    }

    const existingUser = await getUserByUsername(username);
    if (existingUser) {
        return res.status(400).json({ success: false, message: '该账号已存在' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    await createUser(username, hashedPassword);

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '30d' });

    res.json({
        success: true,
        message: '注册成功',
        token,
        username
    });
});

app.post('/api/login', async (req, res) => {
    await ensureDbInitialized();
    
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: '账号和密码不能为空' });
    }

    const user = await getUserByUsername(username);
    
    if (!user) {
        return res.status(400).json({ success: false, message: '账号不存在' });
    }

    if (!bcrypt.compareSync(password, user.password)) {
        return res.status(400).json({ success: false, message: '密码错误' });
    }

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '30d' });

    res.json({
        success: true,
        message: '登录成功',
        token,
        username
    });
});

app.post('/api/sync/subject', authenticateToken, async (req, res) => {
    await ensureDbInitialized();
    
    const username = req.user.username;
    const { subject, wrongQuestions, examHistory } = req.body;

    if (!subject) {
        return res.status(400).json({ success: false, message: '学科不能为空' });
    }

    await saveSubjectData(username, subject, wrongQuestions, examHistory);

    res.json({
        success: true,
        message: '数据保存成功'
    });
});

app.get('/api/sync/subject/:subject', authenticateToken, async (req, res) => {
    await ensureDbInitialized();
    
    const username = req.user.username;
    const { subject } = req.params;

    const subjectData = await getSubjectData(username, subject);

    res.json({
        success: true,
        data: subjectData
    });
});

app.get('/api/user/info', authenticateToken, async (req, res) => {
    await ensureDbInitialized();
    
    const username = req.user.username;

    res.json({
        success: true,
        username
    });
});

module.exports = app;
