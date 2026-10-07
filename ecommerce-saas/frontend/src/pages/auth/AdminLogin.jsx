import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { adminLogin } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await adminLogin({ email, password });
            navigate('/admin');
        } catch (err) {
            setError('Invalid admin credentials. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="glass-card">
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '16px', backgroundColor: 'var(--surface-solid)', border: '1px solid var(--surface-border)', marginBottom: '24px', boxShadow: 'var(--shadow-sm)' }}>
                        <span style={{ fontSize: '24px' }}>🛡️</span>
                    </div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Admin Portal</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Secure access for system administrators</p>
                </div>

                {error && <div className="error-text">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="email"
                            required
                            className="input-field"
                            placeholder=" "
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label className="floating-label">Admin Email</label>
                    </div>

                    <div className="form-group" style={{ marginBottom: '32px' }}>
                        <input
                            type="password"
                            required
                            className="input-field"
                            placeholder=" "
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <label className="floating-label">Password</label>
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '16px' }}>
                        {loading ? 'Authenticating...' : 'Secure Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
