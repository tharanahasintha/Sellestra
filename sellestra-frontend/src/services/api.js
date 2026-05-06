import axios from 'axios';
import { toast } from 'react-toastify';

// Function to attach JWT tokens to every request
const authInterceptor = (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// Global error handler for responses
const errorInterceptor = (error) => {
  // If 401 unauthorized, log the user out
  if (error.response && error.response.status === 401) {
    localStorage.removeItem('token');
    toast.error('Session expired. Please sign in again.');
    window.location.href = '/login';
  } else if (error.response?.data?.message) {
      toast.error(error.response.data.message);
  } else {
    toast.error('Something went wrong. Please try again.');
  }
  return Promise.reject(error);
};

const createApiClient = (baseURL) => {
  const client = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  client.interceptors.request.use(authInterceptor);
  client.interceptors.response.use(response => response, errorInterceptor);
  return client;
};

const PRODUCT_API = "http://localhost:8083";
const ORDER_API   = "http://localhost:8084";
const PAYMENT_API = "http://localhost:8085";

const api = {
  auth: createApiClient(''),
  user: createApiClient(''),
  product: createApiClient(PRODUCT_API),
  order: createApiClient(ORDER_API),
  payment: createApiClient(PAYMENT_API),
};

export default api;
