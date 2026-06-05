const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { initDatabase, getUserByUsername } = require('./_db');

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

        const user = await getUserByUsername(username);
        
        if (!user) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ success: false, message: '账号不存在' })
            };
        }

        if (!bcrypt.compareSync(password, user.password)) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ success: false, message: '密码错误' })
            };
        }

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
                message: '登录成功',
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
