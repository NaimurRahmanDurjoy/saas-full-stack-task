import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const PackageSelection = () => {
    const { storeId } = useParams();
    const navigate = useNavigate();
    const [packages, setPackages] = useState([]);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [channels, setChannels] = useState([]);
    const [paymentForm, setPaymentForm] = useState({ channel: '', transactionId: '' });
    const [step, setStep] = useState(1); // 1 = Select Package, 2 = Submit Payment
    const [subscriptionId, setSubscriptionId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.get('/api/packages').then(res => setPackages(res.data)).catch(console.error);
        api.get('/api/storefront/global/payment-channels').then(res => {
            setChannels(res.data);
            if (res.data.length > 0) setPaymentForm(prev => ({ ...prev, channel: res.data[0].id }));
        }).catch(console.error);
    }, []);

    const handleCreateSubscription = async () => {
        if (!selectedPackage) return setError('Please select a package');
        setLoading(true);
        setError(null);
        try {
            const res = await api.post(`/api/stores/${storeId}/subscriptions`, { package_id: selectedPackage.id });
            setSubscriptionId(res.data.subscription.id);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Error creating subscription');
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await api.post(`/api/subscriptions/${subscriptionId}/payments`, {
                payment_channel_id: paymentForm.channel,
                amount: selectedPackage.price,
                transaction_id: paymentForm.transactionId
            });
            alert('Payment submitted! Awaiting Admin verification.');
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.errors?.transaction_id?.[0] || 'Error submitting payment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <h1>SaaS Subscription Setup</h1>
            {error && <div style={{ color: 'red', background: '#fee', padding: '1rem', marginBottom: '1rem' }}>{error}</div>}

            {step === 1 && (
                <div>
                    <h2>Select a Computing Package</h2>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        {packages.map(pkg => (
                            <div
                                key={pkg.id}
                                onClick={() => setSelectedPackage(pkg)}
                                style={{
                                    border: selectedPackage?.id === pkg.id ? '2px solid #000' : '1px solid #ddd',
                                    padding: '2rem',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    flex: 1,
                                    textAlign: 'center'
                                }}
                            >
                                <h3>{pkg.name}</h3>
                                <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>${pkg.price} / {pkg.billing_period}</p>
                                <p>{pkg.description}</p>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={handleCreateSubscription}
                        disabled={loading || !selectedPackage}
                        style={{ marginTop: '2rem', padding: '1rem 2rem', background: '#000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        {loading ? 'Creating...' : 'Continue to Payment'}
                    </button>
                </div>
            )}

            {step === 2 && (
                <div>
                    <h2>Submit Payment for {selectedPackage?.name}</h2>
                    <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Amount Due: <strong>${selectedPackage?.price}</strong></p>

                    <form onSubmit={handlePaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontWeight: 'bold' }}>Payment Method</label>
                            <select
                                value={paymentForm.channel}
                                onChange={e => setPaymentForm({ ...paymentForm, channel: e.target.value })}
                                style={{ width: '100%', padding: '0.5rem' }}
                                required
                            >
                                {channels.map(ch => <option key={ch.id} value={ch.id}>{ch.name}</option>)}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontWeight: 'bold' }}>Transaction ID / Code</label>
                            <input
                                required
                                value={paymentForm.transactionId}
                                onChange={e => setPaymentForm({ ...paymentForm, transactionId: e.target.value })}
                                style={{ width: '100%', padding: '0.5rem' }}
                            />
                        </div>

                        <button type="submit" disabled={loading} style={{ background: '#000', color: '#fff', padding: '1rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            {loading ? 'Submitting...' : 'Submit Sub Payment'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default PackageSelection;
