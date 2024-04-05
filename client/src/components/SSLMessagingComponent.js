import React, { useState, useEffect } from 'react';

function SSLMessagingComponent() {
    const [message, setMessage] = useState('');
    const [receivedMessages, setReceivedMessages] = useState([]);
    const [ws, setWs] = useState(null);

    useEffect(() => {
        const webSocket = new WebSocket('wss://localhost:8080');

        webSocket.onmessage = (event) => {
            setReceivedMessages((prevMessages) => [...prevMessages, { content: event.data, timestamp: new Date().toLocaleTimeString() }]);
        };

        webSocket.onopen = () => {
            console.log('WebSocket connected');
        };

        webSocket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        setWs(webSocket);

        return () => {
            webSocket.close();
        };
    }, []);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    const sendMessage = () => {
        if (ws && message) {
            ws.send(message);
            setMessage(''); // Clear the message input after sending
        }
    };

    // Example of using determineSenderClass function, can be modified according to actual logic
    function determineSenderClass(msg) {
        // Placeholder logic to determine message sender class
        return 'sent'; // Or 'received' based on the condition
    }

    return (
        <div className="ssl-messaging-container">
            <div className="ssl-messaging-header">
                Secure Chat
            </div>
            <div className="messages-area">
                {receivedMessages.map((msg, index) => (
                    <div key={index} className={`message ${determineSenderClass(msg)}`}>
                        <span className="message-text">{msg.content}</span>
                        <span className="message-timestamp">{msg.timestamp}</span>
                    </div>
                ))}
            </div>
            <div className="input-area">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
            </div>
        </div>
    );
}

export default SSLMessagingComponent;
