import axios from 'axios';

// Create an axios instance with a default base URL
// If REACT_APP_API_URL is defined, use it. Otherwise, fall back to relative path (proxy)
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '',
});

export default api;
