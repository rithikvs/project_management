import axios from 'axios';

// Detect if we are running locally or on a deployed server
const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// use the environment variable if set, otherwise fallback to localhost
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || (isLocal ? 'http://localhost:5000' : 'https://project-management-2-uqia.onrender.com');

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the JWT token automatically
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export default api;
export { API_BASE_URL };
