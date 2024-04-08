import React, { useState } from 'react';
import './CipherComponent.css';

function CaesarCipher() {
  const [text, setText] = useState('');
  const [shift, setShift] = useState(0);
  const [result, setResult] = useState('');
  const [mode, setMode] = useState('encrypt');

  const handleAction = async () => {
    const url = `http://localhost:5000/caesar-${mode}`;
    const dataToSend = { text, shift: parseInt(shift, 10) };

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

  const handleReset = () => {
    setText('');
    setShift(0);
    setResult('');
  };

  return (
    <div className="cipher-container">
      <h2>{mode === 'encrypt' ? 'Caesar Encryption' : 'Caesar Decryption'}</h2>
      <input
        placeholder={mode === 'encrypt' ? 'Enter plain text' : 'Enter cipher text'}
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></input>
      <input
        type="number"
        placeholder="Shift number"
        value={shift}
        onChange={(e) => setShift(e.target.value)}
      />
      <button onClick={handleAction}>{mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}</button>
      <button onClick={handleReset}>Reset</button>
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

export default CaesarCipher;
