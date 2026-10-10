import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
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
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 402) {
            // Subscription expired or not active
            if (window.location.pathname.startsWith('/admin/')) {
                // To avoid multiple toasts if concurrent requests fail, we can just redirect
                window.location.href = '/admin?error=subscription_required';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
