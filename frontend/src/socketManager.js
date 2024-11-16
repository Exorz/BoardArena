import { io } from 'socket.io-client';

// Skapa en Socket.IO-klientinstans
const socket = io('http://90.143.144.169:3000', {
  transports: ['websocket'], // Använd endast WebSocket
  autoConnect: false,        // Förhindrar automatisk anslutning
});

// Hantera anslutning
socket.on('connect', () => {
  console.log(`Connected to server with socket ID: ${socket.id}`);
});

// Hantera frånkoppling
socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

// Funktion för att ansluta till servern med token
const connectWithToken = () => {
  const token = localStorage.getItem('authToken');
  console.log('Attempting to connect with token:', token); // Lägg till denna logg
  if (!token) {
    console.error('No auth token found. Unable to connect.');
    return;
  }
  socket.auth = { token }; // Skicka token i handshake
  socket.connect();
};


// Funktion för att gå med i en lobby
const joinLobby = (lobbyId) => {
  console.log(`Joining lobby: ${lobbyId}`);
  socket.emit('joinLobby', { lobbyId, token: localStorage.getItem('authToken') });
};

// Exportera socket-instansen och funktionerna
export { socket, connectWithToken, joinLobby };
