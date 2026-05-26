import axios from 'axios';

// Create an axios instance with a default base URL
// If REACT_APP_API_URL is defined, use it. Otherwise, fall back to relative path (proxy)
const baseURL = process.env.REACT_APP_API_URL || '';

const api = axios.create({
  baseURL: baseURL,
});

// Export both the api instance and the base URL
export default api;
export { baseURL };
