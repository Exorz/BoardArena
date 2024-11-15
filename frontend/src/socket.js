// frontend/src/socket.js
import { io } from 'socket.io-client';

// Byt URL till din backend-server
const socket = io('http://90.143.144.169:3000', {
  transports: ['websocket'], // Säkerställ att WebSocket används
  autoConnect: false, // Hindrar automatisk anslutning tills explicit startas
});

export default socket;
