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
app.use('/uploads', express.static(path.join(__dirname, '../Uploads')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('error', (error) => console.error('MongoDB connection error:', error));
mongoose.connection.once('open', () => console.log('Connected to MongoDB'));

// Schemas and Models
const taskSchema = new mongoose.Schema({
  title: String,
  category: String,
  course: String,
  dueDate: Date,
  description: String,
  priority: String,
  status: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const courseSchema = new mongoose.Schema({
  name: String,
  instructor: String,
  color: String,
  file: { type: String, default: '' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
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
  name: String,
  course: String,
  date: Date,
  startTime: String,
  endTime: String,
  notes: String,
  enableNotifications: Boolean,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const reminderSchema = new mongoose.Schema({
  name: String,
  time: String,
  category: String,
  selectedTask: String,
  userEmail: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: Date,
});

const feedbackSchema = new mongoose.Schema({
  name: String,
  email: String,
  type: String,
  message: String,
  date: { type: Date, default: Date.now },
});

// Models
const Task = mongoose.model('Task', taskSchema);
const Course = mongoose.model('Course', courseSchema);
const User = mongoose.model('User', userSchema);
const StudySession = mongoose.model('StudySession', studySessionSchema);
const Reminder = mongoose.model('Reminder', reminderSchema);
const Feedback = mongoose.model('Feedback', feedbackSchema);

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, '../Uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
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
app.get('/api/tasks', authenticateJWT, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.userId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks', error });
  }
});

app.post('/api/tasks', authenticateJWT, async (req, res) => {
  try {
    const newTask = new Task({
      ...req.body,
      dueDate: new Date(req.body.dueDate),
      userId: req.user.userId,
    });
    await newTask.save();
    res.json(newTask);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create task', error });
  }
});

app.put('/api/tasks/:id', authenticateJWT, async (req, res) => {
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found or not authorized' });
    }
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task', error });
  }
});

app.delete('/api/tasks/:id', authenticateJWT, async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found or not authorized' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete task', error });
  }
});

// 2. Course Routes
app.get('/api/courses', authenticateJWT, async (req, res) => {
  try {
    const courses = await Course.find({ userId: req.user.userId });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch courses', error });
  }
});

app.post('/api/courses', authenticateJWT, async (req, res) => {
  try {
    const newCourse = new Course({
      ...req.body,
      userId: req.user.userId,
    });
    await newCourse.save();
    res.json(newCourse);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create course', error });
  }
});

app.put('/api/courses/:id', authenticateJWT, async (req, res) => {
  try {
    const updatedCourse = await Course.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );
    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found or not authorized' });
    }
    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update course', error });
  }
});

app.delete('/api/courses/:id', authenticateJWT, async (req, res) => {
  try {
    const deletedCourse = await Course.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (!deletedCourse) {
      return res.status(404).json({ message: 'Course not found or not authorized' });
    }
    res.json({ message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete course', error });
  }
});

// 3. User Routes
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

app.get('/api/profile', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId, { password: 0 });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile', error });
  }
});

app.put('/api/profile', authenticateJWT, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.user.userId, req.body, { new: true });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile', error });
  }
});

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

app.post('/api/logout', authenticateJWT, (req, res) => {
  res.json({ message: 'Logout successful' });
});

app.delete('/api/profile', authenticateJWT, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.userId);
    res.json({ message: 'Account closed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete account', error });
  }
});

// 4. Study Session Routes
app.get('/api/study-sessions', authenticateJWT, async (req, res) => {
  try {
    const sessions = await StudySession.find({ userId: req.user.userId });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch study sessions', error });
  }
});

app.post('/api/study-sessions', authenticateJWT, async (req, res) => {
  try {
    const newSession = new StudySession({
      ...req.body,
      date: new Date(req.body.date),
      userId: req.user.userId,
    });
    await newSession.save();
    res.json(newSession);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create study session', error });
  }
});

app.put('/api/study-sessions/:id', authenticateJWT, async (req, res) => {
  try {
    const updatedSession = await StudySession.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { ...req.body, date: new Date(req.body.date) },
      { new: true }
    );
    if (!updatedSession) {
      return res.status(404).json({ message: 'Study session not found or not authorized' });
    }
    res.json(updatedSession);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update study session', error });
  }
});

app.delete('/api/study-sessions/:id', authenticateJWT, async (req, res) => {
  try {
    const deletedSession = await StudySession.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (!deletedSession) {
      return res.status(404).json({ message: 'Study session not found or not authorized' });
    }
    res.json({ message: 'Study session deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete study session', error });
  }
});

// 5. Reminder Routes
app.get('/api/reminders/user', authenticateJWT, async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.user.userId });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reminders', error });
  }
});

app.post('/api/reminders', authenticateJWT, async (req, res) => {
  try {
    const newReminder = new Reminder({
      ...req.body,
      userEmail: req.user.email,
      userId: req.user.userId,
      date: new Date(req.body.date),
    });
    await newReminder.save();
    res.json(newReminder);
  } catch (error) {
    console.error('Error creating reminder:', error);
    res.status(500).json({ message: 'Failed to create reminder', error });
  }
});

app.put('/api/reminders/:id', authenticateJWT, async (req, res) => {
  try {
    const updatedReminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { ...req.body, userEmail: req.user.email, date: new Date(req.body.date) },
      { new: true }
    );
    if (!updatedReminder) {
      return res.status(404).json({ message: 'Reminder not found or not authorized' });
    }
    res.json(updatedReminder);
  } catch (error) {
    console.error('Error updating reminder:', error);
    res.status(500).json({ message: 'Failed to update reminder', error });
  }
});

app.delete('/api/reminders/:id', authenticateJWT, async (req, res) => {
  try {
    const deletedReminder = await Reminder.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (!deletedReminder) {
      return res.status(404).json({ message: 'Reminder not found or not authorized' });
    }
    res.json({ message: 'Reminder deleted' });
  } catch (error) {
    console.error('Error deleting reminder:', error);
    res.status(500).json({ message: 'Failed to delete reminder', error });
  }
});

// 6. Feedback Routes
app.post('/api/feedback', async (req, res) => {
  try {
    const newFeedback = new Feedback(req.body);
    await newFeedback.save();
    res.status(200).json({ message: 'Feedback submitted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit feedback', error });
  }
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../an/dist')));
  app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../an/dist', 'index.html')));
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
