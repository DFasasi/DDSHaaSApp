import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginForm from './Login';
import NewUser from './NewUser';
import Projects from './Projects';

function App() {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<LoginForm/>}/>
          <Route path="/newuser" element={<NewUser/>}/>
          <Route path="/projects" element={<Projects />} />
      </Routes>
      <Link to= {"/newuser"}> Create New User</Link>
      <br/>
      <Link to= {"/"}> Login</Link>
      <br/>
      <Link to= {"/Projects"}> Projects</Link>
    </Router>



  );
}

export default App;
