import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import Sidebar from './Sidebar';
import './Reminder.css';

const Reminder = ({ tasks }) => {
  const [reminders, setReminders] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingReminderId, setEditingReminderId] = useState(null);
  const [newReminder, setNewReminder] = useState({
    name: '',
    time: '',
    category: '',
    selectedTask: '',
    date: '',
    relativeTime: '', // Add the relativeTime field
  });

  useEffect(() => {
    fetchReminders();
    requestNotificationPermission();
  }, []);

  const fetchReminders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/reminders/user', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setReminders(response.data);
      checkReminders(response.data);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    }
  };

  const requestNotificationPermission = () => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
        }
      });
    }
  };

  const showNotification = (title, body) => {
    if (Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  };

  const checkReminders = reminders => {
    reminders.forEach(reminder => {
      const selectedTask = tasks.find(task => task._id === reminder.selectedTask);

      if (selectedTask) {
        const dueDate = new Date(selectedTask.dueDate);
        const now = new Date();
        const timeDifference = dueDate - now;

        if (timeDifference <= 24 * 60 * 60 * 1000 && timeDifference > 0) {
          showNotification('Reminder', `You have a reminder for ${reminder.name} on ${dueDate.toLocaleDateString()}.`);
        }
      }
    });
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setNewReminder({ ...newReminder, [name]: value });
  };

  const handleCategoryChange = e => {
    const value = e.target.value;
    setNewReminder({ ...newReminder, category: value, selectedTask: '', name: '', date: '', relativeTime: '' });
  };

  const handleAddReminder = () => {
    setIsAdding(true);
    setIsEditing(false);
    setNewReminder({ name: '', time: '', category: '', selectedTask: '', date: '', relativeTime: '' });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(false);
    setNewReminder({ name: '', time: '', category: '', selectedTask: '', date: '', relativeTime: '' });
  };

  const handleSave = async e => {
    e.preventDefault();
    try {
      const selectedTask = tasks.find(task => task._id === newReminder.selectedTask);

      const newReminderData = {
        ...newReminder,
        name: selectedTask ? selectedTask.title : '',
        date: selectedTask ? selectedTask.dueDate : '',
      };

      if (isEditing) {
        await axios.put(`http://localhost:5000/api/reminders/${editingReminderId}`, newReminderData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setReminders(reminders.map(reminder => (reminder._id === editingReminderId ? newReminderData : reminder)));
      } else {
        const response = await axios.post('http://localhost:5000/api/reminders', newReminderData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setReminders([...reminders, response.data]);
      }

      setIsAdding(false);
      setIsEditing(false);
      setNewReminder({ name: '', time: '', category: '', selectedTask: '', date: '', relativeTime: '' });

      showNotification('Reminder Created', `Reminder for ${newReminderData.name} has been created.`);
    } catch (error) {
      console.error('Error saving reminder:', error);
    }
  };

  const handleEdit = async id => {
    const reminderToEdit = reminders.find(reminder => reminder._id === id);
    setNewReminder({
      name: reminderToEdit.name,
      time: reminderToEdit.time,
      category: reminderToEdit.category,
      selectedTask: reminderToEdit.selectedTask,
      date: reminderToEdit.date,
      relativeTime: reminderToEdit.relativeTime,
    });
    setIsAdding(true);
    setIsEditing(true);
    setEditingReminderId(id);
  };

  const handleDelete = async id => {
    try {
      await axios.delete(`http://localhost:5000/api/reminders/${id}`);
      setReminders(reminders.filter(reminder => reminder._id !== id));
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  };

  return (
    <div className="reminder-page">
      <Header />
      <div className="reminder-container">
        <Sidebar />
        <div className="reminder-content">
          {!isAdding ? (
            <div className="upcoming-reminders">
              <h2>Upcoming Reminders</h2>
              <p>Your organized list of tasks</p>
              <button className="add-reminder-button" onClick={handleAddReminder}>
                Add New Reminder
              </button>
              <ul className="reminder-list">
                {reminders.map(reminder => {
                  const selectedTask = tasks.find(task => task._id === reminder.selectedTask);

                  const dueDate = selectedTask ? new Date(selectedTask.dueDate) : null;

                  return (
                    <li key={reminder._id} className="reminder-item">
                      <div className="reminder-info">
                        <span>{reminder.name}</span>
                        <span>{dueDate ? dueDate.toLocaleDateString() : 'No due date'}</span>
                        <span>{reminder.relativeTime}</span>
                      </div>
                      <div className="reminder-actions">
                        <button onClick={() => handleEdit(reminder._id)}>Edit</button>
                        <button onClick={() => handleDelete(reminder._id)}>Delete</button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <div className="add-reminder-form">
              <h3>{isEditing ? 'Edit Reminder' : 'Create a Reminder'}</h3>
              <form onSubmit={handleSave}>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    name="category"
                    value={newReminder.category}
                    onChange={handleCategoryChange}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Task">Task</option>
                  </select>
                </div>
                {newReminder.category && (
                  <div className="form-group">
                    <label>Select Task</label>
                    <select
                      name="selectedTask"
                      value={newReminder.selectedTask}
                      onChange={(e) => {
                        const selected = e.target.value;
                        const selectedTask = tasks.find(task => task._id === selected);
                        setNewReminder({
                          ...newReminder,
                          selectedTask: selected,
                          name: selectedTask ? selectedTask.title : '',
                          date: selectedTask ? selectedTask.dueDate : '',
                        });
                      }}
                      required
                    >
                      <option value="">Select Task</option>
                      {tasks.map(task => (
                        <option key={task._id} value={task._id}>
                          {task.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="form-group">
                  <label>Reminder Time</label>
                  <select
                    name="relativeTime"
                    value={newReminder.relativeTime}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Reminder Time</option>
                    <option value="1 day before">1 day before</option>
                    <option value="2 days before">2 days before</option>
                    <option value="3 days before">3 days before</option>
                  </select>
                </div>
                <div className="form-buttons">
                  <button type="button" onClick={handleCancel}>
                    Cancel
                  </button>
                  <button type="submit" className="save-reminder-button">
                    {isEditing ? 'Update Reminder' : 'Save Reminder'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reminder;
