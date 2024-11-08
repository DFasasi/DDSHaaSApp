import React, { useState } from 'react';
import axios from 'axios';

const Projects =(props) =>{
        const [formData, setFormData] = useState({
          name: '',
          description: '',
          projectId: '',
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
            // Handle form submission (e.g., send data to server)
            
            const addProj = async () => {
                if(showHide){
                    try {
                        const response = await axios.post('http://localhost:5000/create_project', {
                        projectName: formData.name,
                        projectId: formData.projectId, //work on API Later
                        description: formData.description
                        }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                        });
                        console.log(response.data);
                        alert('Project created successfully!');  
                    } 
                    catch (error) {
                        console.error('Error:', error.response ? error.response.data : error.message);
                        alert(`Project creation failed! Reason: ${error.response ? error.response.data.message : 'Unknown error'}`);
                    }
                }
              else{
                try {
                    const response = await axios.post('http://localhost:5000/join_project', {
                      userId: props.userId, //Work On API LATER
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
            
            // Call the function to make the request
            addProj()
        };

//     return(
// <form onSubmit={handleSubmit}>
//       <div>
//         <label>Name:</label>
//         <input
//           type="text"
//           name="Name"
//           value={formData.Name}
//           onChange={handleChange}
//           required
//         />
//       </div>
//       <div>
//         <label>Description:</label>
//         <input
//           type="text"
//           name="Description"
//           value={formData.Description}
//           onChange={handleChange}
//           required
//         />
//       </div>
//       <div>
//         <label>projectId:</label>
//         <input
//           type="text"
//           name="projectId"
//           value={formData.projectId}
//           onChange={handleChange}
//           required
//         />
//       </div>
//       </form>
//     )
// };

// export default Projects;

// import React, { useState } from 'react';
    const [ showHide, setShowHide] = useState(true);
    const toggleHandler = () => {
        setShowHide(!showHide);
        }
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
                        name="Name"
                        value={formData.Name}
                        onChange={handleChange}
                        required
                        />
                    </div>
                    <div>
                        <label>Description:</label>
                        <input
                        type="text"
                        name="Description"
                        value={formData.Description}
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
                        <h1>Join Pre-Exisiting Project</h1>
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