import { useState, useEffect } from 'react';
import api from '../../services/api';
import ManagementLayout from '../../components/management/ManagementLayout';

export default function AdminStores() {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchStores();
    }, []);

    const fetchStores = async () => {
        try {
            const res = await api.get('/admin/stores');
            setStores(res.data);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load stores');
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (store) => {
        try {
            await api.patch(`/admin/stores/${store.id}/status`, {
                status: store.status === 'active' ? 'inactive' : 'active'
            });
            fetchStores();
        } catch (err) {
            alert(err.response?.data?.message || 'Update failed');
        }
    };

    return (
        <ManagementLayout
            title="Registered Stores"
            description="Manage all active and inactive multi-tenant stores."
        >
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {loading ? <p>Loading stores...</p> : (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Owner</th>
                            <th>Slug</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stores.map(store => (
                            <tr key={store.id}>
                                <td>{store.id}</td>
                                <td>{store.name}</td>
                                <td>{store.user?.name || `User #${store.user_id}`}</td>
                                <td>{store.slug}</td>
                                <td>
                                    <span className={`badge badge-${store.status}`}>
                                        {store.status}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-secondary" style={{ padding: '4px 8px' }}
                                        onClick={() => toggleStatus(store)}
                                    >
                                        {store.status === 'active' ? 'Deactivate' : 'Activate'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {stores.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                                    No stores registered yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </ManagementLayout>
    );
}
