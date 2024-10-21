import React from 'react';
import { useState } from 'react';

const NewUserbutton = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (event) => {
        event.preventDefault();

        return username + " " + password
    };
    return (
        <div>
          <h1>Create New UserPage</h1>
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
            <label htmlFor="confirmpass"><b>Confirm password</b></label>
            <input
              type="password"
              placeholder="Confirm password"
              name="psw"
              value={password}
              //ADD LOGIC TO CHECK FOR EQUALITY
              required
            />
            <br />
            <button type="submit">Create your account</button>
          </form>
        </div>
    );
};
export default NewUserbutton;