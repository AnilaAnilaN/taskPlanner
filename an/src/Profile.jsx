import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile, logoutUser, deleteProfile } from './api'; // Import API functions
import Header from './Header';
import Sidebar from './Sidebar';
import './Profile.css';

const Profile = ({ onLogout }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    college: '',
    fieldOfStudy: '',
    yearOfStudy: '',
  });
  const [localProfileImage, setLocalProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await getProfile(); // Use getProfile from api.js
      setFormData(response.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      if (err.response?.status === 401) {
        setError('Session expired. Please log in again.');
        navigate('/login');
      } else {
        setError('Failed to fetch profile. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setLocalProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
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

  const handleLogout = async () => {
    try {
      await logoutUser(); // Use logoutUser from api.js
      onLogout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
      setError('Failed to log out. Please try again.');
    }
  };

  const handleCloseAccount = async () => {
    try {
      await deleteProfile(); // Use deleteProfile from api.js
      alert('Account closed successfully!');
      onLogout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to close account:', error);
      setError('Failed to close account. Please try again.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="profile-page">
      <Header profileImage={localProfileImage} />
      <Sidebar />
      <div className="profile-content">
        <div className="profile-container">
          <h1>Edit Profile Information</h1>
          <p>Update your personal information below.</p>

          <div className="profile-form">
            <div className="profile-picture-section">
              <div className="profile-picture">
                <div className="circle">
                  {localProfileImage ? (
                    <img src={localProfileImage} alt="Profile" className="profile-image" />
                  ) : (
                    <span>No Image</span>
                  )}
                </div>
                <label htmlFor="imageUpload" className="upload-btn">
                  Upload Picture
                </label>
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </div>
            </div>

            <div className="personal-info">
              <h2>Personal Information</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="college">College</label>
                  <input
                    type="text"
                    name="college"
                    id="college"
                    value={formData.college}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="fieldOfStudy">Field of Study</label>
                  <input
                    type="text"
                    name="fieldOfStudy"
                    id="fieldOfStudy"
                    value={formData.fieldOfStudy}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="yearOfStudy">Year of Study</label>
                  <input
                    type="text"
                    name="yearOfStudy"
                    id="yearOfStudy"
                    value={formData.yearOfStudy}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit" className="save-btn">
                  Save Changes
                </button>
              </form>
            </div>

            <div className="advanced-settings">
              <h2>Advanced Settings</h2>
              <div className="settings-buttons">
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
                <button className="close-account-btn" onClick={handleCloseAccount}>
                  Close Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
