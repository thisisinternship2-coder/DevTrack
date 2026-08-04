// Placeholder for API service
// Will be implemented in Phase 2

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const api = {
  get: async (endpoint) => {
    // Placeholder
    console.log(`GET ${endpoint}`);
    return { data: [] };
  },
  post: async (endpoint, data) => {
    // Placeholder
    console.log(`POST ${endpoint}`, data);
    return { data: {} };
  },
  put: async (endpoint, data) => {
    // Placeholder
    console.log(`PUT ${endpoint}`, data);
    return { data: {} };
  },
  delete: async (endpoint) => {
    // Placeholder
    console.log(`DELETE ${endpoint}`);
    return { data: {} };
  }
};