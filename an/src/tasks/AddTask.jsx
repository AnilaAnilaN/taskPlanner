import React, { useState } from 'react';
import Editor from './Editor';
import './AddTask.css';

const AddTask = ({ addTask, courses, setView }) => {
  const [newTask, setNewTask] = useState({
    title: '',
    category: '',
    course: '',
    dueDate: '',
    description: '',
    priority: '',
    status: 'Pending'
  });
  const [errors, setErrors] = useState({});
  const categories = ['quiz', 'gdb', 'assignment', 'exam'];

  const validateForm = () => {
    let formIsValid = true;
    let errors = {};

    if (!newTask.title) {
      formIsValid = false;
      errors.title = 'Title is required';
    }
    if (!newTask.category) {
      formIsValid = false;
      errors.category = 'Category is required';
    }
    if (!newTask.course) {
      formIsValid = false;
      errors.course = 'Course is required';
    }
    if (!newTask.dueDate) {
      formIsValid = false;
      errors.dueDate = 'Due Date is required';
    }
    if (!newTask.description) {
      formIsValid = false;
      errors.description = 'Description is required';
    }
    if (!newTask.priority) {
      formIsValid = false;
      errors.priority = 'Priority is required';
    }

    setErrors(errors);
    return formIsValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      addTask(newTask);
      setView('list');
    }
  };

  return (
    <div className="add-task-form">
      <button className="back-button" onClick={() => setView('list')}>&#8592; Back</button>
      <h2>Add Task</h2>
      <div className="form-field">
        <label>Title</label>
        <input
          type="text"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        {errors.title && <span className="error">{errors.title}</span>}
      </div>
      <div className="form-field">
        <label>Category</label>
        <select
          value={newTask.category}
          onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
        >
          <option value="">Select Category</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        {errors.category && <span className="error">{errors.category}</span>}
      </div>
      <div className="form-field">
        <label>Course</label>
        <select
          value={newTask.course}
          onChange={(e) => setNewTask({ ...newTask, course: e.target.value })}
        >
          <option value="">Select Course</option>
          {courses.map(course => (
            <option key={course._id} value={course.name}>{course.name}</option>
          ))}
        </select>
        {errors.course && <span className="error">{errors.course}</span>}
      </div>
      <div className="form-field">
        <label>Due Date</label>
        <input
          type="date"
          value={newTask.dueDate}
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
        />
        {errors.dueDate && <span className="error">{errors.dueDate}</span>}
      </div>
      <div className="form-field">
        <label>Task Description</label>
        <Editor
          value={newTask.description}
          onChange={(value) => setNewTask({ ...newTask, description: value })}
        />
        {errors.description && <span className="error">{errors.description}</span>}
      </div>
      <div className="form-field">
        <label>Priority</label>
        <select
          value={newTask.priority}
          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
        >
          <option value="">Select Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        {errors.priority && <span className="error">{errors.priority}</span>}
      </div>
      <div className="form-field">
        <button onClick={handleSubmit}>Add Task</button>
        <button className="cancel" onClick={() => setView('list')}>Cancel</button>
      </div>
    </div>
  );
};

export default AddTask;
