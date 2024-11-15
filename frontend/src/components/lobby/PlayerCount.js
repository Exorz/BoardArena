import { useEffect, useState } from 'react';
import socket from '../../socket';
import styles from '../../styles/Lobby.module.css';

export default function PlayerCount({ game }) {
  const [playerCount, setPlayerCount] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    console.log('Emitting joinLobby with:', { lobbyId: game, token }); // Logga joinLobby
    socket.emit('joinLobby', { lobbyId: game, token });

    socket.on('updatePlayerCount', (count) => {
      console.log('Received updated player count:', count); // Logga spelarantal
      setPlayerCount(count);
    });

    return () => {
      console.log('Removing updatePlayerCount listener');
      socket.off('updatePlayerCount');
    };
  }, [game]);

  return <p className={styles.onlineCount}>Online: {playerCount}</p>;
}
