import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import styles from '../../styles/Lobby.module.css';

const socket = io('http://90.143.144.169:3000');

export default function PlayerCount({ game }) {
  const [playerCount, setPlayerCount] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    socket.emit('joinLobby', { lobbyId: game, token });

    socket.on('updatePlayerCount', (count) => {
      setPlayerCount(count);
    });

    return () => {
      socket.disconnect();
    };
  }, [game]);

  return <p className={styles.onlineCount}>Online: {playerCount}</p>;
}
