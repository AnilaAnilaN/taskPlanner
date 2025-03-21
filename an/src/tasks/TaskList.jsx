import React from 'react';
import './TaskList.css';


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
          <div className="task-item" key={task._id}>
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
      <button onClick={() => setView('add')} className="add-task-button">+</button>
    </div>
  );
};

export default TaskList;
