import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
    // Handle form submission (e.g., send data to server)
    
    const addUser = async () => {
      try {
        const response = await axios.post('http://localhost:5000/add_user', {
          userId: formData.username,
          // userId: "1",
          password: formData.password
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
    
        console.log(response.data);
        alert('User created successfully!');
        navigate('/projects', { state: { userId: formData.username } });
        
      } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        alert(`User login failed! Reason: ${error.response ? error.response.data.message : 'Unknown error'}`);

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
