import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { getTasks } from './api';
import Sidebar from './Sidebar';
import Header from './Header';
import Dashboard from './Dashboard';
import Tasks from './Tasks';
import Courses from './Courses';
import StudyPlanner from './StudyPlanner';
import LoginPage from './access/LoginPage';
import RegisterPage from './access/RegisterPage';
import Feedback from './Feedback';
import Reminder from './Reminder';
import Profile from './Profile';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isAuthenticated');
    if (loggedIn) {
      setIsAuthenticated(true);
      fetchTasks();
    }
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    fetchTasks();
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('token');
    setTasks([]);
  };

  const handleCloseAccount = () => {
    handleLogout();
  };

  const PrivateRoute = ({ element: Component, ...rest }) => {
    return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div className="app-container">
        {isAuthenticated && <Sidebar />}
        {isAuthenticated && <Header />}
        <main className="main-content">
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/" element={<PrivateRoute element={Dashboard} />} />
            <Route path="/dashboard" element={<PrivateRoute element={Dashboard} />} />
            <Route path="/tasks" element={<PrivateRoute element={Tasks} />} />
            <Route path="/courses" element={<PrivateRoute element={Courses} />} />
            <Route path="/study-planner" element={<PrivateRoute element={StudyPlanner} />} />
            <Route path="/feedback" element={<PrivateRoute element={Feedback} />} />
            <Route
              path="/reminder"
              element={<PrivateRoute element={() => <Reminder tasks={tasks} />} />}
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute
                  element={() => <Profile onLogout={handleLogout} onCloseAccount={handleCloseAccount} />}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
