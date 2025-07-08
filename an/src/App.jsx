import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { getTasks } from './api';
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
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null for loading state
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isAuthenticated');
    const initialAuth = !!loggedIn; // Convert to boolean
    setIsAuthenticated(initialAuth); // Set immediately after check
    if (initialAuth) {
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
    return isAuthenticated === true ? (
      <Component {...rest} />
    ) : (
      <Navigate to="/login" replace />
    );
  };

  // Loading state to prevent premature rendering
  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Simple loading indicator
  }

  return (
    <Router>
      <div className={`app-container ${isAuthenticated ? 'authenticated' : ''}`}>
        <Routes>
          {!isAuthenticated && (
            <>
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          )}
          {isAuthenticated && (
            <Route
              path="/main"
              element={
                <main className="main-content">
                  <Routes>
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
                          element={() => (
                            <Profile onLogout={handleLogout} onCloseAccount={handleCloseAccount} />
                          )}
                        />
                      }
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
              }
            />
          )}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
