import React, { useState } from 'react';
import './RSACipher.css';

function RSACipher() {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [mode, setMode] = useState('encrypt');

  const generateKeys = async () => {
    const response = await fetch('http://localhost:5000/generate-keys');
    const keys = await response.json();
    setPublicKey(keys.publicKey);
    setPrivateKey(keys.privateKey);
  };

  const handleEncrypt = async () => {
    const response = await fetch('http://localhost:5000/rsa-encrypt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, publicKey }),
    });
    const data = await response.json();
    setResult(data.cipherText);
  };

  const handleDecrypt = async () => {
    const response = await fetch('http://localhost:5000/rsa-decrypt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cipherText: text, privateKey }),
    });
    const data = await response.json();
    setResult(data.plainText);
  };

  const handleReset = () => {
    setText('');
    setResult('');
  };

  return (
    <div className="rsa-cipher">
      <h2>RSA {mode === 'encrypt' ? 'Encryption' : 'Decryption'}</h2>
      <button onClick={generateKeys}>Generate Keys</button>
      <textarea
        placeholder="Public Key"
        value={publicKey}
        readOnly
      ></textarea>
      <textarea
        placeholder="Private Key"
        value={privateKey}
        readOnly
      ></textarea>
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
      <div className="result-text">{result && <p>{result}</p>}</div>
      <button onClick={() => setMode(mode === 'encrypt' ? 'decrypt' : 'encrypt')}>
        Switch to {mode === 'encrypt' ? 'Decrypt' : 'Encrypt'}
      </button>
    </div>
  );
}

export default RSACipher;
