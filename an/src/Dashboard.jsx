import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';
import Sidebar from './Sidebar';
import Header from './Header';

const Dashboard = ({ studySessions }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Format the date as a string in the correct format
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
    .filter(task => task.status !== 'Completed') // Filtering tasks that are not marked as 'Completed'.
    .slice(0, 3); // Selecting the first 3 tasks from the filtered list.

  const upcomingSessions = studySessions.slice(0, 3); // Creating a constant upcomingSessions that holds the first 3 study sessions.

  return (
    <div className="dashboard-container">
      {/* A div that wraps the entire dashboard, with the class dashboard-container for styling */}

      <Sidebar />
      {/* Rendering the Sidebar component on the dashboard */}

      <div className="dashboard-main-content">
        {/* A div for the main content area of the dashboard */}

        <Header />
        {/* Rendering the Header component at the top of the dashboard */}

        <div className="dashboard-content">
          {/* A div for the specific content of the dashboard */}

          <div className="dashboard-section">
            {/* A div for a section of the dashboard (e.g., task deadlines) */}

            <h2>Upcoming Task Deadlines</h2>
            {/* Heading for the task deadlines section */}

            <table>
              {/* Starting a table for displaying upcoming task deadlines */}

              <thead>
                {/* Table header section */}

                <tr>
                  {/* A row in the table header */}

                  <th>Date</th>
                  {/* Table header for the task due date */}

                  <th>Task Category</th>
                  {/* Table header for the task category */}

                  <th>Status</th>
                  {/* Table header for the task status */}

                  <th>Course</th>
                  {/* Table header for the task's associated course */}
                </tr>
              </thead>

              <tbody>
                {/* Table body section where rows of data will be displayed */}

                {upcomingDeadlines.map(task => (
                  <tr key={task._id}>
                    {/* Creating a new table row for each task, using task._id as a unique key */}

                    <td>{formatDate(task.dueDate)}</td>
                    {/* Displaying the due date of the task in the correct format */}

                    <td>{task.category}</td>
                    {/* Displaying the category of the task */}

                    <td>{task.status}</td>
                    {/* Displaying the status of the task */}

                    <td>{task.course}</td>
                    {/* Displaying the course associated with the task */}

                  </tr>
                ))}
              </tbody>
            </table>
            {/* End of the table */}

            <Link to="/tasks" className="view-tasks-link">
              {/* Link to navigate to the full list of tasks */}

              View All Tasks
              {/* Text inside the link to view all tasks */}
              </Link>
         <Link to ="/reminder" className="view-tasks-link">View all reminders</Link>
          </div>

          <div className="dashboard-section">
            {/* Another section of the dashboard (e.g., study sessions) */}

            <h2>Upcoming Study Sessions</h2>
            {/* Heading for the study sessions section */}

            <table>
              {/* Start a table for displaying upcoming study sessions */}

              <thead>
                {/* Table header section */}

                <tr>
                  {/* A row in the table header */}

                  <th>Date</th>
                  {/* Table header for the session date */}

                  <th>Time</th>
                  {/* Table header for the session time */}

                  <th>Duration</th>
                  {/* Table header for the session duration */}

                  <th>Course</th>
                  {/* Table header for the course associated with the study session */}

                </tr>
              </thead>

              <tbody>
                {/* Table body section where rows of data will be displayed */}

                {upcomingSessions.map(session => (
                  <tr key={session._id}>
                    {/* Creating a new table row for each session, using session._id as a unique key */}

                    <td>{formatDate(session.date)}</td>
                    {/* Displaying the date of the study session in the correct format */}

                    <td>{formatTime(`${session.startTime} - ${session.endTime}`)}</td>
                    {/* Displaying the time of the study session */}

                    <td>{calculateDuration(session.startTime, session.endTime)}</td>
                    {/* Displaying the duration of the study session */}

                    <td>{session.course}</td>
                    {/* Displaying the course associated with the study session */}

                  </tr>
                ))}
              </tbody>
            </table>
           
            {/* End of the table */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
