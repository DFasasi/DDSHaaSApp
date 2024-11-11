import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './App.css';

const Projects = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = location.state;
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    projectId: '',
  });
  const [showCreateProject, setShowCreateProject] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = showCreateProject ? 'create_project' : 'join_project';
      await axios.post(`http://localhost:5000/${endpoint}`, {
        userId,
        projectId: formData.projectId,
        projectName: formData.name,
        description: formData.description,
      }, {
        headers: { 'Content-Type': 'application/json' },
      });
      alert(showCreateProject ? 'Project created successfully!' : 'Joined project successfully!');
      navigate('/hardwarecheckout', { state: { userId } });
    } catch (error) {
      alert('Project action failed!');
    }
  };

  return (
    <div className="form-container">
      <div className="tabs">
        <button
          className={`tab ${showCreateProject ? 'active' : ''}`}
          onClick={() => setShowCreateProject(true)}
        >
          Create Project
        </button>
        <button
          className={`tab ${!showCreateProject ? 'active' : ''}`}
          onClick={() => setShowCreateProject(false)}
        >
          Join Project
        </button>
      </div>
      
      <h1>{showCreateProject ? 'Create a New Project' : 'Join an Existing Project'}</h1>
      <form onSubmit={handleSubmit}>
        {showCreateProject && (
          <>
            <label>Project Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <label>Description:</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </>
        )}
        <label>Project ID:</label>
        <input
          type="text"
          name="projectId"
          value={formData.projectId}
          onChange={handleChange}
          required
        />
        <button type="submit">
          {showCreateProject ? 'Create Project' : 'Join Project'}
        </button>
      </form>
    </div>
  );
};

export default Projects;
