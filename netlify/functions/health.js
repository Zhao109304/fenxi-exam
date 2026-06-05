const { initDatabase } = require('./_db');

let dbInitialized = false;

exports.handler = async function(event, context) {
    try {
        if (!dbInitialized) {
            await initDatabase();
            dbInitialized = true;
        }
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
            },
            body: JSON.stringify({ status: 'ok', message: '服务运行正常' })
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
