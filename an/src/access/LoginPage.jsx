import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api';
import AuthHeader from './AuthHeader';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData);
      localStorage.setItem('token', response.data.token);
      onLogin();
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <div className="login-page">
      <AuthHeader />
      <div className="login-container">
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
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

          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
      <div className="footer-text">
        © 2024 Student Task Planner. All rights reserved.
      </div>
    </div>
  );
};

export default LoginPage;
