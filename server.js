const express = require('express'); 
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const morgan = require('morgan');
const { authenticateToken } = require('./middlewares/authMiddleware');
const isAuthenticated = authenticateToken; // Alias för bättre läsbarhet


// Middleware for handling JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (CSS, JavaScript, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect('mongodb+srv://johannessonandree:Fiskbulle1a@db.bo2i6.mongodb.net/db?retryWrites=true&w=majority')
    .then(() => {
       
    });

// Import routes
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

const leaderboardRoutes = require('./routes/leaderboard');
app.use('/leaderboard', leaderboardRoutes);


// Serve HTML pages

app.get('/lobbies/:game/lobby.html', isAuthenticated, (req, res) => {
    const { game } = req.params;
    const filePath = path.join(__dirname, 'views', 'lobbies', game, 'lobby.html');

    console.log(`Försöker ladda lobby för spelet: ${game}`);
    res.sendFile(filePath);
});



// Route för How to Play filer
app.get('/howto/:game', (req, res) => {
    const game = req.params.game;
    res.sendFile(path.join(__dirname, 'views', 'games', 'howto', `howto_${game}.html`));
});

// Route för Leaderboard filer
app.get('/leaderboard/:game', (req, res) => {
    const game = req.params.game;
    res.sendFile(path.join(__dirname, 'views', 'games', 'leaderboard', `leaderboard_${game}.html`));
});




app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/games', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'games.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'contact.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Socket.IO setup
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Main lobby connection


// Game namespace connection

