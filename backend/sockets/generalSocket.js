const jwt = require('jsonwebtoken');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('joinLobby', ({ lobbyId, token }) => {
      try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        const { userId, username } = user;
        console.log(`User ${username} (${userId}) is joining lobby: ${lobbyId}`);

        socket.join(lobbyId);
        const onlineUsers = io.sockets.adapter.rooms.get(lobbyId)?.size || 0;
        console.log(`Current online users in lobby ${lobbyId}: ${onlineUsers}`);

        io.to(lobbyId).emit('updatePlayerCount', onlineUsers);
      } catch (err) {
        console.error('Invalid token on joinLobby:', err.message);
        socket.emit('error', { message: 'Invalid token. Disconnecting.' });
        socket.disconnect();
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
      const lobbyRooms = Array.from(socket.rooms).filter((room) => room !== socket.id);
      lobbyRooms.forEach((lobbyId) => {
        const onlineUsers = io.sockets.adapter.rooms.get(lobbyId)?.size || 0;
        console.log(`Updated online users in lobby ${lobbyId}: ${onlineUsers}`);
        io.to(lobbyId).emit('updatePlayerCount', onlineUsers);
      });
    });
  });
};
