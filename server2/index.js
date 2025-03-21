require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files from 'uploads' directory

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI);

mongoose.connection.on('error', (error) => console.error('MongoDB connection error:', error));
mongoose.connection.once('open', () => console.log('Connected to MongoDB'));

// Schema and Models

const taskSchema = new mongoose.Schema({
  title: String,
  category: String,
  course: String,
  dueDate: Date,
  description: String,
  priority: String,
  status: String,
});

const courseSchema = new mongoose.Schema({
  name: String,
  instructor: String,
  color: String,
  file: { type: String, default: '' }, // File path or URL
});

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  college: String,
  fieldOfStudy: String,
  yearOfStudy: String,
  securityQuestion: String,
  securityAnswer: String,
});

const studySessionSchema = new mongoose.Schema({
  name: String, // Add the name field
  course: String,
  date: Date,
  startTime: String,
  endTime: String,
  notes: String,
  enableNotifications: Boolean,
});

const reminderSchema = new mongoose.Schema({
  name: String,
  time: String,
  category: String,
  selectedTask: String,
  userEmail: String, // Add userEmail field to store the user's email
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the user
  date: Date, // Add the date field
});

// Models
const Task = mongoose.model('Task', taskSchema);
const Course = mongoose.model('Course', courseSchema);
const User = mongoose.model('User', userSchema);
const StudySession = mongoose.model('StudySession', studySessionSchema);
const Reminder = mongoose.model('Reminder', reminderSchema);
const feedbackSchema = new mongoose.Schema({
  name: String,
  email: String,
  type: String,
  message: String,
  date: { type: Date, default: Date.now },
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'), // Directory to store uploaded files
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`), // Create unique filenames
});

const upload = multer({ storage });

// Middleware to authenticate JWT token
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      req.user = decoded;
      next();
    });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// API Endpoints

// 1. Task Routes

// Get all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks', error });
  }
});

// Create a new task
app.post('/api/tasks', async (req, res) => {
  try {
    const newTask = new Task({ ...req.body, dueDate: new Date(req.body.dueDate) });
    await newTask.save();
    res.json(newTask);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create task', error });
  }
});

// Update a task by ID
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task', error });
  }
});

// Delete a task by ID
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete task', error });
  }
});

// 2. Course Routes

// Get all courses
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch courses', error });
  }
});

// Create a new course
app.post('/api/courses', async (req, res) => {
  try {
    const newCourse = new Course(req.body);
    await newCourse.save();
    res.json(newCourse);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create course', error });
  }
});

// Update a course by ID
app.put('/api/courses/:id', async (req, res) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update course', error });
  }
});

// Delete a course by ID
app.delete('/api/courses/:id', async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete course', error });
  }
});

// 3. User Routes

// User registration
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, college, fieldOfStudy, yearOfStudy, securityQuestion, securityAnswer } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      college,
      fieldOfStudy,
      yearOfStudy,
      securityQuestion,
      securityAnswer,
    });
    await newUser.save();
    res.json({ message: 'Registration successful!' });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error });
  }
});

// Get user profile
app.get('/api/profile', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId, { password: 0 }); // Exclude password from the response
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile', error });
  }
});

// Update user profile
app.put('/api/profile', authenticateJWT, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.user.userId, req.body, { new: true });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile', error });
  }
});

// User login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error });
  }
});

// User logout
app.post('/api/logout', authenticateJWT, (req, res) => {
  res.json({ message: 'Logout successful' });
});

// Close user account
app.delete('/api/profile', authenticateJWT, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.userId);
    res.json({ message: 'Account closed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to close account', error });
  }
});

// 4. Study Session Routes

// Get all study sessions
app.get('/api/study-sessions', async (req, res) => {
  try {
    const sessions = await StudySession.find();
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch study sessions', error });
  }
});

// Create a new study session
app.post('/api/study-sessions', async (req, res) => {
  try {
    const newSession = new StudySession({
      ...req.body,
      date: new Date(req.body.date),
    });
    await newSession.save();
    res.json(newSession);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create study session', error });
  }
});

// Update a study session by ID
app.put('/api/study-sessions/:id', async (req, res) => {
  try {
    const updatedSession = await StudySession.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        date: new Date(req.body.date),
      },
      { new: true }
    );
    res.json(updatedSession);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update study session', error });
  }
});

// Delete a study session by ID
app.delete('/api/study-sessions/:id', async (req, res) => {
  try {
    await StudySession.findByIdAndDelete(req.params.id);
    res.json({ message: 'Study session deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete study session', error });
  }
});

// 5. Reminder Routes

// Get all reminders for the logged-in user
app.get('/api/reminders/user', authenticateJWT, async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.user.userId });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reminders', error });
  }
});

// Create a new reminder
app.post('/api/reminders', authenticateJWT, async (req, res) => {
  try {
    const newReminder = new Reminder({
      ...req.body,
      userEmail: req.user.email, // Store the user's email
      userId: req.user.userId, // Store the user's ID
      date: new Date(req.body.date), // Convert the date string to a Date object
    });
    await newReminder.save();
    res.json(newReminder);
  } catch (error) {
    console.error('Error creating reminder:', error);
    res.status(500).json({ message: 'Failed to create reminder', error });
  }
});

// Update a reminder by ID
app.put('/api/reminders/:id', authenticateJWT, async (req, res) => {
  try {
    const updatedReminder = await Reminder.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        userEmail: req.user.email, // Update the user's email
        userId: req.user.userId, // Update the user's ID
        date: new Date(req.body.date), // Convert the date string to a Date object
      },
      { new: true }
    );
    res.json(updatedReminder);
  } catch (error) {
    console.error('Error updating reminder:', error);
    res.status(500).json({ message: 'Failed to update reminder', error });
  }
});

// Delete a reminder by ID
app.delete('/api/reminders/:id', async (req, res) => {
  try {
    await Reminder.findByIdAndDelete(req.params.id);
    res.json({ message: 'Reminder deleted' });
  } catch (error) {
    console.error('Error deleting reminder:', error);
    res.status(500).json({ message: 'Failed to delete reminder', error });
  }
});

// Feedback Routes

// Create a new feedback
app.post('/api/feedback', async (req, res) => {
  try {
    const newFeedback = new Feedback(req.body);
    await newFeedback.save();
    res.status(200).json({ message: 'Feedback submitted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit feedback', error });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
