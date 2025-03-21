import React, { useState } from 'react';
import Editor from './Editor';
import './EditTask.css';

const EditTask = ({ selectedTask, courses, updateTask, setView }) => {
  const [editedTask, setEditedTask] = useState({ ...selectedTask });
  const categories = ['quiz', 'gdb', 'assignment', 'exam'];

  const handleSubmit = () => {
    updateTask(editedTask);
    setView('list');
  };

  return (
    <div className="add-task-form">
      <button className="back-button" onClick={() => setView('list')}>&#8592; Back</button>
      <h2>Edit Task</h2>
      <div className="form-field">
        <label>Title</label>
        <input
          type="text"
          value={editedTask.title}
          onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
        />
      </div>
      <div className="form-field">
        <label>Category</label>
        <select
          value={editedTask.category}
          onChange={(e) => setEditedTask({ ...editedTask, category: e.target.value })}
        >
          <option value="">Select Category</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      <div className="form-field">
        <label>Course</label>
        <select
          value={editedTask.course}
          onChange={(e) => setEditedTask({ ...editedTask, course: e.target.value })}
        >
          <option value="">Select Course</option>
          {courses.map(course => (
            <option key={course._id} value={course.name}>{course.name}</option>
          ))}
        </select>
      </div>
      <div className="form-field">
        <label>Due Date</label>
        <input
          type="date"
          value={editedTask.dueDate.split('T')[0]}
          onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
        />
      </div>
      <div className="form-field">
        <label>Task Description</label>
        <Editor
          value={editedTask.description}
          onChange={(value) => setEditedTask({ ...editedTask, description: value })}
        />
      </div>
      <div className="form-field">
        <label>Priority</label>
        <select
          value={editedTask.priority}
          onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
        >
          <option value="">Select Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>
      <div className="form-field">
        <button onClick={handleSubmit}>Save Task</button>
        <button className="cancel" onClick={() => setView('list')}>Cancel</button>
      </div>
    </div>
  );
};

export default EditTask;
