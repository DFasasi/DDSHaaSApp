// ProjectsList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';

const ProjectsList = () => {
  const [projects, setProjects] = useState([]); // Initialized as an empty array
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { userId } = useUser(); // Retrieve userId from context

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.post(
          'https://nbhaas-bf3456b48e75.herokuapp.com/user_projects',
          { userId },
          { headers: { 'Content-Type': 'application/json' } }
        );

        if (response.data.status === 'success') {
          setProjects(response.data.projects || []);
          console.log('Fetched Projects:', response.data.projects); // Debugging line
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.error('Error fetching user projects:', error);
        alert('Failed to load projects.');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch projects if userId is available
    if (userId) {
      fetchProjects();
    } else {
      setLoading(false);
      alert('User ID is missing. Please log in again.');
    }
  }, [userId]);

  const handleJoinProject = (projectId) => {
    console.log('Joining Project:', projectId, 'User ID:', userId); // Debugging line
    navigate('/hardwarecheckout', { state: { projectId, userId } });
  };

  return (
    <div className="projects-list">
      <h2>Your Projects</h2>
      {loading ? (
        <p>Loading projects...</p>
      ) : (
        <ul>
          {projects && projects.length > 0 ? (
            projects.map((project) => (
              <li key={project.projectId} className="project-item">
                <span>{project.projectName}</span>
                <button onClick={() => handleJoinProject(project)}>
                  {'Join Project: ' + project} 
                </button>
              </li>//project.projectName is undefinded
            ))
          ) : (
            <p>You are not part of any projects.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default ProjectsList;
