const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());


const SECRET_KEY = Buffer.from(process.env.SECRET_KEY, 'hex');
const IV_LENGTH = parseInt(process.env.IV_LENGTH, 10);


function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', SECRET_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

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



// const https = require('https');
// const WebSocket = require('ws');
// const server = https.createServer({
//   cert: fs.readFileSync('cert.pem'),
//   key: fs.readFileSync('key.pem')
// });
// const wss = new WebSocket.Server({ server });

// wss.on('connection', function connection(ws) {
//   ws.on('message', function incoming(message) {
//     console.log('received: %s', message);
//     ws.send(`Hello, you sent -> ${message}`);
//   });
//   ws.send('Welcome to the secure WebSocket server!');
// });

// server.listen(8080, () => {
//   console.log(`WebSocket server started on port 8080`);
// });


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
    const encryptedText = caesarCipher(text, parseInt(shift));
    res.json({ cipherText: encryptedText });
});

// Endpoint for Caesar Cipher Decryption
app.post('/caesar-decrypt', (req, res) => {
    const { cipherText, shift } = req.body;
    const decryptedText = caesarCipher(cipherText, -parseInt(shift));
    res.json({ plainText: decryptedText });
});

// Placeholder for Playfair Cipher logic
function playfairEncrypt(text, key) {
    // Implement Playfair encryption algorithm
    return text; // Replace with the actual encrypted text
}

function playfairDecrypt(cipherText, key) {
    // Implement Playfair decryption algorithm
    return cipherText; // Replace with the actual decrypted text
}

// Placeholder for Vigenère Cipher logic
function vigenereEncrypt(text, key) {
    // Implement Vigenère encryption algorithm
    return text; // Replace with the actual encrypted text
}

function vigenereDecrypt(cipherText, key) {
    // Implement Vigenère decryption algorithm
    return cipherText; // Replace with the actual decrypted text
}

// Express endpoints for Playfair Cipher
app.post('/playfair-encrypt', (req, res) => {
    const { text, key } = req.body;
    res.json({ cipherText: playfairEncrypt(text, key) });
});

app.post('/playfair-decrypt', (req, res) => {
    const { cipherText, key } = req.body;
    res.json({ plainText: playfairDecrypt(cipherText, key) });
});

// Express endpoints for Vigenère Cipher
app.post('/vigenere-encrypt', (req, res) => {
    const { text, key } = req.body;
    res.json({ cipherText: vigenereEncrypt(text, key) });
});

app.post('/vigenere-decrypt', (req, res) => {
    const { cipherText, key } = req.body;
    res.json({ plainText: vigenereDecrypt(cipherText, key) });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// // server.js
// // const express = require('express');
// // const fs = require('fs');
// const https = require('https');
// const WebSocket = require('ws');
// // const app = express();

// const server = https.createServer({
//   cert: fs.readFileSync('./cert.pem'), // Your SSL certificate
//   key: fs.readFileSync('./key.pem')    // Your SSL key
// }, app);

// const wss = new WebSocket.Server({ server });

// wss.on('connection', function connection(ws) {
//   console.log('A new client connected.');

//   ws.on('message', function incoming(message) {
//     console.log('received: %s', message);

//     // Broadcast incoming message to all clients
//     wss.clients.forEach(function each(client) {
//       if (client !== ws && client.readyState === WebSocket.OPEN) {
//         client.send(message);
//       }
//     });
//   });
// });

// server.listen(8080, () => {
//   console.log('Listening on https://localhost:8080');
// });



const https = require('https');
const WebSocket = require('ws');

const server = https.createServer({
  cert: fs.readFileSync('./cert.pem'),
  key: fs.readFileSync('./key.pem')
});

const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
  console.log('A client connected');

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.send('Hello Client');
});

server.listen(8080, () => {
  console.log('WebSocket server started on wss://localhost:8080');
});
