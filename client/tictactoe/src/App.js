import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from './Login';
import NewUserForm from './NewUser';
import Projects from './Projects';
import ProjectsList from './ProjectsList';
import HardwareCheckout from './HardwareCheckout';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLogin = (id) => {
    setLoggedIn(true);
    setUserId(id);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUserId(null);
  };

  return (
    <Router>
      <div className="app-container">
        <nav className="nav-links">
          {loggedIn ? (
            <>
              <Link to="/projects_list">My Projects</Link>  {/* New link for projects list */}
              <span onClick={handleLogout} className="logout-link">Log Out</span>
            </>
          ) : (
            <>
              <Link to="/">Login</Link>
              <Link to="/newuser">Create New User</Link>
            </>
          )}
        </nav>
        
        <button onClick={toggleDarkMode} className="dark-mode-toggle">
          {darkMode ? '🌙' : '☀️'}
        </button>

        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route path="/newuser" element={<NewUserForm />} />
          <Route path="/projects" element={<Projects userId={userId} />} />
          <Route path="/projects_list" element={<ProjectsList userId={userId} />} />  {/* New route for projects list */}
          <Route path="/hardwarecheckout" element={<HardwareCheckout />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
