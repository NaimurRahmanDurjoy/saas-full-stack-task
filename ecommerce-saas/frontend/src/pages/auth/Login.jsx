import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await login(credentials);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid login credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="glass-card">
                <h1>Welcome Back</h1>
                <p className="subtitle">Sign in to your account</p>
                
                {error && <div className="error-text">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            className="input-field"
                            type="email"
                            placeholder=" "
                            value={credentials.email}
                            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                            required
                        />
                        <label className="floating-label">Email Address</label>
                    </div>
                    <div className="form-group">
                        <input
                            className="input-field"
                            type="password"
                            placeholder=" "
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            required
                        />
                        <label className="floating-label">Password</label>
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
                
                <div className="auth-footer">
                    Don't have an account? <Link to="/register" className="link-text">Create one</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
