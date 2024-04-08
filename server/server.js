const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;
require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());

const SECRET_KEY = Buffer.from(process.env.SECRET_KEY, 'hex');
const IV_LENGTH = parseInt(process.env.IV_LENGTH, 10);

//Encryption 
function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', SECRET_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

//Decryption
function decrypt(text) {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', SECRET_KEY, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}



app.post('/encrypt', (req, res) => {
  const { text } = req.body;
  try {
    const encryptedText = encrypt(text);
    res.json({ cipherText: encryptedText });
  } catch (error) {
    console.error('Encryption error:', error);
    res.status(500).json({ error: 'Encryption failed' });
  }
});

app.post('/decrypt', (req, res) => {
  const { cipherText } = req.body;
  try {
    const decryptedText = decrypt(cipherText);
    res.json({ plainText: decryptedText });
  } catch (error) {
    console.error('Decryption error:', error);
    res.status(500).json({ error: 'Decryption failed' });
  }
});



// RSA Key Generation
app.get('/generate-keys', (req, res) => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
  });
  res.json({
    publicKey: publicKey.export({ type: 'pkcs1', format: 'pem' }),
    privateKey: privateKey.export({ type: 'pkcs1', format: 'pem' })
  });
});

// RSA Encryption
app.post('/rsa-encrypt', (req, res) => {
  const { text, publicKey } = req.body;
  const encrypted = crypto.publicEncrypt(publicKey, Buffer.from(text));
  res.json({ cipherText: encrypted.toString('base64') });
});

// RSA Decryption
app.post('/rsa-decrypt', (req, res) => {
  const { cipherText, privateKey } = req.body;
  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey,
      passphrase: '', 
    },
    Buffer.from(cipherText, 'base64')
  );
  res.json({ plainText: decrypted.toString() });
});


//SHA 256
app.post('/sha256', (req, res) => {
  const { text } = req.body;
  const hash = crypto.createHash('sha256').update(text).digest('hex');
  res.json({ digest: hash });
});



app.post('/sign', (req, res) => {
  const { message, privateKey } = req.body;
  const signer = crypto.createSign('sha256');
  signer.update(message);
  signer.end();
  const signature = signer.sign(privateKey, 'hex');
  res.json({ signature });
});

app.post('/verify', (req, res) => {
  const { message, signature, publicKey } = req.body;
  const verifier = crypto.createVerify('sha256');
  verifier.update(message);
  verifier.end();
  const verified = verifier.verify(publicKey, signature, 'hex');
  res.json({ verified });
});




app.use(express.json()); // Middleware to parse JSON bodies

app.post('/signup', (req, res) => {
    const { name, username, password, email, phoneNumber } = req.body;

    console.log('Received new user data:', req.body);

    const userData = {
        id: Date.now(),
        name,
        username,
        password,
        email,
        phoneNumber
    };

    const filePath = path.join(__dirname, 'users_data.json');
    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        const users = JSON.parse(data.toString() || '[]');
        users.push(userData);
        fs.writeFile(filePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            res.status(201).json({ message: 'User created', userId: userData.id });
        });
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const filePath = path.join(__dirname, 'users_data.json');

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        const users = JSON.parse(data.toString());
        const user = users.find(u => u.username === username);

        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        res.json({ message: 'User authenticated', authenticated: true });
    });
});

app.post('/admin-login', (req, res) => {
    const { username, password } = req.body;
    const filePath = path.join(__dirname, 'admins_data.json');

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        const admins = JSON.parse(data.toString());
        const admin = admins.find(a => a.username === username);

        if (!admin || admin.password !== password) {
            return res.status(401).json({ error: 'Invalid admin username or password' });
        }

        res.json({ message: 'Admin authenticated', authenticated: true });
    });
});

app.get('/users', (req, res) => {
    const filePath = path.join(__dirname, 'users_data.json');
    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(JSON.parse(data.toString()));
    });
});

app.delete('/users/:userId', (req, res) => {
    const { userId } = req.params;
    const filePath = path.join(__dirname, 'users_data.json');

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        let users = JSON.parse(data.toString());
        users = users.filter(user => user.id !== parseInt(userId, 10));

        fs.writeFile(filePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            res.status(200).json({ message: 'User deleted successfully' });
        });
    });
});


// Caesar Cipher Helper Functions
function caesarCipher(str, amount) {
    if (amount < 0) {
        return caesarCipher(str, amount + 26);
    }
    let output = '';
    for (let i = 0; i < str.length; i++) {
        let char = str[i];
        if (char.match(/[a-z]/i)) {
            let code = str.charCodeAt(i);
            let shift = amount % 26;
            if (code >= 65 && code <= 90) {
                char = String.fromCharCode(((code - 65 + shift) % 26) + 65);
            } else if (code >= 97 && code <= 122) {
                char = String.fromCharCode(((code - 97 + shift) % 26) + 97);
            }
        }
        output += char;
    }
    return output;
}

// Endpoint for Caesar Cipher Encryption
app.post('/caesar-encrypt', (req, res) => {
    const { text, shift } = req.body;
    const encryptedText = caesarCipher(text, shift);
    res.json({ cipherText: encryptedText });
});

// Endpoint for Caesar Cipher Decryption
app.post('/caesar-decrypt', (req, res) => {
    const { text, shift } = req.body;
    const decryptedText = caesarCipher(text, -shift);
    res.json({ plainText: decryptedText });
});

function generateKeySquare(key) {
    const keySquare = [];
    const temp = [];
    const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ';
    let currentKey = key.toUpperCase().replace(/J/g, 'I').replace(/\s/g, '');
    
    // Add unique characters from key
    for (const char of currentKey) {
        if (!temp.includes(char)) {
            temp.push(char);
        }
    }

    // Add remaining letters of the alphabet
    for (const char of alphabet) {
        if (!temp.includes(char)) {
            temp.push(char);
        }
    }

    // Create the 5x5 key square
    while (temp.length) {
        keySquare.push(temp.splice(0, 5));
    }

    return keySquare;
}

function findPosition(keySquare, char) {
    for (let row = 0; row < keySquare.length; row++) {
        for (let col = 0; col < keySquare[row].length; col++) {
            if (keySquare[row][col] === char) {
                return { row, col };
            }
        }
    }
    return { row: -1, col: -1 };
}

function playfairEncrypt(text, key) {
    const keySquare = generateKeySquare(key);
    let encryptedText = '';
    text = text.toUpperCase().replace(/J/g, 'I').replace(/\s/g, '');

    // Split text into pairs and encrypt
    for (let i = 0; i < text.length; i += 2) {
        let pair = text[i];
        if (i + 1 < text.length) {
            pair += text[i + 1] === text[i] ? 'X' : text[i + 1];
        } else {
            pair += 'X';
        }

        const pos1 = findPosition(keySquare, pair[0]);
        const pos2 = findPosition(keySquare, pair[1]);

        if (pos1.row === pos2.row) {
            // Same row
            encryptedText += keySquare[pos1.row][(pos1.col + 1) % 5];
            encryptedText += keySquare[pos2.row][(pos2.col + 1) % 5];
        } else if (pos1.col === pos2.col) {
            // Same column
            encryptedText += keySquare[(pos1.row + 1) % 5][pos1.col];
            encryptedText += keySquare[(pos2.row + 1) % 5][pos2.col];
        } else {
            // Rectangle
            encryptedText += keySquare[pos1.row][pos2.col];
            encryptedText += keySquare[pos2.row][pos1.col];
        }
    }

    return encryptedText;
}

function playfairDecrypt(cipherText, key) {
    const keySquare = generateKeySquare(key);
    let decryptedText = '';
    cipherText = cipherText.toUpperCase().replace(/\s/g, '');

    // Split cipher text into pairs and decrypt
    for (let i = 0; i < cipherText.length; i += 2) {
        const pair = cipherText.substr(i, 2);
        const pos1 = findPosition(keySquare, pair[0]);
        const pos2 = findPosition(keySquare, pair[1]);

        if (pos1.row === pos2.row) {
            // Same row
            decryptedText += keySquare[pos1.row][(pos1.col + 4) % 5]; // 4 is equivalent to -1 mod 5
            decryptedText += keySquare[pos2.row][(pos2.col + 4) % 5];
        } else if (pos1.col === pos2.col) {
            // Same column
            decryptedText += keySquare[(pos1.row + 4) % 5][pos1.col];
            decryptedText += keySquare[(pos2.row + 4) % 5][pos2.col];
        } else {
            // Rectangle
            decryptedText += keySquare[pos1.row][pos2.col];
            decryptedText += keySquare[pos2.row][pos1.col];
        }
    }

    return decryptedText;
}

// Endpoint for Playfair Cipher Encryption
app.post('/playfair-encrypt', (req, res) => {
    const { text, key } = req.body;
    const encryptedText = playfairEncrypt(text, key);
    res.json({ cipherText: encryptedText });
});

// Endpoint for Playfair Cipher Decryption
app.post('/playfair-decrypt', (req, res) => {
    const { text, key } = req.body;
    const decryptedText = playfairDecrypt(text, key);
    res.json({ plainText: decryptedText });
});

// Vigenère Cipher Helper Functions
function vigenereEncrypt(text, key) {
    let encryptedText = '';
    for (let i = 0, j = 0; i < text.length; i++) {
        const char = text.charAt(i);
        if (char.match(/[a-z]/i)) {
            const upper = char === char.toUpperCase();
            let code = text.charCodeAt(i) - (upper ? 65 : 97);
            let shift = key.charCodeAt(j % key.length) - 65;
            code = (code + shift) % 26;
            encryptedText += String.fromCharCode(code + (upper ? 65 : 97));
            j++;
        } else {
            encryptedText += char;
        }
    }
    return encryptedText;
}

function vigenereDecrypt(text, key) {
    let decryptedText = '';
    for (let i = 0, j = 0; i < text.length; i++) {
        const char = text.charAt(i);
        if (char.match(/[a-z]/i)) {
            const upper = char === char.toUpperCase();
            let code = text.charCodeAt(i) - (upper ? 65 : 97);
            let shift = key.charCodeAt(j % key.length) - 65;
            code = (code - shift + 26) % 26;
            decryptedText += String.fromCharCode(code + (upper ? 65 : 97));
            j++;
        } else {
            decryptedText += char;
        }
    }
    return decryptedText;
}

// Endpoint for Vigenère Cipher Encryption
app.post('/vigenere-encrypt', (req, res) => {
    const { text, key } = req.body;
    const encryptedText = vigenereEncrypt(text, key);
    res.json({ cipherText: encryptedText });
});

// Endpoint for Vigenère Cipher Decryption
app.post('/vigenere-decrypt', (req, res) => {
    const { text, key } = req.body;
    const decryptedText = vigenereDecrypt(text, key);
    res.json({ plainText: decryptedText });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});