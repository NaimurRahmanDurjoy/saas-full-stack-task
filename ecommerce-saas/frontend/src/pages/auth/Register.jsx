import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [data, setData] = useState({ name: '', email: '', password: '', password_confirmation: '' });
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await register(data);
            navigate('/dashboard');
        } catch (err) {
            setError('Registration failed. Please check your inputs.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="glass-card">
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--surface-solid)', border: '1px solid var(--surface-border)', marginBottom: '12px', boxShadow: 'var(--shadow-sm)' }}>
                        <span style={{ fontSize: '20px' }}>🚀</span>
                    </div>
                    <h2 style={{ fontSize: '1.75rem', marginBottom: '4px' }}>Create Account</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Join us and start building</p>
                </div>

                {error && <div className="error-text">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            className="input-field"
                            type="text"
                            placeholder=" "
                            value={data.name}
                            onChange={(e) => setData({ ...data, name: e.target.value })}
                            required
                        />
                        <label className="floating-label">Full Name</label>
                    </div>
                    <div className="form-group">
                        <input
                            className="input-field"
                            type="email"
                            placeholder=" "
                            value={data.email}
                            onChange={(e) => setData({ ...data, email: e.target.value })}
                            required
                        />
                        <label className="floating-label">Email Address</label>
                    </div>
                    <div className="form-group">
                        <input
                            className="input-field"
                            type="password"
                            placeholder=" "
                            value={data.password}
                            onChange={(e) => setData({ ...data, password: e.target.value })}
                            required
                        />
                        <label className="floating-label">Password</label>
                    </div>
                    <div className="form-group" style={{ marginBottom: '24px' }}>
                        <input
                            className="input-field"
                            type="password"
                            placeholder=" "
                            value={data.password_confirmation}
                            onChange={(e) => setData({ ...data, password_confirmation: e.target.value })}
                            required
                        />
                        <label className="floating-label">Confirm Password</label>
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '14px 16px' }}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="auth-footer" style={{ marginTop: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Already have an account? <Link to="/login" className="link-text">Sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
