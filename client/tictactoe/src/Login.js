import React from 'react';
import { useState } from 'react';

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