import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api';
import AuthHeader from './AuthHeader';
import './RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    college: '',
    fieldOfStudy: '',
    yearOfStudy: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await registerUser(formData);
      setLoading(false);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);
      setLoading(false);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="page-container">
      <AuthHeader />
      <div className="form-container">
        <h2>Register</h2>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        {loading && (
          <div className="loading-dots">
            <span>.</span><span>.</span><span>.</span>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter Your Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-input"
            disabled={loading}
          />

          <label htmlFor="email" className="form-label">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter Your Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input"
            disabled={loading}
          />

          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter Your Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="form-input"
            disabled={loading}
          />

          <label htmlFor="college" className="form-label">College/University</label>
          <input
            type="text"
            id="college"
            name="college"
            placeholder="Enter Your College/University"
            value={formData.college}
            onChange={handleChange}
            required
            className="form-input"
            disabled={loading}
          />

          <label htmlFor="fieldOfStudy" className="form-label">Field of Study</label>
          <input
            type="text"
            id="fieldOfStudy"
            name="fieldOfStudy"
            placeholder="Enter Your Field of Study"
            value={formData.fieldOfStudy}
            onChange={handleChange}
            required
            className="form-input"
            disabled={loading}
          />

          <label htmlFor="yearOfStudy" className="form-label">Year of Study</label>
          <input
            type="text"
            id="yearOfStudy"
            name="yearOfStudy"
            placeholder="Enter Your Year of Study"
            value={formData.yearOfStudy}
            onChange={handleChange}
            required
            className="form-input"
            disabled={loading}
          />

          <button type="submit" className="register-button" disabled={loading}>
            {loading ? 'Registering...' : 'Submit'}
          </button>
        </form>
      </div>
      <div className="footer-text">
        © 2024 Student Task Planner. All rights reserved.
      </div>
    </div>
  );
};

export default RegisterPage;
