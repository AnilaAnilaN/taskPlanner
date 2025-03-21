import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Sidebar from './Sidebar';
import './ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    college: '',
    phoneNumber: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFormData(response.data);
    } catch (error) {
      alert('Failed to fetch profile. Please log in again.');
      navigate('/login');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Profile updated successfully!');
      navigate('/dashboard');
    } catch (error) {
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleCloseAccount = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:5000/api/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Account closed successfully!');
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      alert('Failed to close account. Please try again.');
    }
  };

  return (
    <div className="profile-page">
      <Sidebar />
      <div className="main-content">
        <Header title="Profile" />
        <div className="profile-container">
          <h2>Edit Profile Information</h2>
          <ProfilePictureUpload />
          <ProfileForm formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} />
          <AdvancedSettings handleLogout={handleLogout} handleCloseAccount={handleCloseAccount} />
        </div>
      </div>
    </div>
  );
};

const ProfilePictureUpload = () => {
  return (
    <div className="profile-picture-container">
      <img src="placeholder.jpg" alt="Profile" style={{ borderRadius: '50%', width: '96px', height: '96px', background: '#e0e0e0' }} />
      <button className="upload-button">Upload Picture</button>
    </div>
  );
};

const ProfileForm = ({ formData, handleChange, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Full Name</label>
        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="phoneNumber">Phone Number</label>
        <input type="text" name="phoneNumber" id="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="college">School/University</label>
        <input type="text" name="college" id="college" value={formData.college} onChange={handleChange} required />
      </div>
      <button type="submit" className="save-changes-btn">Save Changes</button>
    </form>
  );
};

const AdvancedSettings = ({ handleLogout, handleCloseAccount }) => {
  return (
    <div className="advanced-settings">
      <h3>Advanced Settings</h3>
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
      <button className="close-account-btn" onClick={handleCloseAccount}>Close Account</button>
    </div>
  );
};

export default ProfilePage;
