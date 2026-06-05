const { Pool } = require('pg');

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

async function initDatabase() {
    const client = await getPool().connect();
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
    const client = await getPool().connect();
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
    const client = await getPool().connect();
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
    const client = await getPool().connect();
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
    const client = await getPool().connect();
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

module.exports = {
    initDatabase,
    getUserByUsername,
    createUser,
    getSubjectData,
    saveSubjectData
};
