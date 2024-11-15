const jwt = require('jsonwebtoken');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // När en spelare går med i en lobby
    socket.on('joinLobby', ({ lobbyId, token }) => {
      try {
        // Validera token
        const user = jwt.verify(token, process.env.JWT_SECRET);
        const { userId, username } = user;

        // Lägg till spelaren i lobbyn
        socket.join(lobbyId);
        console.log(`User ${username} (${userId}) joined lobby: ${lobbyId}`);

        // Uppdatera spelarantal
        const onlineUsers = io.sockets.adapter.rooms.get(lobbyId)?.size || 0;
        io.to(lobbyId).emit('updatePlayerCount', onlineUsers);

        // Logga vilka användare som finns i lobbyn
        console.log(`Online users in lobby ${lobbyId}:`, onlineUsers);
      } catch (err) {
        console.error('Invalid token:', err.message);
        socket.emit('error', { message: 'Invalid token. Disconnecting.' });
        socket.disconnect();
      }
    });

    // Hantera frånkoppling
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
      const lobbyRooms = Array.from(socket.rooms).filter((room) => room !== socket.id);

      lobbyRooms.forEach((lobbyId) => {
        const onlineUsers = io.sockets.adapter.rooms.get(lobbyId)?.size || 0;

        // Skicka uppdaterad spelarantal till alla i lobbyn
        io.to(lobbyId).emit('updatePlayerCount', onlineUsers);
        console.log(`Updated online users in lobby ${lobbyId}:`, onlineUsers);
      });
    });
  });
};
