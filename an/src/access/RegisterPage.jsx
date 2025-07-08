import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api';
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      alert('Registration successful! Please log in using your credentials.');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="register-page">
      <AuthHeader />
      <div className="register-container">
        <h2>Register</h2>
        {error && <p className="error">{error}</p>}
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
          />

          <button type="submit" className="register-button">Submit</button>
        </form>
      </div>
      <div className="footer-text">
        © 2024 Student Task Planner. All rights reserved.
      </div>
    </div>
  );
};

export default RegisterPage;
