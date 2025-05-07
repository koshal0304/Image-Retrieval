// Configuration for different environments
const dev = {
  apiUrl: 'http://localhost:5000/api'
};

const prod = {
  apiUrl: '/api'
};

// Determine which environment to use
const config = process.env.NODE_ENV === 'production' ? prod : dev;

export default config; 