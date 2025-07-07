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

export const register = (user) => api.post('/api/register', user);
export const login = (credentials) => api.post('/api/login', credentials);
export const getProfile = () => api.get('/api/profile');
export const updateProfile = (user) => api.put('/api/profile', user);
export const deleteProfile = () => api.delete('/api/profile');

export const getStudySessions = () => api.get('/api/study-sessions');
export const createStudySession = (session) => api.post('/api/study-sessions', session);
export const updateStudySession = (id, session) => api.put(`/api/study-sessions/${id}`, session);
export const deleteStudySession = (id) => api.delete(`/api/study-sessions/${id}`);

export const getReminders = () => api.get('/api/reminders/user');
export const createReminder = (reminder) => api.post('/api/reminders', reminder);
export const updateReminder = (id, reminder) => api.put(`/api/reminders/${id}`, reminder);
export const deleteReminder = (id) => api.delete(`/api/reminders/${id}`);

export const submitFeedback = (feedback) => api.post('/api/feedback', feedback);

export default api;
