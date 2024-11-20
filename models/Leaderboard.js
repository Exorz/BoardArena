const mongoose = require('mongoose');

// Define schema for leaderboard
const leaderboardSchema = new mongoose.Schema({
    game: {
        type: String,
        required: true // Game type is mandatory
    },
    player_id: {
        type: String,
        required: true, // Player ID is mandatory
        index: true // Optional: index for faster queries
    },
    username: {
        type: String,
        required: true // Username is mandatory
    },
    score: {
        type: Number,
        required: true, // Score is mandatory
        min: 0 // Ensure score is non-negative
    },
    timestamp: {
        type: Date,
        default: Date.now // Set default value to current date and time
    }
});

// Add a unique constraint to prevent duplicate entries for the same game and player
leaderboardSchema.index({ game: 1, player_id: 1 }, { unique: true });

// Create the model
const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);

// Export the model for use in other parts of the application
module.exports = Leaderboard;
