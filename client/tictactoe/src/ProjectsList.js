import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProjectsList = ({ userId }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.post('http://localhost:5000/user_projects', {
          userId
        }, {
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.data.status === "success") {
          setProjects(response.data.projects);
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching user projects:", error);
        alert("Failed to load projects.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [userId]);

  const handleJoinProject = (projectId) => {
    navigate('/hardwarecheckout', { state: { projectId, userId } });
  };

  return (
    <div className="projects-list">
      <h2>Your Projects</h2>
      {loading ? (
        <p>Loading projects...</p>
      ) : (
        <ul>
          {projects.length > 0 ? (
            projects.map((project) => (
              <li key={project.projectId} className="project-item">
                <span>{project.projectName}</span>
                <button onClick={() => handleJoinProject(project.projectId)}>
                  Log into Project
                </button>
              </li>
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
