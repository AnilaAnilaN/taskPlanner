import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../Header';
import Sidebar from '../Sidebar';

const ViewBook = ({ courses }) => {
  const { courseId } = useParams();
  const course = courses.find(c => c._id === courseId);

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div>
      <Header />
      <Sidebar />
      <div className="content">
        <h2>{course.name}</h2>
        <p>Instructor: {course.instructor}</p>
        <iframe src={`http://localhost:5000/${course.file}`} width="100%" height="600px"></iframe>
      </div>
    </div>
  );
};

export default ViewBook;
