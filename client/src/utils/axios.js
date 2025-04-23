import axios from 'axios';
import { API_BASE_URL } from '../config';

const instance = axios.create({
    baseURL: 'http://localhost:4001/api',
    withCredentials: true
});

// Add request interceptor for debugging and token
instance.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        console.log('API Request:', {
            url: config.url,
            method: config.method,
            headers: config.headers,
            data: config.data
        });
        return config;
    },
    (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for debugging and token handling
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
        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
            const currentPath = window.location.pathname;
            // Only remove token and redirect if not already on login/register page
            if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default instance; 