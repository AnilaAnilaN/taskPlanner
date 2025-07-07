import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile, deleteProfile } from './api'; // Import API functions
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
    fieldOfStudy: '',
    yearOfStudy: '',
    securityQuestion: '',
    securityAnswer: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getProfile(); // Use getProfile from api.js
      setFormData(response.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setError('Failed to fetch profile. Please log in again.');
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
      await updateProfile(formData); // Use updateProfile from api.js
      alert('Profile updated successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to update profile:', error);
      setError('Failed to update profile. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleCloseAccount = async () => {
    try {
      await deleteProfile(); // Use deleteProfile from api.js
      alert('Account closed successfully!');
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error('Failed to close account:', error);
      setError('Failed to close account. Please try again.');
    }
  };

  return (
    <div className="profile-page">
      <Sidebar />
      <div className="main-content">
        <Header title="Profile" />
        <div className="profile-container">
          <h2>Edit Profile Information</h2>
          {error && <p className="error">{error}</p>}
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
      <div className="form-group">
        <label htmlFor="fieldOfStudy">Field of Study</label>
        <input type="text" name="fieldOfStudy" id="fieldOfStudy" value={formData.fieldOfStudy} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="yearOfStudy">Year of Study</label>
        <input type="text" name="yearOfStudy" id="yearOfStudy" value={formData.yearOfStudy} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="securityQuestion">Security Question</label>
        <input type="text" name="securityQuestion" id="securityQuestion" value={formData.securityQuestion} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="securityAnswer">Security Answer</label>
        <input type="text" name="securityAnswer" id="securityAnswer" value={formData.securityAnswer} onChange={handleChange} required />
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
