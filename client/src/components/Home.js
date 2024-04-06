import React, { useState } from 'react';
import './Home.css';
import AESCipher from './AESCipher';
import RSACipher from './RSACipher'; 
import MessageDigest from './MessageDigest';
import DigitalSignature from './DigitalSignature';
import Base64Component from './Base64Component';
import SymmetricCipherSelector from './SymmetricCipherSelector';
import MessagingComponent from './MessagingComponent';

function Home({ onCipherSelection }) {
  const [selectedCipher, setSelectedCipher] = useState('');

  const handleSelectChange = (e) => {
      setSelectedCipher(e.target.value);
      if (onCipherSelection) {
          onCipherSelection(e.target.value);
      }
  };
  const renderCipherComponent = () => {
    switch (selectedCipher) {
      case 'aes':
        return <AESCipher />;
      case 'rsa':
        return <RSACipher />;
      case 'digest':
        return <MessageDigest />;
      case 'signature':
        return <DigitalSignature />;
      case 'base64':
        return <Base64Component />;
      case 'ssl':
        return <MessagingComponent />;
      case 'symmetric':
        return <SymmetricCipherSelector />;
      default:
        return null;
    }
  };

  return (
    <div className='home'>
      <h1>Welcome to Cipher App</h1>
      <p>Please select the operation to be performed</p>
      <select value={selectedCipher} onChange={handleSelectChange}>
        <option value="">Select</option>
        <option value="aes">AES Encryption & Decryption</option>
        <option value="rsa">RSA Encryption, Decryption & Key Generation</option>
        <option value="digest">Message Digest</option>
        <option value="signature">Digital Signature</option>
        <option value="base64">Base 64 Encoding/Decoding</option>
        <option value="ssl">SSL Socket</option>
        <option value="symmetric">Symmetric Cipher</option>
      </select>
      {renderCipherComponent()}
    </div>
  );
}

export default Home;
