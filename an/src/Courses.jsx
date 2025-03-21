import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import Header from './Header';
import CourseCard from './Courses/CourseCard';
import AddEditCourseForm from './Courses/AddEditCourseForm';
import './Courses.css';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [view, setView] = useState('list');
  const [currentCourse, setCurrentCourse] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleAddCourse = async (course) => {
    try {
      const response = await axios.post('http://localhost:5000/api/courses', course);
      setCourses([...courses, response.data]);
      setView('list');
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  const handleEditCourse = async (updatedCourse) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/courses/${updatedCourse._id}`, updatedCourse);
      setCourses(courses.map(course => (course._id === updatedCourse._id ? response.data : course)));
      setCurrentCourse(null);
      setView('list');
    } catch (error) {
      console.error('Error editing course:', error);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await axios.delete(`http://localhost:5000/api/courses/${courseId}`);
      setCourses(courses.filter(course => course._id !== courseId));
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  return (
    <div className="courses-page">
      <Sidebar />
      <Header />
      <div className="courses-main-content">
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
