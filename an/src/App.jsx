import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import Dashboard from './Dashboard';
import Tasks from './Tasks';
import Courses from './Courses';
import StudyPlanner from './StudyPlanner';
import LoginPage from './access/LoginPage';
import RegisterPage from './access/RegisterPage';
import Feedback from './Feedback';
import Reminder from './Reminder';
import ForgotPassword from './access/ForgotPassword';

import Profile from './Profile';
import './App.css';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [courses, setCourses] = useState([]);
  const [studySessions, setStudySessions] = useState([]);
  const [loginHistory, setLoginHistory] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [settings, setSettings] = useState({
    highContrast: false,
    darkMode: false,
    fontSize: 16,
  });

  useEffect(() => {
    const loggedIn = localStorage.getItem('isAuthenticated');
    if (loggedIn) {
      setIsAuthenticated(true);
      fetchLoginHistory();
    }
    fetchTasks();
    fetchCourses();
    fetchStudySessions();
  }, []);

  useEffect(() => {
    document.body.style.fontSize = `${settings.fontSize}px`;
    document.body.classList.toggle('high-contrast', settings.highContrast);
    document.body.classList.toggle('dark-mode', settings.darkMode);
  }, [settings]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  const fetchStudySessions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/study-sessions');
      setStudySessions(response.data);
    } catch (error) {
      console.error('Failed to fetch study sessions:', error);
    }
  };

  const fetchLoginHistory = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://localhost:5000/api/login-history', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLoginHistory(response.data);
    } catch (error) {
      console.error('Failed to fetch login history:', error);
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    fetchLoginHistory();
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authToken');
    setLoginHistory([]);
    setProfileImage(null);
  };

  const handleCloseAccount = () => {
    handleLogout();
    // Additional actions after closing the account, if needed
  };

  const addTask = (task) => setTasks([...tasks, { id: tasks.length + 1, ...task }]);
  const updateTaskStatus = (id, status) =>
    setTasks(tasks.map((task) => (task.id === id ? { ...task, status } : task)));
  const addCourse = (course) =>
    setCourses([...courses, { id: courses.length + 1, ...course }]);
  const updateCourse = (id, updatedCourse) =>
    setCourses(courses.map((course) => (course.id === id ? updatedCourse : course)));
  const deleteCourse = (id) =>
    setCourses(courses.filter((course) => course.id !== id));
  const addStudySession = (session) =>
    setStudySessions([...studySessions, { id: studySessions.length + 1, ...session }]);

  const PrivateRoute = ({ element: Component, ...rest }) => {
    return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div className="app-container">
        <main className="main-content">
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/"
              element={<PrivateRoute element={() => <Dashboard tasks={tasks} studySessions={studySessions} />} />}
            />
            <Route
              path="/dashboard"
              element={<PrivateRoute element={() => <Dashboard tasks={tasks} studySessions={studySessions} />} />}
            />
            <Route
              path="/tasks"
              element={
                <PrivateRoute
                  element={() => (
                    <Tasks
                      tasks={tasks}
                      courses={courses}
                      addTask={addTask}
                      updateTaskStatus={updateTaskStatus}
                    />
                  )}
                />
              }
            />
            <Route
              path="/courses"
              element={
                <PrivateRoute
                  element={() => (
                    <Courses
                      courses={courses}
                      addCourse={addCourse}
                      updateCourse={updateCourse}
                      deleteCourse={deleteCourse}
                    />
                  )}
                />
              }
            />
            <Route
              path="/study-planner"
              element={
                <PrivateRoute
                  element={() => (
                    <StudyPlanner
                      studySessions={studySessions}
                      addStudySession={addStudySession}
                      courses={courses}
                    />
                  )}
                />
              }
            />
            <Route
              path="/feedback"
              element={<PrivateRoute element={Feedback} />}
            />
            <Route
              path="/reminder"
              element={
                <PrivateRoute
                  element={() => (
                    <Reminder tasks={tasks} studySessions={studySessions} />
                  )}
                />
              }
            />
            
            <Route
              path="/profile"
              element={
                <PrivateRoute
                  element={() => (
                    <Profile
                      profileImage={profileImage}
                      setProfileImage={setProfileImage}
                      onLogout={handleLogout}
                    />
                  )}
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
