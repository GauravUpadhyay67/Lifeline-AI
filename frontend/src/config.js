// Central configuration for API and ML Service URLs
// Use environment variables or fallback to localhost for development

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const ML_URL = import.meta.env.VITE_ML_URL || 'http://localhost:8000';

// Socket URL usually matches the API_URL (Backend)
export const SOCKET_URL = API_URL;

// Base path for uploaded images
export const UPLOADS_URL = API_URL;
