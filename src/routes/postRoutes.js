const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authenticateToken = require('../middleware/auth');

// Create a new post (requires authentication)
router.post('/', authenticateToken, postController.createPost);

// Get posts by the authenticated user (requires authentication)
router.get('/my-posts', authenticateToken, postController.getUserPosts);

// Get public posts
router.get('/public', postController.getPublicPosts);

module.exports = router;
