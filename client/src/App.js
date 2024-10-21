import React from 'react';
import { useState } from 'react';

const net = require('net');

const client = new net.Socket();
const port = 8080; // Replace with the port your server is listening on
const host = '127.0.0.1'; // Replace with the server's IP address
let up = LoginForm()

console.log("Client starting up...");
client.connect(port, host, () => {
    console.log('Connected to server');
    const arr = up.split(" ")
    user = arr[0]
    pass = arr[1]
    client.write(user + pass);
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


const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
  
    // Handles the form submission
    const handleSubmit = (event) => {
      event.preventDefault(); // Prevents page refresh
  
      // Log the input values (for now)
      return username + " " + password

    };
      return (
        <div>
          <h1>Log-in Page</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="uname"><b>Username</b></label>
            <input
              type="text"
              placeholder="Enter Username"
              name="uname"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <br />
            <label htmlFor="psw"><b>Password</b></label>
            <input
              type="password"
              placeholder="Enter Password"
              name="psw"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <br />
            <button type="submit">Login</button>
          </form>
        </div>
      );
    };
    
    export default LoginForm;