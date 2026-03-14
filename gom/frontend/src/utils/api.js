const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  HEALTH: `${API_BASE_URL}/api/health`,
  SUBMIT_INQUIRY: `${API_BASE_URL}/api/inquiry`,
  GET_INQUIRIES: `${API_BASE_URL}/api/inquiries`,
  GET_PROJECTS: `${API_BASE_URL}/api/projects`,
};

export default API_BASE_URL;
