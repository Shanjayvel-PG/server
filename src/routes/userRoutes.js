const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/auth');

// User signup route
router.post('/signup', userController.signup);

// User login route
router.post('/login', userController.login);

// Change password route (requires authentication)
router.post('/change-password', authenticateToken, userController.changePassword);
// router.post('/change-password', async (req, res) => {
//     const { userId, oldPassword, newPassword } = req.body;

//     try {
//         // Retrieve current user password
//         const userQuery = 'SELECT password FROM users WHERE id = ?';
//         const [userResult] = await db.query(userQuery, [userId]);

//         if (userResult.length === 0) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         const currentPasswordHash = userResult[0].password;

//         // Check if the old password matches
//         const match = await bcrypt.compare(oldPassword, currentPasswordHash);
//         if (!match) {
//             return res.status(400).json({ message: 'Old password is incorrect' });
//         }

//         // Retrieve the last three previous passwords
//         const prevPasswordQuery = `
//             SELECT password_hash FROM previous_passwords 
//             WHERE user_id = ? 
//             ORDER BY created_at DESC 
//             LIMIT 3
//         `;
//         const [prevPasswordResult] = await db.query(prevPasswordQuery, [userId]);

//         // Check if the new password is one of the last three used
//         for (const row of prevPasswordResult) {
//             const isSame = await bcrypt.compare(newPassword, row.password_hash);
//             if (isSame) {
//                 return res.status(400).json({ message: 'New password must not be one of the last three passwords used' });
//             }
//         }

//         // Hash the new password
//         const newPasswordHash = await bcrypt.hash(newPassword, 10);

//         // Update the user's password
//         const updatePasswordQuery = 'UPDATE users SET password = ? WHERE id = ?';
//         await db.query(updatePasswordQuery, [newPasswordHash, userId]);

//         // Insert the old password into previous_passwords table
//         const insertPrevPasswordQuery = 'INSERT INTO previous_passwords (user_id, password_hash) VALUES (?, ?)';
//         await db.query(insertPrevPasswordQuery, [userId, currentPasswordHash]);

//         res.status(200).json({ message: 'Password changed successfully' });
//     } catch (err) {
//         console.error('Error changing password:', err);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

module.exports = router;
