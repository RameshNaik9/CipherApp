import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import AESCipher from './components/AESCipher'; 
import RSACipher from './components/RSACipher';
import MessageDigest from './components/MessageDigest'; 
import Signup from './components/Signup'; 
import Header from './components/Header.js';
import LoginAdmin from './components/LoginAdmin';
import AdminHome from './components/AdminHome'; 


function App() {
  const [currentCipher, setCurrentCipher] = useState('');

  const handleLogin = async (username, password) => {
    console.log('Logging in with:', username, password);
  };

  const handleCipherSelection = (cipher) => {
    setCurrentCipher(cipher);
  };
  
  const renderCipherComponent = () => {
    switch (currentCipher) {
            case 'aes':
                return <AESCipher />;
            case 'rsa':
                return <RSACipher />;
            case 'digest':
                return <MessageDigest />;
      default:
        return null;
    }
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={
          <div>
            <Signup />
          </div>
          } /> 
          <Route path="/admin-login" element={
        <div>
          <Header />
          <LoginAdmin />
        </div>} /> 
          <Route path="/admin-home" element={
          <div>
            <Header />
            <Home onCipherSelection={handleCipherSelection} />
            <AdminHome />
          </div>} />
          <Route path="/home" element={
          <div>
            <Header />
            <Home onCipherSelection={handleCipherSelection} />
          </div>
          } />
          <Route path="/cipher" element={renderCipherComponent()} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
