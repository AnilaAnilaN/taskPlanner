const API_URL = process.env.NODE_ENV === 'production' 
  ? '' // Relative URLs for production
  : 'http://localhost:5000';

export default API_URL;
