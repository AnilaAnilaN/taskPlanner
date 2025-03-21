import React, { useState, useEffect } from 'react';
import Editor from './Editor';
import './ViewDescription.css';
import axios from 'axios';

const ViewDescription = ({ selectedTask, updateTask, setView }) => {
  const [editedDescription, setEditedDescription] = useState(selectedTask.description);

  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      handleAutoSave();
    }, 300000); // 5 minutes

    return () => clearInterval(autoSaveInterval);
  }, [editedDescription]);

  const handleAutoSave = () => {
    const updatedTask = { ...selectedTask, description: editedDescription };
    updateTask(updatedTask);
    axios.post('http://localhost:5000/save', { content: editedDescription })
      .then((response) => console.log('Content auto-saved:', response.data))
      .catch((error) => console.error('Error auto-saving content:', error));
  };

  const handleSave = () => {
    const updatedTask = { ...selectedTask, description: editedDescription };
    updateTask(updatedTask);
    axios.post('http://localhost:5000/save', { content: editedDescription })
      .then((response) => console.log('Content saved:', response.data))
      .catch((error) => console.error('Error saving content:', error));
    setView('list');
  };

  return (
    <div className="add-task-form">
      <h2>View/Edit Task Description</h2>
      <div className="form-field">
        <label>Task Description</label>
        <Editor value={editedDescription} onChange={setEditedDescription} />
      </div>
      <div className="form-field">
        <button onClick={handleSave}>Save Description</button>
        <button onClick={() => setView('list')}>Cancel</button>
      </div>
    </div>
  );
};

export default ViewDescription;
