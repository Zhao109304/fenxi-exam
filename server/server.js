require('dotenv').config();

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'exam-platform-secret-key-2024';

let pool = null;

function getPool() {
    if (!pool) {
        const connectionString = process.env.DATABASE_URL;
        
        if (!connectionString) {
            console.log('DATABASE_URL 未配置，使用本地存储模式');
            return null;
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

async function initDatabase() {
    const db = getPool();
    if (!db) return;
    
    const client = await db.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        await client.query(`
            CREATE TABLE IF NOT EXISTS user_subjects (
                id SERIAL PRIMARY KEY,
                username VARCHAR(100) NOT NULL,
                subject VARCHAR(100) NOT NULL,
                wrong_questions TEXT DEFAULT '[]',
                exam_history INT DEFAULT 0,
                last_sync_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(username, subject)
            )
        `);
        
        await client.query('CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)');
        await client.query('CREATE INDEX IF NOT EXISTS idx_user_subjects_username ON user_subjects(username)');
        
        console.log('数据库初始化完成');
    } finally {
        client.release();
    }
}

async function getUserByUsername(username) {
    const db = getPool();
    if (!db) return null;
    
    const client = await db.connect();
    try {
        const result = await client.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );
        return result.rows[0];
    } finally {
        client.release();
    }
}

async function createUser(username, hashedPassword) {
    const db = getPool();
    if (!db) return false;
    
    const client = await db.connect();
    try {
        await client.query(
            'INSERT INTO users (username, password) VALUES ($1, $2)',
            [username, hashedPassword]
        );
        return true;
    } finally {
        client.release();
    }
}

async function getSubjectData(username, subject) {
    const db = getPool();
    if (!db) return { wrongQuestions: [], examHistory: 0 };
    
    const client = await db.connect();
    try {
        const result = await client.query(
            'SELECT wrong_questions, exam_history FROM user_subjects WHERE username = $1 AND subject = $2',
            [username, subject]
        );
        
        if (result.rows.length === 0) {
            return { wrongQuestions: [], examHistory: 0 };
        }
        
        const row = result.rows[0];
        return {
            wrongQuestions: JSON.parse(row.wrong_questions || '[]'),
            examHistory: row.exam_history || 0
        };
    } finally {
        client.release();
    }
}

async function saveSubjectData(username, subject, wrongQuestions, examHistory) {
    const db = getPool();
    if (!db) return false;
    
    const client = await db.connect();
    try {
        await client.query(`
            INSERT INTO user_subjects (username, subject, wrong_questions, exam_history, last_sync_at)
            VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
            ON CONFLICT (username, subject) DO UPDATE 
            SET wrong_questions = $3, exam_history = $4, last_sync_at = CURRENT_TIMESTAMP
        `, [username, subject, JSON.stringify(wrongQuestions || []), examHistory || 0]);
        
        return true;
    } finally {
        client.release();
    }
}

app.use(cors({
    origin: ['https://zhao109304.github.io', 'http://localhost:8080', 'http://127.0.0.1:8080'],
    credentials: true
}));
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

app.get('/', (req, res) => {
    res.json({
        name: '医学考试平台后端服务',
        version: '1.0.0',
        endpoints: {
            health: 'GET /api/health',
            register: 'POST /api/register',
            login: 'POST /api/login',
            subjectSave: 'POST /api/sync/subject (需要Token)',
            subjectGet: 'GET /api/sync/subject/:subject (需要Token)',
            userInfo: 'GET /api/user/info (需要Token)'
        }
    });
});

app.listen(PORT, () => {
    console.log(`医学考试平台后端服务已启动: http://localhost:${PORT}`);
});
