import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const shopApi = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

shopApi.interceptors.request.use((config) => {
  const studentToken = localStorage.getItem('studentToken');
  if (studentToken) {
    config.headers.Authorization = `Bearer ${studentToken}`;
  }
  return config;
});

shopApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('studentToken');
      localStorage.removeItem('studentInfo');
      window.location.href = '/shop/login';
    }
    return Promise.reject(error);
  }
);

export default shopApi;
