import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true // For Sanctum CSRF
});

// Configure interceptors to force CSRF inclusion on cross-origin requests
api.interceptors.request.use(config => {
    const match = document.cookie.match(new RegExp('(^| )XSRF-TOKEN=([^;]+)'));
    if (match) {
        // Laravel encrypts cookies, decodeURIComponent handles URL-encoding.
        config.headers['X-XSRF-TOKEN'] = decodeURIComponent(match[2]);
    }
    return config;
});

export default api;
