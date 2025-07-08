import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

const Header = ({ profileImage }) => {
  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <span className="logo-text">assignMate</span>
        </div>
      </div>
      <div className="header-right">
        <div className="profile-icon-container">
          <Link to="/profile" className="profile-link">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="profile-icon" />
            ) : (
              <FontAwesomeIcon icon={faUserCircle} className="profile-icon" />
            )}
            <span className="profile-text">My Profile</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
