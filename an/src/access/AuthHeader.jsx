import React from 'react';
import { Link } from 'react-router-dom';
import './AuthHeader.css';
import logo from '../assets/LogoAab.png';

//Every react function is called a component that returns a markup

const AuthHeader = () => {
  return (
    <header className="auth-header">
      <div className="logo">
        {/* Image container for logo */}
        <img src={logo} alt="Student Task Planner Logo" />
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
