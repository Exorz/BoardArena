const { socketAuthenticate } = require('../middlewares/authMiddleware');
const User = require('../models/User'); // Import User model

module.exports = (io) => {
    

    io.use(socketAuthenticate);

    io.on('connection', (socket) => {
        

        // Disconnect if user data is missing
        if (!socket.user || !socket.user._id || !socket.user.username) {
            console.warn('[mainsocket.js] Invalid user data. Disconnecting:', socket.id);
            socket.disconnect();
            return;
        }

        // Track user in onlineUsers with in-memory update
        onlineUsers.set(socket.user._id, { lastActive: Date.now(), isOnline: true });
        logger.debug(`[mainsocket.js] User ${socket.user.username} is now tracked as online (in-memory)`);

        // Join Lobby
        socket.on('joinLobby', ({ game }) => {
            

            // Initialize lobby if it doesn't exist
            if (!lobbies[game]) {
                lobbies[game] = [];
                logger.debug(`[mainsocket.js] Lobby created for game: ${game}`);
            }

            // Add user to lobby if not already in it
            if (!lobbies[game].includes(socket.user.username)) {
                lobbies[game].push(socket.user.username);
                socket.join(game);
                console.log(`[mainsocket.js] User ${socket.user.username} joined game lobby: ${game}`);

                // Update and broadcast player count
                const playerCount = lobbies[game].length;
                io.to(game).emit('updatePlayerCount', playerCount);
                logger.debug(`[mainsocket.js] Player count for ${game} updated and broadcasted: ${playerCount}`);
            } else {
                logger.debug(`[mainsocket.js] User ${socket.user.username} is already in game lobby: ${game}`);
            }
        });

        // Handle Disconnect
        socket.on('disconnect', () => {
           

            // Update in-memory store to mark user offline
            onlineUsers.set(socket.user._id, { lastActive: Date.now(), isOnline: false });
            logger.debug(`[mainsocket.js] User ${socket.user.username} set to offline (in-memory)`);

            // Remove user from any lobbies they were part of
            for (const game in lobbies) {
                const lobby = lobbies[game];
                const userIndex = lobby.indexOf(socket.user.username);

                if (userIndex !== -1) {
                    lobby.splice(userIndex, 1); // Remove user from lobby
                    const newCount = lobby.length;
                    io.to(game).emit('updatePlayerCount', newCount); // Broadcast updated count
                    logger.debug(`[mainsocket.js] User ${socket.user.username} removed from ${game} lobby. New player count: ${newCount}`);
                } else {
                    logger.debug(`[mainsocket.js] User ${socket.user.username} was not found in ${game} lobby`);
                }
            }
        });

        // Additional handlers
       
        chatSocketHandler(io, socket);
        tableSocketHandler(io, socket);
    });

    // Periodic batch update every 5 minutes
    setInterval(async () => {
        logger.debug('[mainsocket.js] Running periodic batch update for online users');
        for (const [userId, { lastActive, isOnline }] of onlineUsers.entries()) {
            try {
                await User.findByIdAndUpdate(userId, { lastActive, isOnline });
                logger.debug(`[mainsocket.js] Updated user ${userId} in database with isOnline: ${isOnline} and lastActive: ${new Date(lastActive)}`);
            } catch (error) {
                logger.error(`[mainsocket.js] Error updating user ${userId} in batch update:`, error);
            }
        }
    }, 300000); // Update every 5 minutes (300,000 ms)
};
