const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            previousPasswords: [hashedPassword]
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error creating user' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !await user.isValidPassword(password)) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
});

// Change Password Route
router.post('/change-password', async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !await user.isValidPassword(oldPassword)) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isPreviousPassword = user.previousPasswords.some(
            async (prevPassword) => await bcrypt.compare(newPassword, prevPassword)
        );

        if (isPreviousPassword) {
            return res.status(400).json({ error: 'New password cannot be one of the last three passwords' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        user.previousPasswords.push(hashedNewPassword);
        if (user.previousPasswords.length > 3) {
            user.previousPasswords.shift();
        }

        await user.save();
        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error changing password' });
    }
});

module.exports = router;
