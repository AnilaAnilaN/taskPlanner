import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTasks, getStudySessions } from './api'; // Import API functions
import Sidebar from './Sidebar';
import Header from './Header';
import './Dashboard.css';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [studySessions, setStudySessions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks();
    fetchStudySessions();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await getTasks(); // Use getTasks from api.js
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to fetch tasks. Please try again.');
    }
  };

  const fetchStudySessions = async () => {
    try {
      const response = await getStudySessions(); // Use getStudySessions from api.js
      setStudySessions(response.data);
    } catch (error) {
      console.error('Error fetching study sessions:', error);
      setError('Failed to fetch study sessions. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (timeString) => {
    const [startTime, endTime] = timeString.split(' - ');
    return `${startTime} - ${endTime}`;
  };

  const calculateDuration = (startTime, endTime) => {
    const start = new Date(`1970-01-01T${startTime}Z`);
    const end = new Date(`1970-01-01T${endTime}Z`);
    const duration = end - start;
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const upcomingDeadlines = tasks
    .filter(task => task.status !== 'Completed')
    .slice(0, 3);

  const upcomingSessions = studySessions.slice(0, 3);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main-content">
        <Header />
        <div className="dashboard-content">
          {error && <p className="error">{error}</p>}
          <div className="dashboard-section">
            <h2>Upcoming Task Deadlines</h2>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Task Category</th>
                  <th>Status</th>
                  <th>Course</th>
                </tr>
              </thead>
              <tbody>
                {upcomingDeadlines.map(task => (
                  <tr key={task._id}>
                    <td>{formatDate(task.dueDate)}</td>
                    <td>{task.category}</td>
                    <td>{task.status}</td>
                    <td>{task.course}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Link to="/tasks" className="view-tasks-link">
              View All Tasks
            </Link>
          </div>
          <div className="dashboard-section">
            <h2>Upcoming Study Sessions</h2>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Duration</th>
                  <th>Course</th>
                </tr>
              </thead>
              <tbody>
                {upcomingSessions.map(session => (
                  <tr key={session._id}>
                    <td>{formatDate(session.date)}</td>
                    <td>{formatTime(`${session.startTime} - ${session.endTime}`)}</td>
                    <td>{calculateDuration(session.startTime, session.endTime)}</td>
                    <td>{session.course}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
