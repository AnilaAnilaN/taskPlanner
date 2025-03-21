import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import Sidebar from './Sidebar';
import './Settings.css';

const Settings = ({ onSettingChange, onLogout, onCloseAccount }) => {
  const [highContrast, setHighContrast] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    onSettingChange({ highContrast, darkMode, fontSize });
  }, [highContrast, darkMode, fontSize, onSettingChange]);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/logout', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      onLogout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleCloseAccount = async () => {
    try {
      await axios.delete('http://localhost:5000/api/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      onCloseAccount();
    } catch (error) {
      console.error('Error closing account:', error);
    }
  };

  return (
    <div className="settings-page">
      <Header />
      <div className="settings-container">
        <Sidebar />
        <div className="settings-content">
          <h2>Accessibility Settings</h2>
          <div className="setting-item">
            <label>High Contrast Mode</label>
            <input
              type="checkbox"
              checked={highContrast}
              onChange={(e) => setHighContrast(e.target.checked)}
            />
          </div>
          <div className="setting-item">
            <label>Dark Mode</label>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
            />
          </div>
          <div className="setting-item">
            <label>Font Size</label>
            <input
              type="range"
              min="12"
              max="24"
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
            />
            <span>{fontSize}px</span>
          </div>
          <h2>Advanced Settings</h2>
          <div className="advanced-settings">
            <button className="logout-button" onClick={handleLogout}>Log Out</button>
            <button className="close-account-button" onClick={handleCloseAccount}>Close Account</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
