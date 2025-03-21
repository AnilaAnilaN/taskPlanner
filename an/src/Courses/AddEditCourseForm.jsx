import React, { useState, useEffect } from 'react';
import './AddEditCourseForm.css';

const colorOptions = [
  'linear-gradient(145deg, #FF7F50, #FF4500)',
  'linear-gradient(145deg, #FFD700, #FFA500)',
  'linear-gradient(145deg, #ADFF2F, #32CD32)',
  'linear-gradient(145deg, #00CED1, #4682B4)',
  'linear-gradient(145deg, #9370DB, #8A2BE2)',
  'linear-gradient(145deg, #FF1493, #C71585)',
  'linear-gradient(145deg, #1E90FF, #4169E1)',
  'linear-gradient(145deg, #FFDAB9, #FF6347)',
  'linear-gradient(145deg, #66CDAA, #20B2AA)',
  'linear-gradient(145deg, #FFC0CB, #FF69B4)',

  // Additional glittery colors
  'linear-gradient(145deg, #DA70D6, #BA55D3)', // Glittery purple
  'linear-gradient(145deg, #F08080, #FA8072)', // Glittery coral
  'linear-gradient(145deg, #00FF7F, #00FA9A)', // Glittery spring green
  'linear-gradient(145deg, #FFD700, #FFA500)', // Glittery gold
  'linear-gradient(145deg, #EE82EE, #DA70D6)', // Glittery violet
];

const AddEditCourseForm = ({ course, onSave, onCancel, courses }) => {
  const [courseName, setCourseName] = useState(course?.name || '');
  const [courseInstructor, setCourseInstructor] = useState(course?.instructor || '');
  const [courseColor, setCourseColor] = useState(course?.color || colorOptions[0]);
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (course) {
      setCourseName(course.name);
      setCourseInstructor(course.instructor);
      setCourseColor(course.color);
    }
  }, [course]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (courses.some(c => c.name === courseName && c._id !== course?._id)) {
      setError('A course with this name already exists.');
      return;
    }
    const newCourse = {
      _id: course ? course._id : null,
      name: courseName,
      instructor: courseInstructor,
      color: courseColor,
    };
    onSave(newCourse);
  };

  const toggleColorPalette = () => {
    setShowColorPalette(!showColorPalette);
  };

  const selectColor = (color) => {
    setCourseColor(color);
    setShowColorPalette(false);
  };

  const getColorStyle = () => ({
    background: courseColor,
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
  });

  return (
    <div className="course-form-container">
      <form onSubmit={handleSubmit} className="course-form">
        <h2>{course ? 'Edit Course' : 'Add Course'}</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="form-field">
          <label>Course Name</label>
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            placeholder="Enter course name"
            required
            className="input-field"
          />
        </div>

        <div className="form-field">
          <label>Instructor</label>
          <input
            type="text"
            value={courseInstructor}
            onChange={(e) => setCourseInstructor(e.target.value)}
            placeholder="Enter instructor name"
            required
            className="input-field"
          />
        </div>

        <div className="form-field">
          <label>Choose Color</label>
          <div
            className="color-circle"
            style={getColorStyle()}
            onClick={toggleColorPalette}
          ></div>
          {showColorPalette && (
            <div className="color-palette">
              {colorOptions.map((color, index) => (
                <div
                  key={index}
                  className="color-option"
                  style={{ background: color }}
                  onClick={() => selectColor(color)}
                ></div>
              ))}
            </div>
          )}
        </div>

        {/* Reversed Buttons: Save button on the left, Cancel button on the right */}
        <div className="form-buttons">
          <button
            type="submit"
            className="submit-button"
          >
            Save Course
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="cancel-button"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditCourseForm;
