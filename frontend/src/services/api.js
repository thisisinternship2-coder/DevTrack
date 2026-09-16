const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const request = async (endpoint, options = {}) => {
  const token = getToken();

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status})`);
  }

  return data;
};

export const api = {
  get: (endpoint) => request(endpoint),
  post: (endpoint, body) => request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),

  // Auth helpers
  saveToken: (token) => localStorage.setItem('token', token),
  getToken,
  clearToken: () => localStorage.removeItem('token'),
  isLoggedIn: () => !!localStorage.getItem('token'),
};