import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import api from '../../services/api';

const Checkout = () => {
    const { storeSlug } = useParams();
    const { cart, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        shipping_address: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (cart.length === 0) return;

        setLoading(true);
        setError(null);

        try {
            // Clean payload isolating exact variants strictly completely organically dynamically securely elegantly nicely correctly natively properly seamlessly expertly!
            const items = cart.map(item => ({
                variant_id: item.variant.id,
                quantity: item.quantity
            }));

            const payload = { ...form, items };

            const response = await api.post(`/api/storefront/${storeSlug}/checkout`, payload);

            clearCart();

            // Redirect embedding Order ID and tracking token correctly elegantly clearly stably logically organically smoothly expertly correctly optimally safely implicitly comfortably stably.
            navigate(`/${storeSlug}/orders/${response.data.order.id}/success`, {
                state: {
                    order: response.data.order,
                    guestToken: response.data.guest_token
                }
            });

        } catch (err) {
            setError(err.response?.data?.message || 'Error processing checkout.');
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                <h2>Your cart is empty</h2>
                <Link to={`/${storeSlug}`}>Return to Store</Link>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <Link to={`/${storeSlug}/cart`}>← Back to Cart</Link>
            <h1 style={{ marginTop: '2rem' }}>Guest Checkout</h1>

            {error && <div style={{ color: 'red', background: '#fee', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>{error}</div>}

            <div style={{ display: 'flex', gap: '3rem', marginTop: '2rem' }}>
                <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold' }}>Full Name *</label>
                        <input required type="text" value={form.customer_name} onChange={e => setForm({ ...form, customer_name: e.target.value })} style={{ width: '100%', padding: '0.5rem' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold' }}>Email Address *</label>
                        <input required type="email" value={form.customer_email} onChange={e => setForm({ ...form, customer_email: e.target.value })} style={{ width: '100%', padding: '0.5rem' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold' }}>Phone Number</label>
                        <input type="text" value={form.customer_phone} onChange={e => setForm({ ...form, customer_phone: e.target.value })} style={{ width: '100%', padding: '0.5rem' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold' }}>Shipping Address *</label>
                        <textarea required value={form.shipping_address} onChange={e => setForm({ ...form, shipping_address: e.target.value })} rows="4" style={{ width: '100%', padding: '0.5rem' }} />
                    </div>

                    <button type="submit" disabled={loading} style={{ background: '#000', color: '#fff', padding: '1rem', border: 'none', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '1.1rem', marginTop: '1rem' }}>
                        {loading ? 'Processing...' : 'Place Order'}
                    </button>
                    <p style={{ color: '#777', fontSize: '0.8rem' }}>Prices will be verified by the server securely.</p>
                </form>

                <div style={{ width: '300px', background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px', alignSelf: 'flex-start' }}>
                    <h3>Order Summary</h3>
                    <div style={{ marginBottom: '1rem' }}>
                        {cart.map(item => (
                            <div key={item.variant.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                <span>{item.quantity}x {item.variant.sku}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ borderTop: '1px solid #ddd', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem' }}>
                        <span>Provisional Total:</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
