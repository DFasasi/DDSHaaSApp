// src/NewUser.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './App.css';

const NewUserForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const addUser = async () => {
      try {
        const response = await axios.post('http://localhost:5000/add_user', {
          userId: formData.username,
          password: formData.password
        }, {
          headers: { 'Content-Type': 'application/json' }
        });
        alert('User created successfully!');
        navigate('/projects', { state: { userId: formData.username } });
        
      } catch (error) {
        alert('User creation failed!');
      }
    };
    addUser();
  };

  return (
    <div className="form-container">
      <h1>Create New User</h1>
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <label>Confirm Password:</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <button type="submit">Create User</button>
      </form>
    </div>
  );
};

export default NewUserForm;
