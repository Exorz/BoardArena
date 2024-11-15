const jwt = require('jsonwebtoken');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Hantera när en användare går med i en lobby
    socket.on('joinLobby', ({ lobbyId, token }) => {
      console.log('joinLobby event triggered.');
      console.log('Lobby ID:', lobbyId);
      console.log('Token received:', token);

      if (!token) {
        console.error('No token provided. Disconnecting user.');
        socket.emit('error', { message: 'No token provided.' });
        socket.disconnect();
        return;
      }

      try {
        // Validera token
        const user = jwt.verify(token, process.env.JWT_SECRET);
        const { userId, username } = user;

        console.log(`User authenticated: ${username} (ID: ${userId})`);
        console.log(`User joining lobby: ${lobbyId}`);

        // Lägg till användaren i lobbyn
        socket.join(lobbyId);

        // Uppdatera spelarantal
        const onlineUsers = io.sockets.adapter.rooms.get(lobbyId)?.size || 0;
        console.log(`Online users in lobby ${lobbyId}: ${onlineUsers}`);

        // Skicka uppdatering till alla i lobbyn
        io.to(lobbyId).emit('updatePlayerCount', onlineUsers);
      } catch (err) {
        console.error('Error validating token:', err.message);
        socket.emit('error', { message: 'Invalid token.' });
        socket.disconnect();
      }
    });

    // Hantera frånkoppling
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);

      // Hämta lobbyn som användaren var ansluten till
      const lobbyRooms = Array.from(socket.rooms).filter((room) => room !== socket.id);

      // Uppdatera spelarantal för varje lobby
      lobbyRooms.forEach((lobbyId) => {
        const onlineUsers = io.sockets.adapter.rooms.get(lobbyId)?.size || 0;
        console.log(`Updated online users in lobby ${lobbyId}: ${onlineUsers}`);
        io.to(lobbyId).emit('updatePlayerCount', onlineUsers);
      });
    });
  });
};
