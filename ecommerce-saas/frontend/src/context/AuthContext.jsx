import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            // Laravel Sanctum CSRF setup
            await api.get('/sanctum/csrf-cookie');
            const response = await api.get('/api/user');
            setUser(response.data);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const login = async (credentials) => {
        await api.get('/sanctum/csrf-cookie');
        await api.post('/api/login', credentials);
        await fetchUser();
    };

    const adminLogin = async (credentials) => {
        await api.get('/sanctum/csrf-cookie');
        await api.post('/api/admin/login', credentials);
        await fetchUser();
    };

    const register = async (data) => {
        await api.get('/sanctum/csrf-cookie');
        await api.post('/api/register', data);
        await fetchUser();
    };

    const logout = async () => {
        await api.post('/api/logout');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, adminLogin, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
