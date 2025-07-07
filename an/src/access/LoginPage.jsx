import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthHeader from './AuthHeader';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

 

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('api/login', { email, password });
      localStorage.setItem('token', response.data.token);
      alert('Login successful!');
      onLogin(); // Call the onLogin function passed as a prop
      fetchReminders();
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      alert('Invalid email or password. Please try again.');
    }
  };

  const fetchReminders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/reminders/user', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      checkReminders(response.data);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    }
  };

  const requestNotificationPermission = () => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
        }
      });
    }
  };

  const showNotification = (title, body) => {
    if (Notification.permission === 'granted') {
      new Notification(title, { body });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification(title, { body });
        }
      });
    }
  };

  const checkReminders = (reminders) => {
    reminders.forEach(reminder => {
      const dueDate = new Date(reminder.dueDate);
      const now = new Date();
      const timeDifference = dueDate - now;

      if (timeDifference <= 24 * 60 * 60 * 1000 && timeDifference > 0) {
        showNotification('Reminder', `You have a reminder for ${reminder.name} on ${reminder.dueDate}.`);
      }
    });
  };

  return (
    <div className="login-page">
      <AuthHeader />
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
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
          
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
          />
           


          <div className="forgot-password">
            <Link to="/forgot-password">Forgot Password? Click here</Link>
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
        <p>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
      <footer className="footer-text">
        © 2024 Student Task Planner. All rights reserved.
      </footer>
    </div>
  );
};

export default LoginPage;
