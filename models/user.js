const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

console.log('[user.js] Initializing User model.');

// Definiera användarschema
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    rank: {
        type: Number,
        default: 0
    },
    gamesPlayed: {
        type: Number,
        default: 0
    },
    lastActive: {
        type: Date,
        default: Date.now // Initialize with current date/time
    },
    isOnline: {
        type: Boolean,
        default: false // Initially set to offline
    }
});

// Pre-save middleware to hash passwords
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        console.log('[user.js] Password not modified, skipping hashing.');
        return next();
    }

    try {
        console.log('[user.js] Hashing password for user:', this.username);
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        console.log('[user.js] Password hashed successfully for user:', this.username);
        next();
    } catch (error) {
        console.error('[user.js] Error hashing password for user:', this.username, error);
        next(error);
    }
});

// Post-save middleware to log user creation
UserSchema.post('save', function(doc) {
    console.log('[user.js] New user saved successfully:', doc.username);
});

// Function to log user activity updates
UserSchema.methods.logActivity = async function() {
    console.log(`[user.js] User activity updated for: ${this.username}, Last Active: ${this.lastActive}`);
    this.lastActive = Date.now(); // Update last active time
    await this.save();
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
