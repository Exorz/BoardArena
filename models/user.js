// /models/User.js
const mongoose = require('mongoose');

// Definiera användarmodellen
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  }
});

// Skapa och exportera modellen
const User = mongoose.model('User', userSchema);

module.exports = User;
