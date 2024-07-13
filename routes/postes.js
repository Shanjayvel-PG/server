const express = require('express');
const jwt = require('jsonwebtoken');
const Post = require('../models/post');
const router = express.Router();

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }

    try {
        const verified = jwt.verify(token, 'your_jwt_secret');
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token' });
    }
};

// Post a new message
router.post('/', authenticateToken, async (req, res) => {
    const { content, isPublic } = req.body;

    try {
        const newPost = new Post({
            userId: req.user.userId,
            content,
            isPublic
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: 'Error creating post' });
    }
});

// Get all public posts or user's private posts
router.get('/', authenticateToken, async (req, res) => {
    try {
        const posts = await Post.find({
            $or: [
                { isPublic: true },
                { userId: req.user.userId }
            ]
        }).populate('userId', 'username');

        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching posts' });
    }
});

module.exports = router;
