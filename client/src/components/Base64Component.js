import React, { useState } from 'react';
import './Base64Component.css';

function Base64Component() {
    const [inputText, setInputText] = useState('');
    const [resultText, setResultText] = useState('');
    const [mode, setMode] = useState('encode');

    const handleEncode = () => {
        const encodedText = btoa(inputText);
        setResultText(encodedText);
    };

    const handleDecode = () => {
        try {
            const decodedText = atob(inputText); 
            setResultText(decodedText);
        } catch (e) {
            setResultText('Error decoding text. Ensure the text is base64 encoded.');
        }
    };

    const handleReset = () => {
        setInputText('');
        setResultText('');
    };

    return (
        <div className="base64-component">
            <h2>Base 64 {mode === 'encode' ? 'Encoding' : 'Decoding'}</h2>
            <textarea
                placeholder={mode === 'encode' ? "Enter text to encode" : "Enter base64 to decode"}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
            ></textarea>
            {mode === 'encode' ? (
                <button onClick={handleEncode}>Encode</button>
            ) : (
                <button onClick={handleDecode}>Decode</button>
            )}
            <button className="reset-button" onClick={handleReset}>Reset</button>
            <div className="result-text">
                {resultText && (
                    <>
                        <p>{mode === 'encode' ? 'Encoded Text:' : 'Decoded Text:'}</p>
                        <p>{resultText}</p>
                    </>
                )}
            </div>
            <button onClick={() => setMode(mode === 'encode' ? 'decode' : 'encode')}>
                Switch to {mode === 'encode' ? 'Decode' : 'Encode'}
            </button>
        </div>
    );
}

export default Base64Component;
