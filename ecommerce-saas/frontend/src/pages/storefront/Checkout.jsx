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
            const items = cart.map(item => ({
                variant_id: item.variant.id,
                quantity: item.quantity
            }));

            const payload = { ...form, items };
            const response = await api.post(`/api/storefront/${storeSlug}/checkout`, payload);

            clearCart();
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
            <div className="container" style={{ textAlign: 'center', marginTop: '60px' }}>
                <div className="card" style={{ padding: '60px' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '24px' }}>Your cart is empty</h2>
                    <Link to={`/${storeSlug}`} className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>Return to Store</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ maxWidth: '1100px' }}>
            <header className="dashboard-header" style={{ marginBottom: '40px', borderBottom: 'none', paddingBottom: 0 }}>
                <Link to={`/${storeSlug}/cart`} className="link-text" style={{ fontSize: '1rem', textDecoration: 'none' }}>← Back to Cart</Link>
            </header>

            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '40px' }}>Secure Checkout</h1>

            {error && <div className="error-text">{error}</div>}

            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <form onSubmit={handleSubmit} className="card" style={{ flex: '1 1 500px', padding: '40px' }}>
                    <h2 style={{ margin: '0 0 32px 0', fontSize: '1.5rem', borderBottom: '1px solid var(--surface-border)', paddingBottom: '16px' }}>Shipping Information</h2>
                    
                    <div className="form-group">
                        <input 
                            required 
                            className="input-field"
                            placeholder=" "
                            value={form.customer_name} 
                            onChange={e => setForm({ ...form, customer_name: e.target.value })} 
                        />
                        <label className="floating-label">Full Name *</label>
                    </div>

                    <div className="form-group">
                        <input 
                            required 
                            type="email"
                            className="input-field"
                            placeholder=" "
                            value={form.customer_email} 
                            onChange={e => setForm({ ...form, customer_email: e.target.value })} 
                        />
                        <label className="floating-label">Email Address *</label>
                    </div>

                    <div className="form-group">
                        <input 
                            className="input-field"
                            type="tel"
                            placeholder=" "
                            value={form.customer_phone} 
                            onChange={e => setForm({ ...form, customer_phone: e.target.value })} 
                        />
                        <label className="floating-label">Phone Number (Optional)</label>
                    </div>

                    <div className="form-group" style={{ marginBottom: '32px' }}>
                        <textarea 
                            required 
                            className="input-field"
                            placeholder=" "
                            value={form.shipping_address} 
                            onChange={e => setForm({ ...form, shipping_address: e.target.value })} 
                            rows="4" 
                            style={{ resize: 'vertical' }}
                        />
                        <label className="floating-label">Shipping Address *</label>
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '18px', fontSize: '1.2rem', width: '100%' }}>
                        {loading ? 'Processing Order...' : 'Place Order Now'}
                    </button>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '16px', textAlign: 'center' }}>
                        🔒 256-bit encrypted secure transaction. Prices will be verified live.
                    </p>
                </form>

                <div className="card" style={{ flex: '0 1 400px', padding: '32px', position: 'sticky', top: '24px', backgroundColor: 'var(--bg-main)' }}>
                    <h3 style={{ margin: '0 0 24px 0', fontSize: '1.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order Summary</h3>
                    
                    <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {cart.map(item => (
                            <div key={item.variant.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--input-bg)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                        {item.variant.image_url ? (
                                            <img src={item.variant.image_url} alt="Variant" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Img</span>
                                        )}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '0.95rem' }}>{item.product.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Qty: {item.quantity} × ${item.variant.price}</div>
                                    </div>
                                </div>
                                <div style={{ fontWeight: '700' }}>
                                    ${(item.variant.price * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div style={{ borderTop: '2px solid var(--surface-border)', paddingTop: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '12px', fontSize: '0.95rem' }}>
                            <span>Subtotal</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.95rem' }}>
                            <span>Shipping</span>
                            <span>Calculated at next step</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '1.5rem', color: 'var(--text-main)' }}>
                            <span>Total</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
