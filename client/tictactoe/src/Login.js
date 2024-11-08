// src/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Ensure this is 'react-router-dom'
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', {
        username: formData.username,
        userId: "1",
        password: formData.password
      },{
        headers: { 'Content-Type': 'application/json' },
      });

      console.log('Login successful:', response.data.message);
      alert(response.data.message);

      // Navigate to the Projects page after successful login
      navigate('/projects');

    } catch (error) {
      console.error('Error logging in:', error.response ? error.response.data : error.message);
      alert('User login failed!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <h1>Login</h1>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
