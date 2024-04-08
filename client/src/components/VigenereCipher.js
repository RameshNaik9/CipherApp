import React, { useState } from 'react';
import './CipherComponent.css';

function VigenereCipher() {
    const [text, setText] = useState('');
    const [key, setKey] = useState('');
    const [result, setResult] = useState('');
    const [mode, setMode] = useState('encrypt');

    const handleAction = async () => {
        const url = `http://localhost:5000/vigenere-${mode}`;
        const dataToSend = { text, key };

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
        setKey('');
        setResult('');
    };

    const handleModeSwitch = () => {
        setMode(mode === 'encrypt' ? 'decrypt' : 'encrypt');
        setResult('');
    };

    return (
        <div className="cipher-container">
            <h2>{mode === 'encrypt' ? 'Vigenere Encryption' : 'Vigenere Decryption'}</h2>
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={mode === 'encrypt' ? 'Enter plain text' : 'Enter cipher text'}
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
            <button className="reset-button" onClick={handleReset}>
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

export default VigenereCipher;
