const Message = require('../models/message');

module.exports = (io) => {
  io.on('connection', (socket) => {
   socket.on('sendMessage', async ({ lobbyId, text, username }) => {
  try {
    console.log(`Message received: ${text} from ${username} in ${lobbyId}`);
    // Validera att användaren är autentiserad
    const token = socket.handshake.auth?.token || null; // Hämta token om möjligt
    if (!token) {
      console.error('No token provided for sendMessage');
      return;
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);
    console.log(`Valid token for user: ${user.username}`);

    // Spara meddelandet
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
