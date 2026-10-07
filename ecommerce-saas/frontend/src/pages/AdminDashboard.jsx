import React, { useEffect, useState } from 'react';
import api from '../services/api';

const AdminDashboard = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (loading) return <div style={{ padding: '2rem' }}>Loading Admin Panel...</div>;
    if (error) return <div style={{ padding: '2rem', color: 'red' }}>{error} - Are you sure you're an Admin?</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>Admin: Pending SaaS Subscriptions</h1>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                <thead>
                    <tr style={{ background: '#eee' }}>
                        <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ccc' }}>Store</th>
                        <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ccc' }}>Method</th>
                        <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ccc' }}>Amount</th>
                        <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ccc' }}>Transaction ID</th>
                        <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ccc' }}>Status</th>
                        <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ccc' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map(payment => (
                        <tr key={payment.id}>
                            <td style={{ padding: '10px', border: '1px solid #ccc' }}>{payment.subscription?.store?.name}</td>
                            <td style={{ padding: '10px', border: '1px solid #ccc' }}>{payment.payment_channel?.name}</td>
                            <td style={{ padding: '10px', border: '1px solid #ccc' }}>${payment.amount}</td>
                            <td style={{ padding: '10px', border: '1px solid #ccc' }}>{payment.transaction_id}</td>
                            <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                                <span style={{ background: payment.status === 'verified' ? '#d4edda' : payment.status === 'rejected' ? '#f8d7da' : '#fff3cd', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                                    {payment.status}
                                </span>
                            </td>
                            <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                                {payment.status === 'pending' && (
                                    <>
                                        <button onClick={() => handleVerify(payment.id, 'verified')} style={{ background: '#28a745', color: 'white', border: 'none', padding: '0.5rem', marginRight: '0.5rem', cursor: 'pointer', borderRadius: '4px' }}>Verify</button>
                                        <button onClick={() => handleVerify(payment.id, 'rejected')} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '0.5rem', cursor: 'pointer', borderRadius: '4px' }}>Reject</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                    {payments.length === 0 && <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', border: '1px solid #ccc' }}>No pending payments to verify.</td></tr>}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;
