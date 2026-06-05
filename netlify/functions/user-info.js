const jwt = require('jsonwebtoken');
const { initDatabase } = require('./_db');

let dbInitialized = false;

function authenticateToken(headers) {
    const authHeader = headers.authorization || headers.Authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return { error: '未登录', statusCode: 401 };
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'exam-platform-secret-key-2024';
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return { user: decoded };
    } catch (err) {
        return { error: 'Token无效', statusCode: 403 };
    }
}

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

        const authResult = authenticateToken(event.headers);
        if (authResult.error) {
            return {
                statusCode: authResult.statusCode,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ success: false, message: authResult.error })
            };
        }

        const username = authResult.user.username;

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: true,
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
