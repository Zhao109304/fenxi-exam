const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

const USERS_FILE = path.join(DATA_DIR, 'users.json');

function ensureFiles() {
    if (!fs.existsSync(USERS_FILE)) {
        fs.writeFileSync(USERS_FILE, JSON.stringify({}, null, 2));
    }
}

function getUsers() {
    ensureFiles();
    try {
        return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
    } catch (e) {
        return {};
    }
}

function saveUsers(users) {
    ensureFiles();
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function getUserDataPath(username) {
    return path.join(DATA_DIR, `user_${username}.json`);
}

function getUserData(username) {
    const userDataFile = getUserDataPath(username);
    if (!fs.existsSync(userDataFile)) {
        return { subjects: {} };
    }
    try {
        const data = JSON.parse(fs.readFileSync(userDataFile, 'utf-8'));
        return data.subjects ? data : { subjects: {}, ...data };
    } catch (e) {
        return { subjects: {} };
    }
}

function saveUserData(username, data) {
    const userDataFile = getUserDataPath(username);
    fs.writeFileSync(userDataFile, JSON.stringify(data, null, 2));
}

function saveSubjectData(username, subject, wrongQuestions, examHistory) {
    const userData = getUserData(username);
    
    if (!userData.subjects) {
        userData.subjects = {};
    }
    
    userData.subjects[subject] = {
        subject,
        wrongQuestions: wrongQuestions || [],
        examHistory: examHistory || 0,
        lastSyncAt: Date.now()
    };
    
    userData.lastSyncAt = Date.now();
    saveUserData(username, userData);
    
    return userData;
}

function getSubjectData(username, subject) {
    const userData = getUserData(username);
    const subjectData = userData.subjects && userData.subjects[subject];
    
    if (!subjectData) {
        return {
            wrongQuestions: [],
            examHistory: 0
        };
    }
    
    return {
        wrongQuestions: subjectData.wrongQuestions || [],
        examHistory: subjectData.examHistory || 0
    };
}

module.exports = {
    getUsers,
    saveUsers,
    getUserData,
    saveUserData,
    saveSubjectData,
    getSubjectData
};
