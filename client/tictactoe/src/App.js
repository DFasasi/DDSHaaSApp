import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from './Login';
import NewUserForm from './NewUser';
import Projects from './Projects';
import HardwareCheckout from './HardwareCheckout';  // Import the new component
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

  const handleLogout = () => {
    setLoggedIn(false);
  };

  return (
    <Router>
      <div className="app-container">
        <nav className="nav-links">
          {loggedIn ? (
            //<span onClick={handleLogout} className="logout-link">Log Out</span>
            <Link to="/" onClick={handleLogout} className="logout-link">
              Log Out
            </Link>
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
          <Route path="/" element={<Login onLogin={() => setLoggedIn(true)} />} />
          <Route path="/newuser" element={<NewUserForm />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/hardwarecheckout" element={<HardwareCheckout />} />  {/* New route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
