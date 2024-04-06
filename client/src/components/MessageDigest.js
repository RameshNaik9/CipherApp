import React, { useState } from 'react';
import './MessageDigest.css'; 

function MessageDigest() {
  const [text, setText] = useState('');
  const [digest, setDigest] = useState('');

  const handleComputeDigest = async () => {
    const response = await fetch('http://localhost:5000/sha256', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });
    const data = await response.json();
    setDigest(data.digest);
  };

  const handleReset = () => {
    setText('');
    setDigest('');
  };

  return (
    <div className="message-digest">
      <h2>SHA-256 Message Digest</h2>
      <textarea
        placeholder="Enter message"
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>
      <button onClick={handleComputeDigest}>Compute Digest</button>
      <button className="reset-button" onClick={handleReset}>Reset</button>
      {digest && (
        <div className="result-text">
          <p>Digest:</p>
          <p>{digest}</p>
        </div>
      )}
    </div>
  );
}

export default MessageDigest;
