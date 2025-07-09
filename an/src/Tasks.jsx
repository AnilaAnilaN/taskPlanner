import React, { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask, getCourses } from './api';
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
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks();
    fetchCourses();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to fetch tasks. Please try again.');
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await getCourses();
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to fetch courses. Please try again.');
    }
  };

  const addTask = async (task) => {
    try {
      const response = await createTask(task);
      setTasks([...tasks, response.data]);
    } catch (error) {
      console.error('Error adding task:', error);
      setError('Failed to add task. Please try again.');
    }
  };

  const updateTaskStatus = async (id, status) => {
    try {
      const response = await updateTask(id, { status });
      setTasks(tasks.map(task => (task._id === id ? response.data : task)));
    } catch (error) {
      console.error('Error updating task status:', error);
      setError('Failed to update task status. Please try again.');
    }
  };

  const updateTask = async (task) => {
    try {
      const response = await updateTask(task._id, task);
      setTasks(tasks.map(t => (t._id === task._id ? response.data : t)));
      setView('list');
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task. Please try again.');
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task. Please try again.');
    }
  };

  return (
    <div className="tasks-page">
      <div className="main-content">
        {error && <p className="error">{error}</p>}
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
          deleteTask={deleteTask}
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
