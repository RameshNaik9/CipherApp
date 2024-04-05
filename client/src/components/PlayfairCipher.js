import React, { useState } from 'react';
import './CipherComponent.css';

function PlayfairCipher() {
    const [text, setText] = useState('');
    const [key, setKey] = useState('');
    const [result, setResult] = useState('');
    const [mode, setMode] = useState('encrypt');

    const handleEncrypt = () => {
        // Implement Playfair cipher encryption logic here
        setResult('Encrypted text will go here');
    };

    const handleDecrypt = () => {
        // Implement Playfair cipher decryption logic here
        setResult('Decrypted text will go here');
    };

    const handleAction = () => {
        if (mode === 'encrypt') {
            handleEncrypt();
        } else {
            handleDecrypt();
        }
    };

    const handleModeSwitch = () => {
        setMode(mode === 'encrypt' ? 'decrypt' : 'encrypt');
        setResult('');
    };

    return (
        <div className="cipher-container">
            <h2>Playfair Cipher</h2>
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text"
            />
            <input
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Enter key"
            />
            <button onClick={handleAction}>
                {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
            </button>
            <button className="reset-button" onClick={() => setText('')}>
                Reset
            </button>
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

export default PlayfairCipher;