import axios from 'axios';
import config from '../config/config';

// Create axios instance
const api = axios.create({
  baseURL: config.backendUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response Error:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request Error:', error.request);
      return Promise.reject({ message: 'No response from server' });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
      return Promise.reject({ message: error.message });
    }
  }
);

export const bankApi = {
  getFastestRoute: (data) => api.post('/api/banks/fastestroute', data),
  getCheapestRoute: (data) => api.post('/api/banks/cheapestroute', data),
  getAllBanks: () => api.get('/api/banks'),
};

export const authApi = {
  login: (data) => api.post('/api/users/login', data),
  register: (data) => api.post('/api/users/register', data),
};

export const transactionApi = {
  create: (data) => api.post('/api/transactions', data),
  getUserTransactions: (userId) => api.get(`/api/transactions/user/${userId}`),
};

export default api; 