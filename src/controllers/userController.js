const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const dotenv = require('dotenv');
const db = require('../db');

dotenv.config();

const signup = (req, res) => {
    const { username, email, password } = req.body;

    // Check if the username already exists
    User.findByUsername(username, (err, existingUser) => {
        if (err) {
            console.error('Error checking username:', err);
            return res.status(500).json({ error: 'Error checking username' });
        }

        if (existingUser) {
            return res.status(409).json({ status: 'username_exists', message: 'Username already exists' });
        }

        // Check if the email already exists
        User.findUserByEmail(email, (err, existingEmail) => {
            if (err) {
                console.error('Error checking email:', err);
                return res.status(500).json({ error: 'Error checking email' });
            }

            if (existingEmail) {
                return res.status(409).json({ status: 'email_exists', message: 'Email already exists' });
            }

            // Hash the password
            bcrypt.hash(password, 10, (err, hashedPassword) => {
                if (err) {
                    console.error('Error hashing password:', err);
                    return res.status(500).json({ error: 'Error hashing password' });
                }

                // Create the new user
                User.createUser({ username, email, password: hashedPassword }, (err, userId) => {
                    if (err) {
                        console.error('Error creating user:', err);
                        return res.status(500).json({ error: 'Error creating user' });
                    }
                    res.status(201).json({ status: 'success', id: userId });
                });
            });
        });
    });
};

const login = (req, res) => {
    const { email, password } = req.body;

    // Check if the input is an email or username
    User.findUserByEmail(email, (err, userByEmail) => {
        if (err) {
            console.error('Error checking email:', err);
            return res.status(500).json({ error: 'Error checking email' });
        }

        if (userByEmail) {
            bcrypt.compare(password, userByEmail.password, (err, isMatch) => {
                if (err || !isMatch) {
                    return res.status(401).json({ error: 'Invalid email or password' });
                }

                const token = jwt.sign({ id: userByEmail.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                return res.json({ jwt_token: token });
            });
        } else {
            User.findByUsername(email, (err, userByUsername) => {
                if (err) {
                    console.error('Error checking username:', err);
                    return res.status(500).json({ error: 'Error checking username' });
                }

                if (userByUsername) {
                    bcrypt.compare(password, userByUsername.password, (err, isMatch) => {
                        if (err || !isMatch) {
                            return res.status(401).json({ error: 'Invalid username or password' });
                        }

                        const token = jwt.sign({ id: userByUsername.id,username:userByUsername.username}, process.env.JWT_SECRET, { expiresIn: '1h' });
                        return res.json({ jwt_token: token });
                    });
                } else {
                    return res.status(401).json({ error: 'Invalid email/username or password' });
                }
            });
        }
    });
};

const changePassword = (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    User.findUserById(userId, (err, user) => {
        if (err || !user) {
            return res.status(404).json({ error: 'User not found' });
        }

        bcrypt.compare(oldPassword, user.password, (err, isMatch) => {
            if (err || !isMatch) {
                return res.status(401).json({ error: 'Incorrect old password' });
            }

            const prevPasswordQuery = `
                SELECT password_hash FROM previous_passwords 
                WHERE user_id = ? 
                ORDER BY created_at DESC 
                LIMIT 3
            `;
            db.query(prevPasswordQuery, [userId], async (err, prevPasswordResult) => {
                if (err) {
                    return res.status(500).json({ error: 'Error retrieving previous passwords' });
                }

                for (const row of prevPasswordResult) {
                    const isSame = await bcrypt.compare(newPassword, row.password_hash);
                    if (isSame) {
                        return res.status(400).json({ error: 'New password must not be one of the last three passwords used' });
                    }
                }

                bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
                    if (err) {
                        return res.status(500).json({ error: 'Error hashing password' });
                    }

                    User.updatePassword(userId, hashedPassword, (err) => {
                        if (err) {
                            return res.status(500).json({ error: 'Error updating password' });
                        }

                        const insertPrevPasswordQuery = `
                            INSERT INTO previous_passwords (user_id, password_hash) 
                            VALUES (?, ?)
                        `;
                        db.query(insertPrevPasswordQuery, [userId, user.password], (err) => {
                            if (err) {
                                return res.status(500).json({ error: 'Error storing old password' });
                            }

                            res.json({ message: 'Password changed successfully' });
                        });
                    });
                });
            });
        });
    });
};

module.exports = {
    signup,
    login,
    changePassword
};
