import React, { useEffect, useState } from 'react';
import './App.css';
import { io } from 'socket.io-client';

// Create socket connection once
const socket = io('http://localhost:3001');

function App() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected:', socket.id);
    });

    socket.on('receive-message', (msg) => {
      setChat((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('connect');
      socket.off('receive-message');
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        text: message,
        senderId: socket.id,
      };
      socket.emit('send-message', newMessage);
      setChat((prev) => [...prev, newMessage]);
      setMessage('');
    }
  };

  return (
    <div className="App">
      <h2> Socket.IO Chat</h2>
      <div className="chat-box">
        {chat.map((msg, index) => (
          <div
            key={index}
            className={`chat-msg ${
              msg.senderId === socket.id ? 'self' : 'other'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
