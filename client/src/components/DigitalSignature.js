import React, { useState } from 'react';
import './DigitalSignature.css';
function DigitalSignature() {
  const [message, setMessage] = useState('');
  const [signature, setSignature] = useState('');
  const [verificationResult, setVerificationResult] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');

  const handleSign = async () => {
    const response = await fetch('http://localhost:5000/sign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, privateKey }),
    });
    const data = await response.json();
    setSignature(data.signature);
  };

  const handleVerify = async () => {
    const response = await fetch('http://localhost:5000/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, signature, publicKey }),
    });
    const data = await response.json();
    setVerificationResult(data.verified ? 'Signature is valid' : 'Signature is invalid');
  };

  const handleKeyGeneration = async () => {
    const response = await fetch('http://localhost:5000/generate-keys');
    const keys = await response.json();
    setPublicKey(keys.publicKey);
    setPrivateKey(keys.privateKey);
  };

  const handleReset = () => {
    setMessage('');
    setSignature('');
    setVerificationResult('');
  };

  return (
    <div className="digital-signature">
      <h2>Digital Signature</h2>
      <button onClick={handleKeyGeneration}>Generate Keys</button>
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
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></textarea>
      <button onClick={handleSign}>Sign Message</button>
      <textarea
        placeholder="Signature"
        value={signature}
        readOnly
      ></textarea>
      <button onClick={handleVerify}>Verify Signature</button>
      <div className="verification-result">{verificationResult}</div>
      <button className="reset-button" onClick={handleReset}>Reset</button>
    </div>
  );
}

export default DigitalSignature;
