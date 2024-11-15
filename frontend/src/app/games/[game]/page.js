"use client";

import { useParams } from 'next/navigation';
import PlayerCount from '../../../components/lobby/PlayerCount';
import ChatComponent from '../../../components/lobby/ChatComponent';
import TableComponent from '../../../components/lobby/TableComponent';
import styles from '../../../styles/Lobby.module.css';

export default function GameLobby() {
  const { game } = useParams();

  return (
    <div className={styles.lobbyContainer}>
      <div className={styles.chatContainer}>
        <ChatComponent game={game} />
        <PlayerCount game={game} />
      </div>
      <div className={styles.gameSection}>
        <h2 className={styles.lobbyTitle}>{game} Lobby6</h2>
        <button className={styles.createTableButton}>Create New Table</button>
        <TableComponent game={game} />
      </div>
    </div>
  );
}
