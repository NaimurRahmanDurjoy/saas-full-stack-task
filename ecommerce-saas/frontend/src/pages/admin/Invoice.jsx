import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';
import './Invoice.css';

export default function Invoice() {
    const { storeId, orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await api.get(`/api/stores/${storeId}/orders/${orderId}`);
                setOrder(res.data);
            } catch (err) {
                setError('Failed to fetch invoice. Ensure you have the right permissions.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [storeId, orderId]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Generating Invoice...</div>;
    if (error) return <div style={{ padding: '40px', color: 'red' }}>{error}</div>;
    if (!order) return <div style={{ padding: '40px' }}>Order not found.</div>;

    const subtotal = order.order_items?.reduce((acc, item) => acc + (parseFloat(item.unit_price) * item.quantity), 0) || 0;

    return (
        <div className="invoice-layout">
            <div className="no-print" style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <button className="btn btn-secondary" onClick={() => navigate(-1)}>← Back</button>
                <button className="btn btn-primary" onClick={handlePrint}>Print Invoice</button>
            </div>

            <div className="invoice-paper content-inner">
                <div className="invoice-header">
                    <div>
                        <h1 style={{ margin: 0, fontSize: '2rem', color: '#0f172a' }}>INVOICE</h1>
                        <p style={{ color: '#64748b', margin: '4px 0 0' }}>Order #{order.id.toString().padStart(5, '0')}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#334155' }}>Tenant Store</h2>
                        {/* We don't have store details in ownerShow, it only returns order. But we can omit or rely on what's available */}
                        <p style={{ margin: 0, color: '#64748b' }}>Store ID: {order.store_id}</p>
                    </div>
                </div>

                <div className="invoice-meta" style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #e2e8f0', borderBottom: '2px solid #e2e8f0', padding: '24px 0', margin: '24px 0' }}>
                    <div>
                        <h3 style={{ fontSize: '0.875rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>Bill To</h3>
                        <p style={{ margin: 0, fontWeight: 500 }}>{order.customer_name}</p>
                        <p style={{ margin: 0, color: '#475569' }}>{order.customer_email}</p>
                        <p style={{ margin: 0, color: '#475569' }}>{order.customer_phone}</p>
                        <p style={{ margin: 0, color: '#475569', marginTop: '4px' }}>{order.shipping_address}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <h3 style={{ fontSize: '0.875rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>Order Details</h3>
                        <p style={{ margin: '0 0 4px' }}><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
                        <p style={{ margin: '0 0 4px' }}>
                            <strong>Status:</strong> <span style={{ textTransform: 'uppercase' }}>{order.status}</span>
                        </p>
                    </div>
                </div>

                <table className="data-table" style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <th>Item Description</th>
                            <th style={{ textAlign: 'center' }}>Qty</th>
                            <th style={{ textAlign: 'right' }}>Unit Price</th>
                            <th style={{ textAlign: 'right' }}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.order_items?.map(item => (
                            <tr key={item.id}>
                                <td>
                                    <strong>{item.product_variant?.product?.name}</strong><br />
                                    <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                                        SKU: {item.product_variant?.sku}
                                    </span>
                                </td>
                                <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                                <td style={{ textAlign: 'right' }}>৳{item.unit_price}</td>
                                <td style={{ textAlign: 'right' }}>৳{(parseFloat(item.unit_price) * item.quantity).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="invoice-total" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                    <div style={{ width: '300px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>
                            <span style={{ color: '#64748b' }}>Subtotal</span>
                            <span style={{ fontWeight: 500 }}>৳{subtotal.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: '2px solid #0f172a', fontSize: '1.25rem', fontWeight: 700 }}>
                            <span>Total</span>
                            <span>৳{parseFloat(order.total_amount).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
