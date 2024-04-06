import React, { useState } from 'react';
import './CipherComponent.css';

function CaesarCipher() {
  const [text, setText] = useState('');
  const [shift, setShift] = useState(0);
  const [result, setResult] = useState('');
  const [mode, setMode] = useState('encrypt');

  const handleEncrypt = () => {
    const encryptedText = text.split('').map(char => {
        return char; 
    }).join('');
    setResult(encryptedText);
  };

  const handleDecrypt = () => {
    const decryptedText = text.split('').map(char => {
        return char; 
    }).join('');
    setResult(decryptedText);
  };

  const handleAction = () => {
    if (mode === 'encrypt') {
      handleEncrypt();
    } else {
      handleDecrypt();
    }
  };

  const handleReset = () => {
    setText('');
    setResult('');
  };

  const handleModeSwitch = () => {
    setMode(mode === 'encrypt' ? 'decrypt' : 'encrypt');
    handleReset();
  };

  return (
    <div className="cipher-container">
      <h2>Caesar Cipher</h2>
      <textarea
        placeholder={mode === 'encrypt' ? 'Enter plain text' : 'Enter cipher text'}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <input
        type="number"
        value={shift}
        onChange={(e) => setShift(parseInt(e.target.value, 10))}
        placeholder="Shift"
      />
      <button onClick={handleAction}>{mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}</button>
      <button className="reset-button" onClick={handleReset}>Reset</button>
      {result && (
        <div className="result-text">
          <p>{result}</p>
        </div>
      )}
      <button onClick={handleModeSwitch}>
        Switch to {mode === 'encrypt' ? 'Decrypt' : 'Encrypt'}
      </button>
    </div>
  );
}

export default CaesarCipher;
