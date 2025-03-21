import React from 'react';
import './CourseCard.css';

const CourseCard = ({ course, onEdit, onDelete }) => {
  const cardStyle = {
    background: course.color, // Use gradient or solid color from course
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Add a slight shadow for depth
    color: '#fff', // Ensure text is white for contrast
  };

  return (
    <div className="course-card" style={cardStyle}>
      <h3>{course.name}</h3>
      <p>{course.instructor}</p> {/* Display instructor name */}
      <div className="course-actions">
        <button onClick={onEdit}>✏️</button>
        <button onClick={onDelete}>🗑️</button>
      </div>
    </div>
  );
};

export default CourseCard;