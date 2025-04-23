import axios from 'axios';
import { API_BASE_URL } from '../config';

const instance = axios.create({
    baseURL: 'http://localhost:4001/api',
    withCredentials: true
});

<<<<<<< HEAD
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
=======
// Add request interceptor for debugging
instance.interceptors.request.use(
    (config) => {
        console.log('API Request:', {
            url: config.url,
            method: config.method,
>>>>>>> 12d658f551c09d2071399818f257e90056fa6fbd
            data: config.data
        });
        return config;
    },
    (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
    }
);

<<<<<<< HEAD
// Add response interceptor for debugging and token handling
=======
// Add response interceptor for debugging
>>>>>>> 12d658f551c09d2071399818f257e90056fa6fbd
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
<<<<<<< HEAD
        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
            const currentPath = window.location.pathname;
            // Only remove token and redirect if not already on login/register page
            if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }
=======
>>>>>>> 12d658f551c09d2071399818f257e90056fa6fbd
        return Promise.reject(error);
    }
);

export default instance; 