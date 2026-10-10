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
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '16px', backgroundColor: 'var(--surface-solid)', border: '1px solid var(--surface-border)', marginBottom: '24px', boxShadow: 'var(--shadow-sm)' }}>
                        <span style={{ fontSize: '24px' }}>🛍️</span>
                    </div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Welcome Back</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Sign in to your account</p>
                </div>

                {error && <div className="error-text">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="email"
                            required
                            className="input-field"
                            placeholder=" "
                            value={credentials.email}
                            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                        />
                        <label className="floating-label">Email Address</label>
                    </div>

                    <div className="form-group" style={{ marginBottom: '32px' }}>
                        <input
                            type="password"
                            required
                            className="input-field"
                            placeholder=" "
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                        />
                        <label className="floating-label">Password</label>
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '16px' }}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="auth-footer" style={{ marginTop: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Don't have an account? <Link to="/register" className="link-text">Create one</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
