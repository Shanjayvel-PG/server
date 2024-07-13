const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(bodyParser.json());

// MongoDB Connection
// mongoose.connect('mongodb+srv://civilshanjayvel:qUbEKCT01DtHvuSo@cluster0.wlpsauo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });


mongoose.connect('mongodb+srv://civilshanjayvel:qUbEKCT01DtHvuSo@cluster0.wlpsauo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true,  
});

// Event Listeners for MongoDB connection
mongoose.connection.on('connected', () => {
    console.log('MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
    console.log('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

// Routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/postes');

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
