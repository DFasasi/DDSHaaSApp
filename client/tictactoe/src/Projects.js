import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const Projects = (props) => {
    const location = useLocation();
    const { userId } = location.state; 
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        projectId: '',
    });
    const [showHide, setShowHide] = useState(true);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const addProj = async () => {
            if (showHide) {
                try {
                    const response = await axios.post('http://localhost:5000/create_project', {
                        userId: userId,
                        projectName: formData.name,
                        projectId: formData.projectId,
                        description: formData.description
                    }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    console.log(response.data);
                    alert('Project created successfully!');
                } catch (error) {
                    console.error('Error:', error.response ? error.response.data : error.message);
                    alert(`Project creation failed! Reason: ${error.response ? error.response.data.message : 'Unknown error'}`);
                }
            } else {
                try {
                    const response = await axios.post('http://localhost:5000/join_project', {
                        userId: props.userId,
                        projectId: formData.projectId
                    }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    console.log(response.data);
                    alert('User joined project successfully!');
                } catch (error) {
                    console.error('Error:', error.response ? error.response.data : error.message);
                    alert(`User couldn't join project! Reason: ${error.response ? error.response.data.message : 'Unknown error'}`);
                }
            }
        };
        addProj();
    };

    const toggleHandler = () => {
        setShowHide(!showHide);
    };

    return (
        <div>
            {showHide && 
                <form onSubmit={handleSubmit}>
                    <div>
                        <h1>Create a new Project</h1>
                    </div>
                    <div>
                        <label>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Description:</label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>projectId:</label>
                        <input
                            type="text"
                            name="projectId"
                            value={formData.projectId}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <button type="submit">Submit</button>
                    </div>
                </form>                 
            }
            {!showHide &&
                <form onSubmit={handleSubmit}>
                    <div>
                        <h1>Join Pre-Existing Project</h1>
                    </div>
                    <div>
                        <label>projectId:</label>
                        <input
                            type="text"
                            name="projectId"
                            value={formData.projectId}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <button type="submit">Submit</button>
                    </div>
                </form>
            }
            <button onClick={toggleHandler}>New Project/Join Existing Project</button>
        </div>
    );
};

export default Projects;
