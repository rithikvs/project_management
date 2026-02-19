import axios from 'axios';

// Detect the current hostname
const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const protocol = typeof window !== 'undefined' ? window.location.protocol : 'http:';

// If we are on localhost/IP, point to the same host on port 5003
const isDevelopment = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.') || hostname.startsWith('10.') || hostname.startsWith('172.');

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || (isDevelopment ? `${protocol}//${hostname}:5005` : 'https://project-management-2-uqia.onrender.com');

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
