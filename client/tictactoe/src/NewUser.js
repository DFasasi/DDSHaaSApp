import React, { useState } from 'react';
import axios from 'axios';

const NewUserForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });

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
    // Handle form submission (e.g., send data to server)
    alert('User created successfully!');
    
    const addUser = async () => {
      try {
        const response = await axios.post('http://localhost:5000/add_user', {
          username: formData.username,
          userId: formData.userId,
          password: formData.password
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
    
        console.log(response.data);
      } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
      }
    };
    
    // Call the function to make the request
    addUser()
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
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
      <div>
        <label>Confirm Password:</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Create User</button>
    </form>
  );
};

export default NewUserForm;
