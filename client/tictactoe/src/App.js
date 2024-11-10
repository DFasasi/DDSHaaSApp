// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import Login from './Login';
import NewUserForm from './NewUser';
import Projects from './Projects';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Use useNavigate hook here inside the component
  const navigate = useNavigate();

  const handleLogout = () => {
    setLoggedIn(false);
    navigate('/'); // Redirect to the login page
  };

  return (
    <div className="app-container">
      <nav className="nav-links">
        {loggedIn ? (
          <span onClick={handleLogout} className="logout-link">Log Out</span>
        ) : (
          <>
            <Link to="/">Login</Link>
            <Link to="/newuser">Create New User</Link>
          </>
        )}
      </nav>
      
      {/* Dark mode toggle button in the bottom left corner */}
      <button onClick={toggleDarkMode} className="dark-mode-toggle">
        {darkMode ? '🌙' : '☀️'}
      </button>

      <Routes>
        <Route 
          path="/" 
          element={<Login onLogin={() => setLoggedIn(true)} />} 
        />
        <Route path="/newuser" element={<NewUserForm />} />
        <Route path="/projects" element={<Projects />} />
      </Routes>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
