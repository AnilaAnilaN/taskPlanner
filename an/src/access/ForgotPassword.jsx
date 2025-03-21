import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthHeader from './AuthHeader';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/forgot-password', { email });
      alert('Password reset link sent to your email');
      navigate('/login');
    } catch (error) {
      alert('Failed to send reset link');
    }
  };

  return (
    <div className="forgot-password-page">
      <AuthHeader />
      <div className="forgot-password-container">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
          />
          <button type="submit" className="forgot-password-button">Send Reset Link</button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
