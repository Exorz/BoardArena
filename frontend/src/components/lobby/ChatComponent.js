import { useEffect, useState } from 'react';
import socket from '../../socket';
import styles from '../../styles/Lobby.module.css';

export default function ChatComponent({ game }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    console.log('Emitting joinLobby with:', { lobbyId: game, token }); // Logga joinLobby
    socket.emit('joinLobby', { lobbyId: game, token });

    // Lyssna på tidigare meddelanden
    socket.emit('requestChatHistory', game);
    console.log('Emitting requestChatHistory for lobby:', game); // Logga requestChatHistory
    socket.on('chatHistory', (chatHistory) => {
      console.log('Received chat history:', chatHistory); // Logga chatHistory
      setMessages(chatHistory);
    });

    // Lyssna på nya meddelanden
    socket.on('newMessage', (message) => {
      console.log('Received new message:', message); // Logga nya meddelanden
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      console.log('Removing listeners for chatHistory and newMessage');
      socket.off('chatHistory');
      socket.off('newMessage');
    };
  }, [game]);

  const sendMessage = () => {
    if (input.trim()) {
      const username = localStorage.getItem('username');
      console.log('Sending message:', { lobbyId: game, text: input, username }); // Logga skickat meddelande
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
