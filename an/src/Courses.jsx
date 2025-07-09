import React, { useState, useEffect } from 'react';
import { getCourses, createCourse, updateCourse, deleteCourse } from './api';
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
      const response = await getCourses();
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to fetch courses. Please try again.');
    }
  };

  const handleAddCourse = async (course) => {
    try {
      const response = await createCourse(course);
      setCourses([...courses, response.data]);
      setView('list');
    } catch (error) {
      console.error('Error adding course:', error);
      setError('Failed to add course. Please try again.');
    }
  };

  const handleEditCourse = async (updatedCourse) => {
    try {
      const response = await updateCourse(updatedCourse._id, updatedCourse);
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
      await deleteCourse(courseId);
      setCourses(courses.filter(course => course._id !== courseId));
    } catch (error) {
      console.error('Error deleting course:', error);
      setError('Failed to delete course. Please try again.');
    }
  };

  return (
    <div className="courses-container">
      <Sidebar />
      <div className="courses-main-content">
        <Header />
        {error && <p className="error">{error}</p>}
        {view === 'list' && (
          <div className="courses-section">
            <h2>Courses</h2>
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
            </div>
            <button className="add-course-button" onClick={() => setView('add')}>
              +
            </button>
          </div>
        )}
        {(view === 'add' || view === 'edit') && (
          <div className="course-form-container">
            <AddEditCourseForm
              course={view === 'edit' ? currentCourse : null}
              onSave={view === 'add' ? handleAddCourse : handleEditCourse}
              onCancel={() => {
                setCurrentCourse(null);
                setView('list');
              }}
              courses={courses}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
