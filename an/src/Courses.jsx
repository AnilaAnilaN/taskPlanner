import React, { useState, useEffect } from 'react';
import { getCourses, createCourse, updateCourse, deleteCourse } from './api'; // Import API functions
import Sidebar from './Sidebar';
import Header from './Header';
import CourseCard from './Courses/CourseCard';
import AddEditCourseForm from './Courses/AddEditCourseForm';
import './Courses.css';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [view, setView] = useState('list');
  const [currentCourse, setCurrentCourse] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await getCourses(); // Use getCourses from api.js
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to fetch courses. Please try again.');
    }
  };

  const handleAddCourse = async (course) => {
    try {
      const response = await createCourse(course); // Use createCourse from api.js
      setCourses([...courses, response.data]);
      setView('list');
    } catch (error) {
      console.error('Error adding course:', error);
      setError('Failed to add course. Please try again.');
    }
  };

  const handleEditCourse = async (updatedCourse) => {
    try {
      const response = await updateCourse(updatedCourse._id, updatedCourse); // Use updateCourse from api.js
      setCourses(courses.map(course => (course._id === updatedCourse._id ? response.data : course)));
      setCurrentCourse(null);
      setView('list');
    } catch (error) {
      console.error('Error editing course:', error);
      setError('Failed to edit course. Please try again.');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await deleteCourse(courseId); // Use deleteCourse from api.js
      setCourses(courses.filter(course => course._id !== courseId));
    } catch (error) {
      console.error('Error deleting course:', error);
      setError('Failed to delete course. Please try again.');
    }
  };

  return (
    <div className="courses-page">
      <Sidebar />
      <Header />
      <div className="courses-main-content">
        {error && <p className="error">{error}</p>}
        {view === 'list' && (
          <div className="course-list">
            {courses.map(course => (
              <CourseCard
                key={course._id}
                course={course}
                onEdit={() => {
                  setCurrentCourse(course);
                  setView('edit');
                }}
                onDelete={() => handleDeleteCourse(course._id)}
              />
            ))}
            <button className="add-course-button" onClick={() => setView('add')}>+</button>
          </div>
        )}
        {view === 'add' && (
          <AddEditCourseForm
            onSave={handleAddCourse}
            onCancel={() => setView('list')}
            courses={courses}
          />
        )}
        {view === 'edit' && (
          <AddEditCourseForm
            course={currentCourse}
            onSave={handleEditCourse}
            onCancel={() => {
              setCurrentCourse(null);
              setView('list');
            }}
            courses={courses}
          />
        )}
      </div>
    </div>
  );
};

export default Courses;
