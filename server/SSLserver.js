const WebSocket = require('ws');
const readline = require('readline');

const wss = new WebSocket.Server({ port: 8080 });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

wss.on('connection', (ws) => {
  console.log('A new client connected.');

  ws.on('message', (message) => {
    const msgObject = JSON.parse(message.toString());
    console.log('Client sent:', msgObject.content);

    // Echo the received message back to the client
    ws.send(JSON.stringify({ from: 'server', content: `Client Message: ${msgObject.content}` }));
  });
});

// Listen for terminal input to send messages to all connected clients
rl.on('line', (input) => {
  console.log(`Sending message from server terminal: ${input}`);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ from: 'server', content: `Server Message: ${input}` }));
    }
  });
});

console.log('WebSocket server is running on ws://localhost:8080');
console.log('Type a message in the terminal to send to connected client:');
