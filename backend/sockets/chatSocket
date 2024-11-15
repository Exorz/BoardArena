const Message = require('../models/message');

module.exports = (io) => {
  io.on('connection', (socket) => {
    // När en spelare skickar ett meddelande
    socket.on('sendMessage', async ({ lobbyId, text, username }) => {
      try {
        const message = { text, sender: username };

        // Hämta eller skapa lobbyens meddelandelista
        let lobbyMessages = await Message.findOne({ lobbyId });
        if (!lobbyMessages) {
          lobbyMessages = new Message({ lobbyId, messages: [] });
        }

        // Lägg till meddelandet och begränsa till 50
        lobbyMessages.messages.push(message);
        if (lobbyMessages.messages.length > 50) {
          lobbyMessages.messages.shift();
        }
        await lobbyMessages.save();

        // Skicka meddelandet till alla i lobbyn
        io.to(lobbyId).emit('newMessage', message);
      } catch (err) {
        console.error('Error sending message:', err.message);
      }
    });

    // Hämta historiska meddelanden vid anslutning
    socket.on('requestChatHistory', async (lobbyId) => {
      try {
        const lobbyMessages = await Message.findOne({ lobbyId });
        if (lobbyMessages) {
          socket.emit('chatHistory', lobbyMessages.messages);
        }
      } catch (err) {
        console.error('Error fetching chat history:', err.message);
      }
    });
  });
};
