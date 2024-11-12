import { useState } from 'react';
import styles from '../../styles/Lobby.module.css';

export default function ChatComponent() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'You' }]);
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
