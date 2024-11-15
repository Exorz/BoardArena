const jwt = require('jsonwebtoken');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // När en spelare går med i en lobby
    socket.on('joinLobby', ({ lobbyId, token }) => {
      try {
        // Validera token
        const user = jwt.verify(token, process.env.JWT_SECRET);
        const { userId, username } = user;

        // Lägg till spelaren i lobbyn
        socket.join(lobbyId);
        console.log(`${username} joined lobby: ${lobbyId}`);

        // Uppdatera spelarantal
        const onlineUsers = io.sockets.adapter.rooms.get(lobbyId)?.size || 0;
        io.to(lobbyId).emit('updatePlayerCount', onlineUsers);
      } catch (err) {
        console.error('Invalid token:', err.message);
        socket.disconnect();
      }
    });

    // Hantera frånkoppling
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      const lobbyRooms = Array.from(socket.rooms).filter((room) => room !== socket.id);
      lobbyRooms.forEach((lobbyId) => {
        const onlineUsers = io.sockets.adapter.rooms.get(lobbyId)?.size || 0;
        io.to(lobbyId).emit('updatePlayerCount', onlineUsers);
      });
    });
  });
};
