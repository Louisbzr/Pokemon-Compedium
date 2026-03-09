export const API_BASE = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://pokemon-backend.railway.app' 
    : 'http://localhost:5000');
