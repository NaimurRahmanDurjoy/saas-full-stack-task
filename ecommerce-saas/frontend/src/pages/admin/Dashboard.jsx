import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [stores, setStores] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const res = await api.get('/api/stores');
                setStores(res.data);
            } catch (err) {
                if (err.response && err.response.status === 403) {
                    setError('You do not have permission to view stores.');
                }
            }
        };

        if (user && ['store_owner', 'management'].includes(user.role)) {
            fetchStores();
        }
    }, [user]);

    const handleCreateDemoStore = async () => {
        try {
            const res = await api.post('/api/stores', {
                name: 'Demo New Store',
                slug: 'demo-new-store-' + Date.now(),
                description: 'Just a store.',
            });
            setStores([...stores, res.data.store]);
        } catch (err) {
            console.error(err);
            alert('Failed to create store. You may lack permission.');
        }
    };

    return (
        <div className="container">
            <div className="dashboard-header">
                <div>
                    <h1>Welcome, {user?.name}</h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Manage your commerce empire.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span className="badge">{user?.role?.replace('_', ' ')}</span>
                    <button onClick={logout} className="btn-outline">Logout</button>
                </div>
            </div>

            {user?.role === 'management' && (
                <div className="card" style={{ marginBottom: '32px' }}>
                    <h3>Admin Panel</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Access global configurations and oversight.</p>
                    <button onClick={() => navigate('/admin')} className="btn-primary" style={{ width: 'auto' }}>Go to Admin Dashboard</button>
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2>Your Stores</h2>
                {user?.role === 'store_owner' && (
                    <button onClick={handleCreateDemoStore} className="btn-primary" style={{ width: 'auto', padding: '10px 20px', fontSize: '0.95rem' }}>+ Create Store</button>
                )}
            </div>

            {error ? (
                <div className="error-text">{error}</div>
            ) : (
                <div className="grid">
                    {stores.map((store) => (
                        <div key={store.id} className="card">
                            <h3 style={{ margin: '0 0 12px 0' }}>{store.name}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>/{store.slug}</p>
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                <Link to={`/admin/${store.id}/products`} className="btn-outline" style={{ textDecoration: 'none', textAlign: 'center', flex: 1 }}>Products</Link>
                                <Link to={`/admin/${store.id}/orders`} className="btn-outline" style={{ textDecoration: 'none', textAlign: 'center', flex: 1 }}>Orders</Link>
                            </div>
                        </div>
                    ))}
                    {stores.length === 0 && (
                        <p style={{ color: 'var(--text-muted)' }}>No stores found. Create one to get started.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
