import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTasks, getStudySessions } from './api';
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
      const response = await getTasks();
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to fetch tasks. Please try again.');
    }
  };

  const fetchStudySessions = async () => {
    try {
      const response = await getStudySessions();
      setStudySessions(response.data);
    } catch (error) {
      console.error('Error fetching study sessions:', error);
      setError('Failed to fetch study sessions. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    const [start, end] = timeString.split(' - ');
    const format = (time) => {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours, 10);
      return `${hour > 12 ? hour - 12 : hour}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
    };
    return `${format(start)} - ${format(end)}`;
  };

  const calculateDuration = (startTime, endTime) => {
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);
    const diffMs = end - start;
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60);
    
    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}m`;
    }
  };

  const upcomingDeadlines = tasks
    .filter(task => task.status !== 'Completed')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 3);

  const upcomingSessions = studySessions
    .filter(session => new Date(session.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="dashboard-content">
          {error && <div className="error-message">{error}</div>}
          
          <div className="dashboard-section">
            <h2>Upcoming Task Deadlines</h2>
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Task</th>
                    <th>Course</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingDeadlines.length > 0 ? (
                    upcomingDeadlines.map(task => (
                      <tr key={task._id}>
                        <td>{formatDate(task.dueDate)}</td>
                        <td>{task.title}</td>
                        <td>{task.course}</td>
                        <td>
                          <span className={`status-badge ${task.status.toLowerCase()}`}>
                            {task.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="no-tasks">
                        No upcoming deadlines
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="view-all-container">
              <Link to="/tasks" className="view-all-link">
                View All Tasks →
              </Link>
            </div>
          </div>

          <div className="dashboard-section">
            <h2>Upcoming Study Sessions</h2>
            <div className="table-responsive">
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
                  {upcomingSessions.length > 0 ? (
                    upcomingSessions.map(session => (
                      <tr key={session._id}>
                        <td>{formatDate(session.date)}</td>
                        <td>{formatTime(`${session.startTime} - ${session.endTime}`)}</td>
                        <td>{calculateDuration(session.startTime, session.endTime)}</td>
                        <td>{session.course}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="no-sessions">
                        No upcoming study sessions
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="view-all-container">
              <Link to="/study-sessions" className="view-all-link">
                View All Sessions →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
