const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { initDatabase, getUserByUsername, createUser } = require('./_db');

let dbInitialized = false;

exports.handler = async function(event, context) {
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
            },
            body: ''
        };
    }

    try {
        if (!dbInitialized) {
            await initDatabase();
            dbInitialized = true;
        }

        const { username, password } = JSON.parse(event.body);

        if (!username || !password) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ success: false, message: '账号和密码不能为空' })
            };
        }

        if (username.length < 3) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ success: false, message: '账号至少需要3个字符' })
            };
        }

        if (password.length < 6) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ success: false, message: '密码至少需要6个字符' })
            };
        }

        const existingUser = await getUserByUsername(username);
        if (existingUser) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ success: false, message: '该账号已存在' })
            };
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        await createUser(username, hashedPassword);

        const JWT_SECRET = process.env.JWT_SECRET || 'exam-platform-secret-key-2024';
        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '30d' });

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: true,
                message: '注册成功',
                token,
                username
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ success: false, message: error.message })
        };
    }
};
