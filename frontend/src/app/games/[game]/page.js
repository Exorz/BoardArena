"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { connectWithToken, joinLobby, getSocket } from "../../../socketManager";
import PlayerCount from "../../../components/lobby/PlayerCount";
import ChatComponent from "../../../components/lobby/ChatComponent";
import TableComponent from "../../../components/lobby/TableComponent";
import styles from "../../../styles/Lobby.module.css";

export default function GameLobby() {
  const { game } = useParams();

  useEffect(() => {
    const token = localStorage.getItem("authToken") || "default-token"; // Hämta token dynamiskt
    const socket = connectWithToken(token);
    joinLobby(game);

    console.log(`Connecting to server and joining lobby: ${game}`);

    return () => {
      console.log(`Cleaning up socket for lobby: ${game}`);
      socket?.disconnect();
    };
  }, [game]);

  return (
    <div className={styles.lobbyContainer}>
      <div className={styles.chatContainer}>
        <ChatComponent game={game} />
        <PlayerCount game={game} />
      </div>
      <div className={styles.gameSection}>
        <h2 className={styles.lobbyTitle}>{game} Lobby</h2>
        <button className={styles.createTableButton}>Create New Table</button>
        <TableComponent game={game} />
      </div>
    </div>
  );
}
