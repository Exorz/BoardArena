const jwt = require('jsonwebtoken');
const Message = require('../models/message');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Hantera meddelanden
    socket.on('sendMessage', async ({ lobbyId, text, username, token }) => {
      try {
        console.log(`Message received: "${text}" from ${username} in lobby: ${lobbyId}`);
        if (!token) {
          console.error('No token provided for sendMessage');
          socket.emit('error', { message: 'No token provided.' });
          return;
        }

        const user = jwt.verify(token, process.env.JWT_SECRET);
        console.log(`Valid token for user: ${user.username}`);

        let lobbyMessages = await Message.findOne({ lobbyId });
        if (!lobbyMessages) {
          lobbyMessages = new Message({ lobbyId, messages: [] });
        }

        const newMessage = { text, sender: username };
        lobbyMessages.messages.push(newMessage);

        // Begränsa meddelandehistoriken till 50
        if (lobbyMessages.messages.length > 50) {
          lobbyMessages.messages.shift();
        }

        await lobbyMessages.save();

        // Skicka meddelandet till alla i lobbyn
        io.to(lobbyId).emit('newMessage', newMessage);
      } catch (err) {
        console.error('Error sending message:', err.message);
        socket.emit('error', { message: 'Error sending message.' });
      }
    });

    // Hantera förfrågningar om chattens historik
    socket.on('requestChatHistory', async (lobbyId) => {
      try {
        console.log(`Chat history requested for lobby: ${lobbyId}`);
        const lobbyMessages = await Message.findOne({ lobbyId });
        if (lobbyMessages) {
          console.log(`Found chat history for lobby ${lobbyId}:`, lobbyMessages.messages);
          socket.emit('chatHistory', lobbyMessages.messages);
        } else {
          console.log(`No chat history found for lobby ${lobbyId}`);
          socket.emit('chatHistory', []); // Skicka tom historik om det inte finns några meddelanden
        }
      } catch (err) {
        console.error('Error fetching chat history:', err.message);
        socket.emit('error', { message: 'Error fetching chat history.' });
      }
    });
  });
};
