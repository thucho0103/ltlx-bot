const fs = require('fs');
const path = require('path');

const STATS_FILE = path.join(__dirname, '../data/stats.json');

// Ensure data folder and stats file exist
function initializeStats() {
    const dir = path.dirname(STATS_FILE);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(STATS_FILE)) {
        fs.writeFileSync(STATS_FILE, JSON.stringify({}));
    }
}

// Get user stats
function getUserStats(userId, username) {
    initializeStats();
    const data = JSON.parse(fs.readFileSync(STATS_FILE, 'utf-8'));
    if (!data[userId]) {
        data[userId] = {
            username: username || 'User',
            questionsAnswered: 0,
            correctAnswers: 0,
            examsAttempted: 0,
            examsPassed: 0
        };
        fs.writeFileSync(STATS_FILE, JSON.stringify(data, null, 2));
    }
    return data[userId];
}

// Update user practice stats
function updatePracticeStats(userId, username, isCorrect) {
    initializeStats();
    const data = JSON.parse(fs.readFileSync(STATS_FILE, 'utf-8'));
    if (!data[userId]) {
        data[userId] = {
            username: username || 'User',
            questionsAnswered: 0,
            correctAnswers: 0,
            examsAttempted: 0,
            examsPassed: 0
        };
    }
    data[userId].username = username || data[userId].username;
    data[userId].questionsAnswered += 1;
    if (isCorrect) {
        data[userId].correctAnswers += 1;
    }
    fs.writeFileSync(STATS_FILE, JSON.stringify(data, null, 2));
    return data[userId];
}

// Update user exam stats
function updateExamStats(userId, username, isPassed) {
    initializeStats();
    const data = JSON.parse(fs.readFileSync(STATS_FILE, 'utf-8'));
    if (!data[userId]) {
        data[userId] = {
            username: username || 'User',
            questionsAnswered: 0,
            correctAnswers: 0,
            examsAttempted: 0,
            examsPassed: 0
        };
    }
    data[userId].username = username || data[userId].username;
    data[userId].examsAttempted += 1;
    if (isPassed) {
        data[userId].examsPassed += 1;
    }
    fs.writeFileSync(STATS_FILE, JSON.stringify(data, null, 2));
    return data[userId];
}

module.exports = {
    getUserStats,
    updatePracticeStats,
    updateExamStats
};
