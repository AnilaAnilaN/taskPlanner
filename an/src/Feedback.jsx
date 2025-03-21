import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import axios from 'axios';
import './Feedback.css';


const Feedback = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  

  const [type, setType] = useState('Feature Request');
  const [message, setMessage] = useState('');
  const [alert, setAlert] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/feedback', {
        name,
        
        email,
        type,
        message,
      });
      if (response.status === 200) {
        setAlert('Feedback submitted successfully!');
        // Clear the form fields after submission
        setName('');
        setEmail('');
        setType('Feature Request');
        setMessage('');
        
      }
    } catch (error) {
      setAlert('Failed to submit feedback. Please try again.');
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <div className="feedback-page">
     <Header/>
      <div className="feedback-container">
        <Sidebar />
        <div className="feedback-form-container">
          <div className="feedback-form-wrapper">
            <h2>Feedback</h2>
            {alert && <div className={`alert ${alert.includes('successfully') ? 'success' : 'error'}`}>{alert}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="type">Type of Feedback</label>
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                >
                 
                  <option value="Feature Request">Feature Request</option>
                  <option value="Bug Report">Bug Report</option>
                  <option value="General Feedback">General Feedback</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="message">Detailed Feedback</label>
                <textarea
                  id="message"
                  placeholder="Enter your detailed feedback"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="5"
                  required
                />
              </div>
              <button type="submit" className="submit-button">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
