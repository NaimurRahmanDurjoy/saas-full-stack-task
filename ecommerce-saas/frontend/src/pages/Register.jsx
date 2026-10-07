import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [data, setData] = useState({ name: '', email: '', password: '', password_confirmation: '' });
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(data);
            navigate('/dashboard');
        } catch (err) {
            setError('Registration failed. Please check your inputs.');
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Register</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
                <input
                    type="text"
                    placeholder="Name"
                    value={data.name}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    required
                    style={{ marginBottom: '1rem' }}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={data.email}
                    onChange={(e) => setData({ ...data, email: e.target.value })}
                    required
                    style={{ marginBottom: '1rem' }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={data.password}
                    onChange={(e) => setData({ ...data, password: e.target.value })}
                    required
                    style={{ marginBottom: '1rem' }}
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={data.password_confirmation}
                    onChange={(e) => setData({ ...data, password_confirmation: e.target.value })}
                    required
                    style={{ marginBottom: '1rem' }}
                />
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
