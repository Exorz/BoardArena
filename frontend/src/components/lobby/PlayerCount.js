import { useEffect, useState } from "react";
import { socket } from "../../socketManager";
import styles from "../../styles/Lobby.module.css";

export default function PlayerCount({ game }) {
  const [playerCount, setPlayerCount] = useState(1);

  useEffect(() => {
    socket.on("updatePlayerCount", (count) => {
      console.log("Player count updated to:", count);
      setPlayerCount(count);
    });

    return () => {
      console.log("Removing updatePlayerCount listener");
      socket.off("updatePlayerCount");
    };
  }, [game]);

  return <p className={styles.onlineCount}>Online: {playerCount}</p>;
}
