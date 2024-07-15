const db = require('../db');

const Post = {
    createPost: (postData, callback) => {
        const query = 'INSERT INTO posts (user_id, content, is_public) VALUES (?, ?, ?)';
        db.query(query, [postData.userId, postData.content, postData.isPublic], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results.insertId);
        });
    },

    getPostsByUser: (userId, callback) => {
        const query = 'SELECT * FROM posts WHERE user_id = ?';
        db.query(query, [userId], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results);
        });
    },
    
    getPublicPosts: (callback) => {
        const query = `
            SELECT posts.*, users.username 
            FROM posts 
            JOIN users ON posts.user_id = users.id 
            WHERE posts.is_public = 1
        `;
        db.query(query, (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results);
        });
    },

};

module.exports = Post;
