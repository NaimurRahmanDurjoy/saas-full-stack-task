import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import ManagementLayout from '../components/management/ManagementLayout';

export default function OwnerOrders() {
    const { storeId } = useParams();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get(`/stores/${storeId}/orders`);
                setOrders(res.data);
            } catch (err) {
                setError('Failed to fetch store orders');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [storeId]);

    return (
        <ManagementLayout
            title="Store Orders"
            description="Manage your storefront's orders."
        >
            <div style={{ marginBottom: '20px' }}>
                <Link to="/stores" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 500 }}>
                    ← Back to My Stores
                </Link>
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {loading ? <p>Loading orders...</p> : (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>#{order.id.toString().padStart(5, '0')}</td>
                                <td>{order.customer_name}</td>
                                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                <td>${order.total_amount}</td>
                                <td>
                                    <span className={`badge badge-${order.status === 'completed' ? 'active' : 'pending'}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td>
                                    <Link to={`/invoices/${order.id}`} className="btn btn-secondary" style={{ padding: '4px 8px', textDecoration: 'none' }}>
                                        View Details
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                                    No orders found for this store.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </ManagementLayout>
    );
}
