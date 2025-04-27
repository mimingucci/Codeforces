// Base API URL
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

// WebSocket URL
export const WS_BASE_URL = process.env.REACT_APP_WS_BASE_URL || 
  (window.location.protocol === 'https:' ? 'wss:' : 'ws:') + 
  '//' + 
  (process.env.REACT_APP_WS_HOST || window.location.host);
