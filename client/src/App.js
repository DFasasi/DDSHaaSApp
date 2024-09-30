const net = require('net');

const client = new net.Socket();
const port = 8080; // Replace with the port your server is listening on
const host = '127.0.0.1'; // Replace with the server's IP address
console.log("Client starting up...");
client.connect(port, host, () => {
    console.log('Connected to server');
    client.write('Hello, server! This is the client.');
});

client.on('data', (data) => {
    console.log('Received: ' + data);
    client.destroy(); // Close the connection after receiving data
});

client.on('close', () => {
    console.log('Connection closed');
});

client.on('error', (err) => {
    console.error('Error: ' + err.message);
});
