const db = require('../db');

const User = {
    createUser: (userData, callback) => {
        const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        db.query(query, [userData.username, userData.email, userData.password], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results.insertId);
        });
    },

    findByUsername: (username, callback) => {
        const query = 'SELECT * FROM users WHERE username = ?';
        db.query(query, [username], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results[0]);
        });
    },

    findUserById: (userId, callback) => {
        const query = 'SELECT * FROM users WHERE id = ?';
        db.query(query, [userId], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results[0]);
        });
    },

    findUserByEmail: (email, callback) => {
        const query = 'SELECT * FROM users WHERE email = ?';
        db.query(query, [email], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results[0]);
        });
    },

    updatePassword: (userId, password, callback) => {
        const query = 'UPDATE users SET password = ? WHERE id = ?';
        db.query(query, [password, userId], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results.affectedRows);
        });
    },
};

module.exports = User;
