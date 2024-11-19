const mongoose = require('mongoose');

// Definiera användarmodellen
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
  },
  password: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    auto: true, // Detta gör att MongoDB skapar ett unikt ID för varje användare
  }
});

// Skapa och exportera modellen
const User = mongoose.model('User', userSchema);

module.exports = User;
