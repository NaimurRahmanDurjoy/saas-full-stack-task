import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [stores, setStores] = useState([]);
    const [error, setError] = useState(null);

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
        <div style={{ padding: '2rem' }}>
            <h2>Dashboard</h2>
            <p>Welcome back, <strong>{user?.name}</strong>! (Role: {user?.role})</p>
            <button onClick={logout} style={{ marginBottom: '2rem' }}>Logout</button>

            <hr />

            <h3>Your Stores (Isolated Authorization Test)</h3>
            {error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <ul>
                    {stores.map((store) => (
                        <li key={store.id}>{store.name} ({store.slug})</li>
                    ))}
                </ul>
            )}

            {user?.role === 'store_owner' && (
                <button onClick={handleCreateDemoStore}>Create Demo Store</button>
            )}
        </div>
    );
};

export default Dashboard;
