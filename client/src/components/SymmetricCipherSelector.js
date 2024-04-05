import React, { useState } from 'react';
import './SymmetricCipherSelector.css';
import CaesarCipher from './CaesarCipher';
import PlayfairCipher from './PlayfairCipher'; // Assuming you've created this
import VigenereCipher from './VigenereCipher'; // Assuming you've created this

function SymmetricCipherSelector() {
    const [selectedCipher, setSelectedCipher] = useState('');

    const renderCipherComponent = () => {
        switch (selectedCipher) {
            case 'caesar':
                return <CaesarCipher />;
            case 'playfair':
                return <PlayfairCipher />;
            case 'vigenere':
                return <VigenereCipher />;
            default:
                return <div>Please select a cipher</div>;
        }
    };

    return (
        <div className="symmetric-cipher-selector">
            <select onChange={(e) => setSelectedCipher(e.target.value)} value={selectedCipher}>
                <option value="">Select Cipher</option>
                <option value="caesar">Caesar Cipher</option>
                <option value="playfair">Playfair Cipher</option>
                <option value="vigenere">Vigenère Cipher</option>
            </select>
            {renderCipherComponent()}
        </div>
    );
}

export default SymmetricCipherSelector;
