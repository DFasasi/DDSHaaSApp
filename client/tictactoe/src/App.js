import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginForm from './Login';
import NewUser from './NewUser';

function App() {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<LoginForm/>}/>
          <Route path="/newuser" element={<NewUser/>}/>
      </Routes>
      <Link to= {"/newuser"}> Create New User</Link>
      <br/>
      <Link to= {"/"}> Home</Link>

    </Router>



  );
}

export default App;
