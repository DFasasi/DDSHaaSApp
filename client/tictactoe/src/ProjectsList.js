import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';

const ProjectsList = () => {
  const [projects, setProjects] = useState([]); // Ensure it's initialized as an empty array
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { userId } = useUser(); // Retrieve userId from context

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.post('http://localhost:5000/user_projects', {
          userId,
        }, {
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.data.status === "success") {
          setProjects(response.data.projects || []); // Ensure `projects` is always an array
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
          {projects && projects.length > 0 ? ( // Add null-check and handle empty array
            projects.map((project, index) => (
              <li key={index} className="project-item">
                <button onClick={() => handleJoinProject(project.projectId)}>
                  {'ID:'+project}
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
