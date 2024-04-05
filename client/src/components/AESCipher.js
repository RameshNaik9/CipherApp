
import React, { useState } from 'react';
import './AESCipher.css';

function AESCipher() {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [mode, setMode] = useState('encrypt'); 


const handleAction = async () => {
  const url = `http://localhost:5000/${mode}`;
  const dataToSend = mode === 'encrypt' ? { text } : { cipherText: text };
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    setResult(data.cipherText || data.plainText);
  } catch (error) {
    console.error('Error during the encryption/decryption process:', error);
    setResult('');
  }
};


  const handleEncrypt = () => {
    setMode('encrypt');
    handleAction();
  };

  const handleDecrypt = () => {
    setMode('decrypt');
    handleAction();
  };

  const handleReset = () => {
    setText('');
    setResult('');
  };

  return (
    <div className="aes-cipher">
      <h2>{mode === 'encrypt' ? 'AES Encryption' : 'AES Decryption'}</h2>
      <textarea
        placeholder={mode === 'encrypt' ? 'Enter plain text' : 'Enter cipher text'}
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>
      {mode === 'encrypt' ? (
        <button onClick={handleEncrypt}>Encrypt</button>
      ) : (
        <button onClick={handleDecrypt}>Decrypt</button>
      )}
      <button className="reset-button" onClick={handleReset}>Reset</button>
      {result && (
        <div className="result-text">
          <p>{mode === 'encrypt' ? 'Encrypted Text:' : 'Decrypted Text:'}</p>
          <p>{result}</p>
        </div>
      )}
      <button onClick={() => setMode(mode === 'encrypt' ? 'decrypt' : 'encrypt')}>
        Switch to {mode === 'encrypt' ? 'Decrypt' : 'Encrypt'}
      </button>
    </div>
  );
}

export default AESCipher;
