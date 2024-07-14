const Post = require('../models/postModel');

const createPost = (req, res) => {
    const { content, isPublic } = req.body;
    const userId = req.user.id;

    Post.createPost({ userId, content, isPublic }, (err, postId) => {
        if (err) {
            return res.status(500).send('Error creating post');
        }
        res.status(201).json({ id: postId });
    });
};

const getUserPosts = (req, res) => {
    const userId = req.user.id;

    Post.getPostsByUser(userId, (err, posts) => {
        if (err) {
            return res.status(500).send('Error fetching posts');
        }
        res.json(posts);
    });
};

const getPublicPosts = (req, res) => {
    Post.getPublicPosts((err, posts) => {
        if (err) {
            return res.status(500).send('Error fetching posts');
        }
        res.json(posts);
    });
};

module.exports = {
    createPost,
    getUserPosts,
    getPublicPosts
};
