import React, { useState, useEffect } from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';
import api from '../../services/api';

const OrderSuccess = () => {
    const { storeSlug, orderId } = useParams();
    const location = useLocation();

    // Graceful zero-trust fallback dynamically purely handling state gracefully!
    const order = location.state?.order;
    const guestToken = location.state?.guestToken;

    const [channels, setChannels] = useState([]);
    const [selectedChannel, setSelectedChannel] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [amount, setAmount] = useState(order?.total_amount || '');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        if (order) {
            api.get(`/api/storefront/${storeSlug}/payment-channels`)
                .then(res => {
                    setChannels(res.data);
                    if (res.data.length > 0) setSelectedChannel(res.data[0].id);
                })
                .catch(console.error);
        }
    }, [storeSlug, order]);

    if (!order || !guestToken) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
                <h1>Invalid Order Access</h1>
                <p>Please check your email for order tracking instructions.</p>
                <Link to={`/${storeSlug}`}>Return to Store</Link>
            </div>
        );
    }

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage('');

        try {
            const payload = {
                guest_token: guestToken,
                payment_channel_id: selectedChannel,
                amount: amount,
                transaction_id: transactionId
            };

            const res = await api.post(`/api/storefront/${storeSlug}/orders/${orderId}/payments`, payload);
            setMessage(res.data.message);
            setTransactionId('');
        } catch (err) {
            setError(err.response?.data?.errors?.transaction_id?.[0] || err.response?.data?.message || 'Payment submission failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ background: '#eefaee', padding: '2rem', borderRadius: '8px', marginBottom: '2rem', textAlign: 'center' }}>
                <h1 style={{ color: '#28a745', margin: '0 0 1rem 0' }}>Order #{order.id} Placed Successfully!</h1>
                <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Total Amount: <strong>${order.total_amount}</strong></p>
                <p>Thank you for your business. Please submit your manual payment using the methods below.</p>
            </div>

            {message ? (
                <div style={{ background: '#d4edda', color: '#155724', padding: '1rem', borderRadius: '4px', textAlign: 'center' }}>
                    <h3>{message}</h3>
                </div>
            ) : (
                <div style={{ border: '1px solid #ddd', padding: '2rem', borderRadius: '8px' }}>
                    <h2>Submit Manual Payment</h2>
                    {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

                    <form onSubmit={handlePaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontWeight: 'bold' }}>Payment Method</label>
                            <select
                                value={selectedChannel}
                                onChange={e => setSelectedChannel(e.target.value)}
                                style={{ width: '100%', padding: '0.5rem' }}
                                required
                            >
                                <option value="">Select a method...</option>
                                {channels.map(ch => (
                                    <option key={ch.id} value={ch.id}>{ch.name}</option>
                                ))}
                            </select>
                            {selectedChannel && (
                                <p style={{ fontSize: '0.9rem', color: '#666', background: '#f5f5f5', padding: '1rem', marginTop: '0.5rem', borderRadius: '4px' }}>
                                    {channels.find(c => c.id == selectedChannel)?.instructions || 'No instructions provided.'}
                                </p>
                            )}
                        </div>

                        <div>
                            <label style={{ display: 'block', fontWeight: 'bold' }}>Transaction ID / Reference Number *</label>
                            <input
                                type="text"
                                required
                                value={transactionId}
                                onChange={e => setTransactionId(e.target.value)}
                                style={{ width: '100%', padding: '0.5rem' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontWeight: 'bold' }}>Amount Paid *</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                style={{ width: '100%', padding: '0.5rem' }}
                                disabled
                            />
                        </div>

                        <button type="submit" disabled={loading} style={{ background: '#000', color: '#fff', padding: '1rem', border: 'none', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '1.1rem', marginTop: '1rem' }}>
                            {loading ? 'Submitting...' : 'Submit Payment Validation'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default OrderSuccess;
