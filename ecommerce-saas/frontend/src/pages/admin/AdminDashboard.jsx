import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { logout } = useAuth();

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const res = await api.get('/api/admin/subscription-payments');
            setPayments(res.data);
        } catch (err) {
            setError('Unauthorized or Failed to fetch payments.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (paymentId, status) => {
        try {
            await api.post(`/api/admin/subscription-payments/${paymentId}/verify`, { status });
            fetchPayments();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '100px' }}><p>Loading Admin Portal...</p></div>;
    if (error) return <div className="container"><div className="error-text">{error}</div></div>;

    return (
        <div className="container">
            <header className="dashboard-header">
                <div>
                    <h1>System Dashboard</h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Global oversight and subscription management.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={logout} className="btn-outline">Logout</button>
                </div>
            </header>

            <div className="grid" style={{ marginBottom: '40px' }}>
                <Link to="/admin/stores" className="card" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '2rem', marginBottom: '16px' }}>🏪</span>
                    <h3>Tenant Stores</h3>
                    <p style={{ fontSize: '0.9rem', marginBottom: 0, marginTop: '8px' }}>Manage and block active tenant stores.</p>
                </Link>
                <Link to="/admin/packages" className="card" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '2rem', marginBottom: '16px' }}>📦</span>
                    <h3>SaaS Packages</h3>
                    <p style={{ fontSize: '0.9rem', marginBottom: 0, marginTop: '8px' }}>Configure subscription pricing and limits.</p>
                </Link>
                <Link to="/admin/payment-channels" className="card" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '2rem', marginBottom: '16px' }}>💳</span>
                    <h3>Payment Gateways</h3>
                    <p style={{ fontSize: '0.9rem', marginBottom: 0, marginTop: '8px' }}>Configure global payment channels.</p>
                </Link>
                <Link to="/admin/sales-reports" className="card" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '2rem', marginBottom: '16px' }}>📈</span>
                    <h3>Global Reports</h3>
                    <p style={{ fontSize: '0.9rem', marginBottom: 0, marginTop: '8px' }}>View platform-wide sales and metrics.</p>
                </Link>
            </div>

            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid var(--surface-border)' }}>
                    <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Pending Subscription Payments</h2>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                        <thead>
                            <tr style={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
                                <th style={{ padding: '16px 24px', fontWeight: '500', color: 'var(--text-muted)', borderBottom: '1px solid var(--surface-border)' }}>Store</th>
                                <th style={{ padding: '16px 24px', fontWeight: '500', color: 'var(--text-muted)', borderBottom: '1px solid var(--surface-border)' }}>Method</th>
                                <th style={{ padding: '16px 24px', fontWeight: '500', color: 'var(--text-muted)', borderBottom: '1px solid var(--surface-border)' }}>Amount</th>
                                <th style={{ padding: '16px 24px', fontWeight: '500', color: 'var(--text-muted)', borderBottom: '1px solid var(--surface-border)' }}>Transaction ID</th>
                                <th style={{ padding: '16px 24px', fontWeight: '500', color: 'var(--text-muted)', borderBottom: '1px solid var(--surface-border)' }}>Status</th>
                                <th style={{ padding: '16px 24px', fontWeight: '500', color: 'var(--text-muted)', borderBottom: '1px solid var(--surface-border)' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map(payment => (
                                <tr key={payment.id} style={{ borderBottom: '1px solid var(--surface-border)' }}>
                                    <td style={{ padding: '16px 24px', fontWeight: '500' }}>{payment.subscription?.store?.name}</td>
                                    <td style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>{payment.payment_channel?.name}</td>
                                    <td style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--text-main)' }}>${payment.amount}</td>
                                    <td style={{ padding: '16px 24px', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{payment.transaction_id}</td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <span className="badge" style={{ 
                                            backgroundColor: payment.status === 'verified' ? 'rgba(16,185,129,0.1)' : payment.status === 'rejected' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)', 
                                            color: payment.status === 'verified' ? '#10b981' : payment.status === 'rejected' ? '#ef4444' : '#f59e0b',
                                            borderColor: 'transparent'
                                        }}>
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        {payment.status === 'pending' && (
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button onClick={() => handleVerify(payment.id, 'verified')} className="btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem', borderColor: 'rgba(16,185,129,0.3)', color: '#10b981' }}>Verify</button>
                                                <button onClick={() => handleVerify(payment.id, 'rejected')} className="btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem', borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}>Reject</button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {payments.length === 0 && <tr><td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No pending payments to verify.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
