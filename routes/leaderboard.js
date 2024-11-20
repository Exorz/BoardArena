// Exempel: i routes/leaderboard.js
const express = require('express');
const router = express.Router();
const Leaderboard = require('../models/Leaderboard'); // Importera modellen

// Dynamisk route för att hämta leaderboard för ett specifikt spel
router.get('/data/:game', async (req, res) => {
    const { game } = req.params; // Hämta spelets namn från URL:n
    try {
        // Använd en regex för att göra sökningen skiftlägesokänslig
        const leaderboard = await Leaderboard.find({ game: new RegExp(`^${game}$`, 'i') })
            .sort({ score: -1 })
            .limit(10);
        
        res.json(leaderboard);
    } catch (err) {
        console.error("Error fetching leaderboard:", err);
        res.status(500).json({ message: "Error fetching leaderboard data" });
    }
});

module.exports = router;
