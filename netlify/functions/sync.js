const jwt = require('jsonwebtoken');
const { initDatabase, getSubjectData, saveSubjectData } = require('./_db');

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

        if (event.httpMethod === 'POST') {
            const { subject, wrongQuestions, examHistory } = JSON.parse(event.body);

            if (!subject) {
                return {
                    statusCode: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify({ success: false, message: '学科不能为空' })
                };
            }

            await saveSubjectData(username, subject, wrongQuestions, examHistory);

            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    success: true,
                    message: '数据保存成功'
                })
            };
        }

        if (event.httpMethod === 'GET') {
            let subject = event.queryStringParameters && event.queryStringParameters.subject;
            
            if (!subject) {
                const pathParts = event.path.split('/');
                subject = pathParts[pathParts.length - 1];
            }

            if (!subject) {
                return {
                    statusCode: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify({ success: false, message: '学科参数不能为空' })
                };
            }

            const subjectData = await getSubjectData(username, subject);

            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    success: true,
                    data: subjectData
                })
            };
        }

        return {
            statusCode: 405,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ success: false, message: '方法不允许' })
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
