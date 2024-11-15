const Message = require('../models/message');

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('sendMessage', async ({ lobbyId, text, username }) => {
      try {
        console.log(`New message from ${username} in lobby ${lobbyId}: ${text}`);
        let lobbyMessages = await Message.findOne({ lobbyId });
        if (!lobbyMessages) {
          lobbyMessages = new Message({ lobbyId, messages: [] });
        }

        lobbyMessages.messages.push({ text, sender: username });
        if (lobbyMessages.messages.length > 50) {
          lobbyMessages.messages.shift();
        }
        await lobbyMessages.save();

        io.to(lobbyId).emit('newMessage', { text, sender: username });
      } catch (err) {
        console.error('Error sending message:', err.message);
      }
    });

    socket.on('requestChatHistory', async (lobbyId) => {
      try {
        console.log(`Chat history requested for lobby: ${lobbyId}`);
        const lobbyMessages = await Message.findOne({ lobbyId });
        if (lobbyMessages) {
          console.log(`Found chat history for lobby ${lobbyId}:`, lobbyMessages.messages);
          socket.emit('chatHistory', lobbyMessages.messages);
        } else {
          console.log(`No chat history found for lobby ${lobbyId}`);
        }
      } catch (err) {
        console.error('Error fetching chat history:', err.message);
      }
    });
  });
};
