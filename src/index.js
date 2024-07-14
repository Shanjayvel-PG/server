const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const db = require('./db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const initDb = () => {
    const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

    const createPostsTable = `
    CREATE TABLE IF NOT EXISTS posts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      content TEXT NOT NULL,
      is_public BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `;

  const createPreviousPasswordTable = `CREATE TABLE  IF NOT EXISTS  previous_passwords (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
`

    db.query(createUsersTable, (err) => {
        if (err) {
            console.error('Error creating users table:', err);
            return;
        }
        console.log('Users table created or already exists.');
    });

    db.query(createPostsTable, (err) => {
        if (err) {
            console.error('Error creating posts table:', err);
            return;
        }
        console.log('Posts table created or already exists.');
    });

    db.query(createPreviousPasswordTable, (err) => {
    if (err) {
      console.error('Error creating users table:', err);
      return;
    }
    console.log('Users table created or already exists.');
  });
    
};

initDb();

app.use('/users', userRoutes);
app.use('/posts', postRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Social App');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
