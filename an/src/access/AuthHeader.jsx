import React from 'react';
import { Link } from 'react-router-dom';
import './AuthHeader.css';

const AuthHeader = () => {
  return (
    <header className="auth-header">
      <div className="logo">
        <span className="logo-text">
          <span className="logo-text-assign">assign</span>
          <span className="logo-text-mate">Mate</span>
        </span>
      </div>
      <div className="auth-buttons">
        <Link to="/login">
          <button className="auth-btn login-btn">Login</button>
        </Link>
        <Link to="/register">
          <button className="auth-btn signup-btn">Sign Up</button>
        </Link>
      </div>
    </header>
  );
};

export default AuthHeader;
