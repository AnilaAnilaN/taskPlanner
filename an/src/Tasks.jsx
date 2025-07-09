import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getTasks, createTask, updateTask, deleteTask, getCourses } from './api';
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
      setView('list');
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

  // Editor Component
  const Editor = ({ value, onChange }) => {
    const modules = {
      toolbar: [
        [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
        [{ 'size': [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image', 'video'],
        ['clean'],
        [{ 'color': [] }, { 'background': [] }]
      ]
    };
    const formats = [
      'header', 'font', 'size',
      'bold', 'italic', 'underline', 'strike', 'blockquote',
      'list', 'bullet', 'indent',
      'link', 'image', 'video',
      'color', 'background'
    ];
    return (
      <ReactQuill
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        className="editor"
      />
    );
  };

  // TaskForm Component (Reusable for Add/Edit/View Description)
  const TaskForm = ({ mode, task, courses, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState(
      mode === 'add'
        ? { title: '', category: '', course: '', dueDate: '', description: '', priority: '', status: 'Pending' }
        : { ...task, dueDate: task.dueDate.split('T')[0] }
    );
    const [errors, setErrors] = useState({});
    const categories = ['quiz', 'gdb', 'assignment', 'exam'];

    const validateForm = () => {
      let formIsValid = true;
      let errors = {};
      if (mode !== 'view-description') {
        if (!formData.title) { errors.title = 'Title is required'; formIsValid = false; }
        if (!formData.category) { errors.category = 'Category is required'; formIsValid = false; }
        if (!formData.course) { errors.course = 'Course is required'; formIsValid = false; }
        if (!formData.dueDate) { errors.dueDate = 'Due Date is required'; formIsValid = false; }
        if (!formData.priority) { errors.priority = 'Priority is required'; formIsValid = false; }
      }
      if (!formData.description) { errors.description = 'Description is required'; formIsValid = false; }
      setErrors(errors);
      return formIsValid;
    };

    const handleSubmit = () => {
      if (mode === 'view-description' || validateForm()) {
        onSubmit(formData);
      }
    };

    return (
      <div className="task-form">
        {mode !== 'add' && <button className="back-button" onClick={onCancel}>← Back</button>}
        <h2>{mode === 'add' ? 'Add Task' : mode === 'edit' ? 'Edit Task' : 'View/Edit Task Description'}</h2>
        {mode !== 'view-description' && (
          <>
            <div className="form-field">
              <label>Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              {errors.title && <span className="error">{errors.title}</span>}
            </div>
            <div className="form-field">
              <label>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
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
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
              {errors.dueDate && <span className="error">{errors.dueDate}</span>}
            </div>
            <div className="form-field">
              <label>Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="">Select Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              {errors.priority && <span className="error">{errors.priority}</span>}
            </div>
          </>
        )}
        <div className="form-field">
          <label>Task Description</label>
          <Editor
            value={formData.description}
            onChange={(value) => setFormData({ ...formData, description: value })}
          />
          {errors.description && <span className="error">{errors.description}</span>}
        </div>
        <div className="form-field">
          <button onClick={handleSubmit}>{mode === 'add' ? 'Add Task' : mode === 'edit' ? 'Save Task' : 'Save Description'}</button>
          <button className="cancel" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    );
  };

  // TaskList Component
  const TaskList = ({ tasks, courses, filters, setFilters, sort, setSort, setView, setSelectedTask, updateTaskStatus, deleteTask }) => {
    const filteredTasks = tasks
      .filter(task =>
        (filters.priority ? task.priority === filters.priority : true) &&
        (filters.course ? task.course === filters.course : true) &&
        (filters.date ? task.dueDate === filters.date : true)
      )
      .sort((a, b) => {
        if (sort === 'title') return a.title.localeCompare(b.title);
        if (sort === 'date') return new Date(a.dueDate) - new Date(b.dueDate);
        if (sort === 'priority') return a.priority.localeCompare(b.priority);
        return 0;
      });

    return (
      <div className="task-list">
        <div className="task-filters">
          <select onChange={(e) => setFilters({ ...filters, course: e.target.value })} value={filters.course}>
            <option value="">All Courses</option>
            {courses.map(course => (
              <option key={course._id} value={course.name}>{course.name}</option>
            ))}
          </select>
          <select onChange={(e) => setFilters({ ...filters, priority: e.target.value })} value={filters.priority}>
            <option value="">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <input type="date" onChange={(e) => setFilters({ ...filters, date: e.target.value })} value={filters.date} />
          <select onChange={(e) => setSort(e.target.value)} value={sort}>
            <option value="title">Sort By: Title</option>
            <option value="date">Sort By: Date</option>
            <option value="priority">Sort By: Priority</option>
          </select>
        </div>
        {filteredTasks.length === 0 ? (
          <div className="no-tasks">
            <p>You haven’t added any tasks yet</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div className={`task-item priority-${task.priority.toLowerCase()}`} key={task._id}>
              <h3>{task.title}</h3>
              <p>Category: {task.category}</p>
              <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
              <p className={`priority ${task.priority.toLowerCase()}`}>Priority: {task.priority}</p>
              <p>
                <a href="#" onClick={() => { setSelectedTask(task); setView('view-description'); }}>
                  View Description
                </a>
              </p>
              <p>Course: {task.course}</p>
              <p className={`status ${task.status.toLowerCase()}`}>Status: {task.status}</p>
              <div className="task-actions">
                <button onClick={() => updateTaskStatus(task._id, 'Completed')}>
                  {task.status === 'Completed' ? 'Task Completed' : 'Mark as Completed'}
                </button>
                <button onClick={() => { setSelectedTask(task); setView('edit'); }}>
                  Edit
                </button>
                <button onClick={() => deleteTask(task._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
        <button onClick={() => setView('add')} className="add-task-button">Add Task</button>
      </div>
    );
  };

  return (
    <div className="tasks-page">
      <div className="main-content">
        {error && <p className="error">{error}</p>}
        {view === 'list' && (
          <TaskList
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
          />
        )}
        {view === 'add' && (
          <TaskForm
            mode="add"
            courses={courses}
            onSubmit={addTask}
            onCancel={() => setView('list')}
          />
        )}
        {view === 'edit' && (
          <TaskForm
            mode="edit"
            task={selectedTask}
            courses={courses}
            onSubmit={updateTask}
            onCancel={() => setView('list')}
          />
        )}
        {view === 'view-description' && (
          <TaskForm
            mode="view-description"
            task={selectedTask}
            courses={courses}
            onSubmit={updateTask}
            onCancel={() => setView('list')}
          />
        )}
      </div>
    </div>
  );
};

export default Tasks;
