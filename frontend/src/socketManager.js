import { io } from "socket.io-client";

let socket;

export const connectWithToken = (token) => {
  const SERVER_URL = "http://90.143.144.169:3000"; // Uppdatera URL om nödvändigt
  console.log("Attempting to connect with token:", token);

  socket = io(SERVER_URL, {
    auth: {
      token: token || "default-token", // Hämta token dynamiskt om möjligt
    },
    transports: ["websocket"], // Prioritera WebSocket
    timeout: 5000, // Timeout för anslutningar
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("connect_error", (error) => {
    console.error("Connection error:", error.message);
  });

  socket.on("disconnect", (reason) => {
    console.warn("Socket disconnected:", reason);
  });

  return socket;
};

export const joinLobby = (lobbyId) => {
  if (!socket) {
    console.error("Socket is not connected. Call `connectWithToken` first.");
    return;
  }

  console.log("Joining lobby:", lobbyId);
  socket.emit("joinLobby", { lobbyId }, (ack) => {
    if (ack.error) {
      console.error("Error joining lobby:", ack.error);
    } else {
      console.log("Successfully joined lobby:", lobbyId);
    }
  });
};

export const getSocket = () => socket;
