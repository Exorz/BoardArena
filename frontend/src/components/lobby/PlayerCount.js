import { useEffect, useState } from "react";
import { getSocket } from "../../socketManager";
import styles from "../../styles/Lobby.module.css";

export default function PlayerCount({ game }) {
  const [playerCount, setPlayerCount] = useState(0);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) {
      console.error("Socket is not initialized. Make sure `connectWithToken` is called.");
      return;
    }

    const handleUpdatePlayerCount = (count) => {
      console.log(`Player count updated for ${game}:`, count);
      setPlayerCount(count);
    };

    // Listen for player count updates
    socket.on("updatePlayerCount", handleUpdatePlayerCount);

    // Request current player count
    console.log(`Requesting player count for lobby: ${game}`);
    socket.emit("getPlayerCount", { lobbyId: game });

    // Cleanup on unmount
    return () => {
      console.log("Removing updatePlayerCount listener");
      socket.off("updatePlayerCount", handleUpdatePlayerCount);
    };
  }, [game]);

  return (
    <div className={styles.playerCount}>
      <strong>Players in Lobby:</strong> {playerCount}
    </div>
  );
}
