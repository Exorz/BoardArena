// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
cors: {
origin: '*',
methods: ['GET', 'POST'],
},
});

// Middleware
app.use(express.json());
app.use(cors());

// Auth Routes
app.use('/api/auth', authRoutes);

// Simple Route for Testing
app.get('/', (req, res) => {
res.send('Backend server is running');
});

// Socket.IO connection
io.on('connection', (socket) => {
console.log('New client connected');
socket.on('disconnect', () => {
console.log('Client disconnected');
});
});

// Connect to MongoDB
mongoose.connect('mongodb+srv://johannessonandree:Fiskbulle1a@db.bo2i6.mongodb.net/db?retryWrites=true&w=majority')
    .then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Could not connect to MongoDB', err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
