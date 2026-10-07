import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import ManagementLayout from '../../components/management/ManagementLayout';

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/admin/orders');
                setOrders(res.data);
            } catch (err) {
                setError('Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    return (
        <ManagementLayout
            title="Global Orders"
            description="View all orders across all registered SaaS tenant stores."
        >
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {loading ? <p>Loading orders...</p> : (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Store</th>
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
                                <td>{order.store?.name}</td>
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
                                <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                                    No orders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </ManagementLayout>
    );
}
