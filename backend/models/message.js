const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  lobbyId: { type: String, required: true },
  messages: [
    {
      text: { type: String, required: true },
      sender: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('Message', messageSchema);
