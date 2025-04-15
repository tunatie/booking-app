import axios from 'axios';

// Set default config
axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;

// Add request interceptor
axios.interceptors.request.use(
    (config) => {
        // Do something before request is sent
        return config;
    },
    (error) => {
        // Do something with request error
        return Promise.reject(error);
    }
);

// Add response interceptor
axios.interceptors.response.use(
    (response) => {
        // Any status code that lie within the range of 2xx cause this function to trigger
        return response;
    },
    (error) => {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

export default axios; 