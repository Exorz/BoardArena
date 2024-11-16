import { useEffect, useState } from "react";
import { socket } from "../../socketManager"; // Hantera socket i socketManager.js
import styles from "../../styles/Lobby.module.css";

export default function PlayerCount({ game }) {
  const [playerCount, setPlayerCount] = useState(1);

  useEffect(() => {
    // Lyssna på uppdateringar av spelarantal
    socket.on("updatePlayerCount", (count) => {
      console.log("Received updated player count:", count);
      setPlayerCount(count);
    });

    // Rensa lyssnare vid avmontering
    return () => {
      console.log("Removing updatePlayerCount listener");
      socket.off("updatePlayerCount");
    };
  }, [game]);

  return <p className={styles.onlineCount}>Online: {playerCount}</p>;
}
