import React, { useState, useEffect } from 'react';
import './MessagingComponent.css'; 

const MessagingComponent = () => {
  const [message, setMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [socket, setSocket] = useState(null);


  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && message.trim()) {
      sendMessage();
    }
  };

  // Connects to the WebSocket server
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => console.log('Connected to the server');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setReceivedMessages((prevMessages) => [...prevMessages, data]);
    };
    ws.onerror = (error) => console.error('WebSocket error:', error);
    ws.onclose = () => console.log('Disconnected from the server');

    setSocket(ws);

    // Clean up function to close the WebSocket connection
    return () => {
      ws.close();
    };
  }, []);

  // Sends a message to the WebSocket server
  const sendMessage = () => {
    if (socket && message.trim()) {
      socket.send(JSON.stringify({ content: message, sent: true }));
      setMessage('');
    }
  };

  return (
    <div className="ssl-messaging-container">
      <div className="ssl-messaging-header">
        Secure Chat
      </div>
      <div className="messages-area">
        {receivedMessages.map((msg, index) => (
          <div key={index} className={`message ${msg.sent ? 'sent' : 'received'}`}>
            <span className="message-text">{msg.content}</span>
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default MessagingComponent;
