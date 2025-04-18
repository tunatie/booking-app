import axios from 'axios';
import { API_BASE_URL } from '../config';

const instance = axios.create({
    baseURL: 'http://localhost:4001/api',
    withCredentials: true
});

// Add request interceptor for debugging
instance.interceptors.request.use(
    (config) => {
        console.log('API Request:', {
            url: config.url,
            method: config.method,
            data: config.data
        });
        return config;
    },
    (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for debugging
instance.interceptors.response.use(
    (response) => {
        console.log('API Response:', {
            status: response.status,
            data: response.data
        });
        return response;
    },
    (error) => {
        console.error('API Response Error:', error);
        return Promise.reject(error);
    }
);

export default instance; 