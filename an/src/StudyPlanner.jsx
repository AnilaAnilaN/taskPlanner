import React, { useState, useEffect } from 'react';
import { getStudySessions, createStudySession, updateStudySession, deleteStudySession, getCourses } from './api'; // Import API functions
import Header from './Header';
import Sidebar from './Sidebar';
import './StudyPlanner.css';

const StudyPlanner = () => {
  const [sessions, setSessions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    course: '',
    date: '',
    startTime: '',
    endTime: '',
    notes: '',
    enableNotifications: false,
  });
  const [courses, setCourses] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
        }
      });
    }

    fetchCourses();
    fetchStudySessions();
  }, []);

  useEffect(() => {
    if (currentSession) {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const endTime = new Date(currentSession.date).getTime() + currentSession.duration * 60 * 1000;
        const distance = endTime - now;

        if (distance > 0) {
          setTimeLeft(distance);
        } else {
          clearInterval(interval);
          setCurrentSession(null);
          setTimeLeft(null);
          if (Notification.permission === 'granted') {
            new Notification('Study Planner', { body: 'Study Session Ends Now!' });
          }
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [currentSession]);

  const fetchCourses = async () => {
    try {
      const response = await getCourses(); // Use getCourses from api.js
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to fetch courses. Please try again.');
    }
  };

  const fetchStudySessions = async () => {
    try {
      const response = await getStudySessions(); // Use getStudySessions from api.js
      setSessions(response.data);
    } catch (error) {
      console.error('Error fetching study sessions:', error);
      setError('Failed to fetch study sessions. Please try again.');
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const sessionDate = new Date(formData.date);
    const [startHour, startMinute] = formData.startTime.split(':').map(Number);
    const [endHour, endMinute] = formData.endTime.split(':').map(Number);

    const startTime = new Date(sessionDate.setHours(startHour, startMinute, 0, 0));
    const endTime = new Date(sessionDate.setHours(endHour, endMinute, 0, 0));

    const sessionData = {
      ...formData,
      date: sessionDate,
      startTime: formData.startTime,
      endTime: formData.endTime,
      duration: (endHour - startHour) * 60 + (endMinute - startMinute),
    };

    try {
      if (formData._id) {
        await updateStudySession(formData._id, sessionData); // Use updateStudySession from api.js
      } else {
        await createStudySession(sessionData); // Use createStudySession from api.js
      }
      scheduleNotification('Study Session Starts Now!', startTime);
      scheduleNotification('Study Session Ends Now!', endTime);
      setFormData({
        name: '',
        course: '',
        date: '',
        startTime: '',
        endTime: '',
        notes: '',
        enableNotifications: false,
      });
      setShowForm(false);
      fetchStudySessions();
    } catch (error) {
      console.error('Error saving study session:', error);
      setError('Failed to save study session. Please try again.');
    }
  };

  const scheduleNotification = (message, time) => {
    const now = new Date().getTime();
    const delay = time.getTime() - now;

    if (delay > 0) {
      setTimeout(() => {
        if (Notification.permission === 'granted') {
          new Notification('Study Planner', { body: message });
        }
      }, delay);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteStudySession(id); // Use deleteStudySession from api.js
      fetchStudySessions();
    } catch (error) {
      console.error('Error deleting study session:', error);
      setError('Failed to delete study session. Please try again.');
    }
  };

  const handleEdit = (session) => {
    setFormData({
      _id: session._id,
      name: session.name,
      course: session.course,
      date: new Date(session.date).toISOString().split('T')[0],
      startTime: session.startTime,
      endTime: session.endTime,
      notes: session.notes,
      enableNotifications: session.enableNotifications,
    });
    setShowForm(true);
  };

  const startSession = (session) => {
    const now = new Date().getTime();
    const startTime = new Date(session.date).getTime();
    const [startHour, startMinute] = session.startTime.split(':').map(Number);
    const [endHour, endMinute] = session.endTime.split(':').map(Number);
    const duration = (endHour - startHour) * 60 + (endMinute - startMinute);

    if (now >= startTime && now <= startTime + duration * 60 * 1000) {
      setCurrentSession({ ...session, duration });
    }
  };

  const formatTime = (time) => {
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="study-planner-container">
      <Header />
      <div className="main-content">
        <Sidebar />
        <div className="study-planner-content">
          {error && <p className="error">{error}</p>}
          {!sessions.length && !showForm && (
            <div className="no-sessions">
              <img src="clock.png" alt="Clock" className="clock-image" />
              <p className="no-sessions-text">You haven't added any sessions yet</p>
            </div>
          )}

          {showForm && (
            <form className="study-form" onSubmit={handleFormSubmit}>
              <button type="button" className="close-button" onClick={() => setShowForm(false)}>X</button>
              <div>
                <label>Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleFormChange} />
              </div>
              <div>
                <label>Course</label>
                <select name="course" value={formData.course} onChange={handleFormChange}>
                  <option value="">Select course</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course.name}>{course.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleFormChange} />
              </div>
              <div>
                <label>Start Time</label>
                <input type="time" name="startTime" value={formData.startTime} onChange={handleFormChange} />
              </div>
              <div>
                <label>End Time</label>
                <input type="time" name="endTime" value={formData.endTime} onChange={handleFormChange} />
              </div>
              <div>
                <label>Notes</label>
                <textarea name="notes" value={formData.notes} onChange={handleFormChange}></textarea>
              </div>
              <div className="notifications">
                <input
                  type="checkbox"
                  name="enableNotifications"
                  checked={formData.enableNotifications}
                  onChange={handleFormChange}
                />
                <label>Enable Notifications</label>
              </div>
              <button type="submit" className="save-button">Save</button>
            </form>
          )}

          {sessions.length > 0 && !showForm && (
            <div className="saved-sessions">
              <h2>Saved Sessions</h2>
              <div className="sessions-list">
                {sessions.map((session) => (
                  <div key={session._id} className="session-card">
                    <h3>Session {session._id}</h3>
                    <p>Name: {session.name}</p>
                    <p>Course: {session.course}</p>
                    <p>Date: {new Date(session.date).toLocaleDateString()}</p>
                    <p>Start Time: {session.startTime}</p>
                    <p>End Time: {session.endTime}</p>
                    <p>Notes: {session.notes}</p>
                    <button onClick={() => handleEdit(session)} className="edit-button">Edit</button>
                    <button onClick={() => handleDelete(session._id)} className="delete-button">Delete</button>
                    <button onClick={() => startSession(session)} className="start-button">Start</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentSession && (
            <div className="countdown-timer">
              <h2>Time Left: {formatTime(timeLeft)}</h2>
            </div>
          )}

          {!showForm && (
            <button className="add-session-button" onClick={() => setShowForm(true)}>+</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyPlanner;
