import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const PaymentChannels = () => {
    const [channels, setChannels] = useState([]);
    const [name, setName] = useState('');
    const [type, setType] = useState('bank_transfer'); // 'bank_transfer' or 'mobile_banking'
    const [details, setDetails] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchChannels();
    }, []);

    const fetchChannels = async () => {
        try {
            const res = await api.get('/api/admin/payment-channels');
            setChannels(res.data);
        } catch (error) {
            console.error("Failed to fetch payment channels");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/admin/payment-channels', { name, type, details, status: 'active' });
            setName('');
            setDetails('');
            fetchChannels();
        } catch (error) {
            alert('Failed to create payment channel');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this payment channel?')) return;
        try {
            await api.delete(`/api/admin/payment-channels/${id}`);
            fetchChannels();
        } catch (error) {
            alert('Failed to delete payment channel');
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        try {
            await api.patch(`/api/admin/payment-channels/${id}/status`, { status: newStatus });
            fetchChannels();
        } catch (error) {
            alert('Failed to update status');
        }
    };

    if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '100px' }}>Loading...</div>;

    return (
        <div className="container">
            <header className="dashboard-header">
                <div>
                    <Link to="/admin" className="link-text" style={{ fontSize: '0.9rem', marginBottom: '8px', display: 'inline-block' }}>← Back to Dashboard</Link>
                    <h1>Payment Gateways</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Configure platform-wide payment acceptance methods.</p>
                </div>
            </header>

            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <form onSubmit={handleCreate} className="card" style={{ flex: '1 1 350px', padding: '32px' }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '24px' }}>Add New Gateway</h2>
                    
                    <div className="form-group">
                        <input required className="input-field" placeholder=" " value={name} onChange={e => setName(e.target.value)} />
                        <label className="floating-label">Gateway Name (e.g. Bkash, City Bank)</label>
                    </div>

                    <div className="form-group">
                        <select className="input-field" value={type} onChange={e => setType(e.target.value)} style={{ padding: '16px', appearance: 'none' }}>
                            <option value="bank_transfer">Bank Transfer</option>
                            <option value="mobile_banking">Mobile Banking</option>
                        </select>
                        <label className="floating-label" style={{ top: 0, fontSize: '0.75rem', backgroundColor: 'var(--surface-solid)' }}>Method Type</label>
                    </div>

                    <div className="form-group" style={{ marginBottom: '32px' }}>
                        <textarea required className="input-field" placeholder=" " value={details} onChange={e => setDetails(e.target.value)} rows="3" />
                        <label className="floating-label">Account Details / Instructions</label>
                    </div>

                    <button type="submit" className="btn-primary">Save Gateway</button>
                </form>

                <div className="card" style={{ flex: '2 1 500px', padding: '0', overflow: 'hidden' }}>
                    <div style={{ padding: '24px', borderBottom: '1px solid var(--surface-border)' }}>
                        <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Active Gateways</h2>
                    </div>
                    {channels.map(channel => (
                        <div key={channel.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: '1px solid var(--surface-border)' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{channel.name}</h3>
                                    <span className="badge" style={{ backgroundColor: channel.status === 'active' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: channel.status === 'active' ? '#10b981' : '#ef4444' }}>
                                        {channel.status}
                                    </span>
                                </div>
                                <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{channel.type.replace('_', ' ')}</p>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-main)', whiteSpace: 'pre-line' }}>{channel.details}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => toggleStatus(channel.id, channel.status)} className="btn-outline" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                                    {channel.status === 'active' ? 'Disable' : 'Enable'}
                                </button>
                                <button onClick={() => handleDelete(channel.id)} className="btn-outline" style={{ fontSize: '0.8rem', padding: '6px 12px', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                    {channels.length === 0 && <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No payment channels configured.</div>}
                </div>
            </div>
        </div>
    );
};

export default PaymentChannels;
