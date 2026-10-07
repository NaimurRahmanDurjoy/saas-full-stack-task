import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const Cart = () => {
    const { storeSlug } = useParams();
    const navigate = useNavigate();
    const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();

    return (
        <div className="container" style={{ maxWidth: '900px' }}>
            <header className="dashboard-header" style={{ marginBottom: '40px', borderBottom: 'none', paddingBottom: 0 }}>
                <Link to={`/${storeSlug}`} className="link-text" style={{ fontSize: '1rem', textDecoration: 'none' }}>← Continue Shopping</Link>
            </header>

            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '32px' }}>Your Cart</h1>

            {cart.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '24px' }}>Your cart is currently empty.</p>
                    <Link to={`/${storeSlug}`} className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>Start Shopping</Link>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {cart.map(item => {
                        const attributes = item.variant.variant_attributes?.map(a => `${a.attribute_name}: ${a.attribute_value}`).join(', ');

                        return (
                            <div key={item.variant.id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px' }}>
                                <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                                    <div style={{ width: '100px', height: '100px', backgroundColor: 'var(--input-bg)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid var(--surface-border)' }}>
                                        {item.variant.image_url ? (
                                            <img src={item.variant.image_url} alt="Variant" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No Image</span>
                                        )}
                                    </div>
                                    <div>
                                        <h3 style={{ margin: '0 0 8px 0', fontSize: '1.3rem' }}>{item.product.name}</h3>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '4px' }}>SKU: {item.variant.sku}</div>
                                        {attributes && <div style={{ fontSize: '0.9rem', color: 'var(--accent)', fontWeight: '500' }}>{attributes}</div>}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                                    <div style={{ fontWeight: '700', fontSize: '1.2rem', color: 'var(--text-main)' }}>${item.variant.price}</div>
                                    
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <input
                                            className="input-field"
                                            type="number"
                                            min="1"
                                            placeholder=" "
                                            value={item.quantity}
                                            onChange={(e) => updateQuantity(item.variant.id, parseInt(e.target.value) || 1)}
                                            style={{ width: '80px', padding: '12px 16px', textAlign: 'center', fontWeight: '600' }}
                                        />
                                        <label className="floating-label" style={{ left: '50%', transform: 'translate(-50%, -50%)', width: 'max-content' }}>Qty</label>
                                    </div>

                                    <div style={{ fontWeight: '800', width: '100px', textAlign: 'right', fontSize: '1.3rem', color: 'var(--text-main)' }}>
                                        ${(item.variant.price * item.quantity).toFixed(2)}
                                    </div>
                                    
                                    <button
                                        onClick={() => removeFromCart(item.variant.id)}
                                        className="link-text"
                                        style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '1.8rem', padding: '0 10px', lineHeight: '1' }}
                                        title="Remove Item"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    <div className="card" style={{ marginTop: '24px', textAlign: 'right', padding: '32px', borderLeft: '4px solid var(--accent)' }}>
                        <div style={{ fontSize: '1.2rem', marginBottom: '12px', color: 'var(--text-muted)' }}>
                            Provisional Subtotal: <span style={{ fontWeight: '800', marginLeft: '16px', fontSize: '2.5rem', color: 'var(--text-main)' }}>${cartTotal.toFixed(2)}</span>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '32px' }}>
                            Prices are provisional and will be verified against live stock during checkout.
                        </p>
                        <button
                            onClick={() => navigate(`/${storeSlug}/checkout`)}
                            className="btn-primary"
                            style={{ display: 'inline-block', width: 'auto', padding: '16px 48px', fontSize: '1.2rem' }}
                        >
                            Proceed to Checkout →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
