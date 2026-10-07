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
                <h1>Create Account</h1>
                <p className="subtitle">Join us and start building</p>
                
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
                    <div className="form-group">
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
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account? <Link to="/login" className="link-text">Sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
