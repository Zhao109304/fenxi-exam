require('dotenv').config();

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const storage = require('./storage');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'exam-platform-secret-key-2024';

app.use(cors());
app.use(express.json());

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

app.post('/api/register', (req, res) => {
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

    const users = storage.getUsers();

    if (users[username]) {
        return res.status(400).json({ success: false, message: '该账号已存在' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    users[username] = {
        password: hashedPassword,
        createdAt: Date.now()
    };

    storage.saveUsers(users);
    storage.saveUserData(username, { subjects: {} });

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '30d' });

    res.json({
        success: true,
        message: '注册成功',
        token,
        username
    });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: '账号和密码不能为空' });
    }

    const users = storage.getUsers();

    if (!users[username]) {
        return res.status(400).json({ success: false, message: '账号不存在' });
    }

    if (!bcrypt.compareSync(password, users[username].password)) {
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

app.post('/api/sync/save', authenticateToken, (req, res) => {
    const username = req.user.username;
    const data = req.body;

    const userData = storage.getUserData(username);
    const updatedData = { ...userData, ...data, lastSyncAt: Date.now() };
    storage.saveUserData(username, updatedData);

    res.json({
        success: true,
        message: '数据同步成功',
        data: updatedData
    });
});

app.post('/api/sync/get', authenticateToken, (req, res) => {
    const username = req.user.username;
    const userData = storage.getUserData(username);

    res.json({
        success: true,
        data: userData
    });
});

app.post('/api/sync/subject', authenticateToken, (req, res) => {
    const username = req.user.username;
    const { subject, wrongQuestions, examHistory } = req.body;

    if (!subject) {
        return res.status(400).json({ success: false, message: '学科不能为空' });
    }

    storage.saveSubjectData(username, subject, wrongQuestions, examHistory);

    res.json({
        success: true,
        message: '数据保存成功'
    });
});

app.get('/api/sync/subject/:subject', authenticateToken, (req, res) => {
    const username = req.user.username;
    const { subject } = req.params;

    const subjectData = storage.getSubjectData(username, subject);

    res.json({
        success: true,
        data: subjectData
    });
});

app.get('/api/user/info', authenticateToken, (req, res) => {
    const username = req.user.username;
    const userData = storage.getUserData(username);

    res.json({
        success: true,
        username,
        lastSyncAt: userData.lastSyncAt || null,
        subjects: userData.subjects || {}
    });
});

app.get('/', (req, res) => {
    res.json({
        name: '医学考试平台后端服务',
        version: '1.0.0',
        endpoints: {
            register: 'POST /api/register',
            login: 'POST /api/login',
            save: 'POST /api/sync/save (需要Token)',
            get: 'POST /api/sync/get (需要Token)',
            subjectSave: 'POST /api/sync/subject (需要Token)',
            subjectGet: 'GET /api/sync/subject/:subject (需要Token)',
            userInfo: 'GET /api/user/info (需要Token)'
        }
    });
});

app.listen(PORT, () => {
    console.log(`医学考试平台后端服务已启动: http://localhost:${PORT}`);
});
