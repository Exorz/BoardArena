import { io } from 'socket.io-client';

const socket = io('http://90.143.144.169:3000', {
  transports: ['websocket'],
  autoConnect: false,
});

socket.on('connect', () => {
  console.log(`Connected to server with socket ID: ${socket.id}`);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

const connectWithToken = () => {
  const token = localStorage.getItem('authToken');
  console.log('Attempting to connect with token:', token);
  if (!token) {
    console.error('No auth token found. Unable to connect.');
    return;
  }
  socket.auth = { token };
  socket.connect();
};

const joinLobby = (lobbyId) => {
  console.log(`Joining lobby: ${lobbyId}`);
  const token = localStorage.getItem('authToken');
  socket.emit('joinLobby', { lobbyId, token });
};

export { socket, connectWithToken, joinLobby };
