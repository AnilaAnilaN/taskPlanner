import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDashboard, faBook, faTasks, faCalendarAlt, faBell, faComment, faBars } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={faBars} />
      </button>

      <ul className="sidebar-nav">
        <li className="sidebar-nav-item">
          <Link to="/dashboard">
            <FontAwesomeIcon icon={faDashboard} />
            <span>Dashboard</span>
          </Link>
        </li>
        <li className="sidebar-nav-item">
          <Link to="/courses">
            <FontAwesomeIcon icon={faBook} />
            <span>Courses</span>
          </Link>
        </li>
        <li className="sidebar-nav-item">
          <Link to="/tasks">
            <FontAwesomeIcon icon={faTasks} />
            <span>Tasks</span>
          </Link>
        </li>
        <li className="sidebar-nav-item">
          <Link to="/study-planner">
            <FontAwesomeIcon icon={faCalendarAlt} />
            <span>Study Planner</span>
          </Link>
        </li>
        <li className="sidebar-nav-item">
          <Link to="/reminder">
            <FontAwesomeIcon icon={faBell} />
            <span>Reminder</span>
          </Link>
        </li>
      </ul>

      <div className="sidebar-feedback">
        <Link to="/feedback">
          <FontAwesomeIcon icon={faComment} />
          <span>Feedback</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
