import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import styles from '../../styles/Lobby.module.css';

const socket = io('http://90.143.144.169:3000'); // Backend URL

export default function ChatComponent({ game }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken'); // Hämta token från localStorage
    socket.emit('joinLobby', { lobbyId: game, token });

    // Lyssna på tidigare meddelanden
    socket.emit('requestChatHistory', game);
    socket.on('chatHistory', (chatHistory) => {
      setMessages(chatHistory);
    });

    // Lyssna på nya meddelanden
    socket.on('newMessage', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.disconnect(); // Koppla från vid komponentens avmontering
    };
  }, [game]);

  const sendMessage = () => {
    if (input.trim()) {
      const username = localStorage.getItem('username'); // Antag att användarnamn finns sparat
      socket.emit('sendMessage', { lobbyId: game, text: input, username });
      setInput('');
    }
  };

  return (
    <div className={styles.chatSection}>
      <h3 className={styles.chatTitle}>Chat</h3>
      <div className={styles.chatMessages}>
        {messages.map((msg, index) => (
          <p key={index} className={styles.chatMessage}><strong>{msg.sender}:</strong> {msg.text}</p>
        ))}
      </div>
      <div className={styles.chatInputContainer}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your message..."
          className={styles.chatInput}
        />
        <button onClick={sendMessage} className={styles.chatButton}>Send</button>
      </div>
    </div>
  );
}
