const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../middlewares/authMiddleware');
const JWT_SECRET = process.env.JWT_SECRET || '9399891';

// Register route
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({ username, email, password });
        await user.save();

        // Lägg till användaren i leaderboarden för alla spel med 1500 poäng
        const games = ['Yatzy', 'Battleships']; // Lista av spel, lägg till fler spel vid behov
        for (let game of games) {
            const newEntry = new Leaderboard({
                game: game,
                player_id: user._id,
                username: username,
                score: 1500 // Startpoäng
            });
            await newEntry.save();
        }

        const token = jwt.sign({ _id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
        return res.json({ token, username: user.username });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body; // Update to use username instead of email

    // Find the user by username
    const user = await User.findOne({ username });  // Changed to 'username' field
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ _id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    return res.json({ token, username: user.username });
});


// New route to update last active time for logged-in users
router.post('/update-last-active', authenticateToken, async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user._id, { lastActive: Date.now() });
        res.sendStatus(200);
    } catch (err) {
        res.status(500).json({ message: 'Error updating last active time' });
    }
});

// Protected route for user profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
