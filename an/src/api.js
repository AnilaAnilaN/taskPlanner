import axios from 'axios';
import API_URL from './config';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getTasks = () => api.get('/api/tasks');
export const createTask = (task) => api.post('/api/tasks', task);
export const updateTask = (id, task) => api.put(`/api/tasks/${id}`, task);
export const deleteTask = (id) => api.delete(`/api/tasks/${id}`);

export const getCourses = () => api.get('/api/courses');
export const createCourse = (course) => api.post('/api/courses', course);
export const updateCourse = (id, course) => api.put(`/api/courses/${id}`, course);
export const deleteCourse = (id) => api.delete(`/api/courses/${id}`);

// Authentication-related APIs
export const registerUser = (userData) => api.post('/api/register', userData);
export const loginUser = (credentials) => api.post('/api/login', credentials);

export const getStudySessions = () => api.get('/api/study-sessions');
export const createStudySession = (session) => api.post('/api/study-sessions', session);
export const updateStudySession = (id, session) => api.put(`/api/study-sessions/${id}`, session);
export const deleteStudySession = (id) => api.delete(`/api/study-sessions/${id}`);

export const getReminders = () => api.get('/api/reminders/user');
export const createReminder = (reminder) => api.post('/api/reminders', reminder);
export const updateReminder = (id, reminder) => api.put(`/api/reminders/${id}`, reminder);
export const deleteReminder = (id) => api.delete(`/api/reminders/${id}`);

// Profile-related APIs
export const getProfile = () => api.get('/api/profile');
export const updateProfile = (data) => api.put('/api/profile', data);
export const deleteProfile = () => api.delete('/api/profile');
export const logoutUser = () => api.post('/api/logout');


export const submitFeedback = (feedback) => api.post('/api/feedback', feedback);

export default api;
