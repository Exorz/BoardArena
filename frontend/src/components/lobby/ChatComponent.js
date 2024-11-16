import { useEffect, useState } from "react";
import { getSocket } from "../../socketManager";
import styles from "../../styles/Lobby.module.css";

export default function ChatComponent({ game }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const socket = getSocket();
    if (!socket) {
      console.error("Socket is not initialized. Make sure `connectWithToken` is called.");
      return;
    }

    const handleChatHistory = (chatHistory) => {
      console.log("Chat history received:", chatHistory);
      setMessages(chatHistory);
    };

    const handleNewMessage = (message) => {
      console.log("New message received:", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    // Listen for chat events
    socket.on("chatHistory", handleChatHistory);
    socket.on("newMessage", handleNewMessage);

    // Request chat history
    console.log(`Requesting chat history for lobby: ${game}`);
    socket.emit("getChatHistory", { lobbyId: game });

    // Cleanup on unmount
    return () => {
      console.log("Removing listeners for chatHistory and newMessage");
      socket.off("chatHistory", handleChatHistory);
      socket.off("newMessage", handleNewMessage);
    };
  }, [game]);

  const sendMessage = () => {
    const socket = getSocket();
    if (!socket) {
      console.error("Socket is not initialized. Make sure `connectWithToken` is called.");
      return;
    }

    if (newMessage.trim() === "") return;

    const messageData = {
      lobbyId: game,
      text: newMessage,
      username: "Admin", // Replace with dynamic username
    };

    console.log("Sending message:", messageData);
    socket.emit("sendMessage", messageData, (ack) => {
      if (ack.error) {
        console.error("Error sending message:", ack.error);
      } else {
        console.log("Message sent successfully");
        setNewMessage("");
      }
    });
  };

  return (
    <div className={styles.chatComponent}>
      <div className={styles.chatMessages}>
        {messages.map((message, index) => (
          <div key={index} className={styles.chatMessage}>
            <strong>{message.username}: </strong>
            {message.text}
          </div>
        ))}
      </div>
      <div className={styles.chatInput}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className={styles.chatInputField}
        />
        <button onClick={sendMessage} className={styles.chatSendButton}>
          Send
        </button>
      </div>
    </div>
  );
}
