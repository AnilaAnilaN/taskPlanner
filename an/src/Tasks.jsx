import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import Header from './Header';
import TaskList from './tasks/TaskList';
import AddTask from './tasks/AddTask';
import EditTask from './tasks/EditTask';
import ViewDescription from './tasks/ViewDescription';
import './Tasks.css';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [courses, setCourses] = useState([]);
  const [view, setView] = useState('list');
  const [selectedTask, setSelectedTask] = useState(null);
  const [filters, setFilters] = useState({ priority: '', course: '', date: '' });
  const [sort, setSort] = useState('title');

  useEffect(() => {
    fetchTasks();
    fetchCourses();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const addTask = async (task) => {
    try {
      const response = await axios.post('http://localhost:5000/api/tasks', task);
      setTasks([...tasks, response.data]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const updateTaskStatus = async (id, status) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/tasks/${id}`, { status });
      setTasks(tasks.map(task => (task._id === id ? response.data : task)));
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const updateTask = async (task) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/tasks/${task._id}`, task);
      setTasks(tasks.map(t => (t._id === task._id ? response.data : t)));
      setView('list');
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`);
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="tasks-page">
      <Sidebar />
      <div className="main-content">
        <Header title="Tasks" />
        {view === 'list' && <TaskList
          tasks={tasks}
          courses={courses}
          filters={filters}
          setFilters={setFilters}
          sort={sort}
          setSort={setSort}
          setView={setView}
          setSelectedTask={setSelectedTask}
          updateTaskStatus={updateTaskStatus}
          deleteTask={deleteTask} // Pass the deleteTask function to TaskList
        />}
        {view === 'add' && <AddTask
          addTask={addTask}
          courses={courses}
          setView={setView}
        />}
        {view === 'edit' && <EditTask
          selectedTask={selectedTask}
          courses={courses}
          updateTask={updateTask}
          setView={setView}
        />}
        {view === 'view-description' && <ViewDescription
          selectedTask={selectedTask}
          updateTask={updateTask}
          setView={setView}
        />}
      </div>
    </div>
  );
};

export default Tasks;
