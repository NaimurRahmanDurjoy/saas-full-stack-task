import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const Cart = () => {
    const { storeSlug } = useParams();
    const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <Link to={`/${storeSlug}`}>← Continue Shopping</Link>
            <h1 style={{ marginTop: '2rem' }}>Your Cart</h1>

            {cart.length === 0 ? (
                <p style={{ color: '#666', marginTop: '2rem' }}>Your cart is currently empty.</p>
            ) : (
                <div style={{ marginTop: '2rem' }}>
                    {cart.map(item => {
                        const attributes = item.variant.variant_attributes?.map(a => `${a.attribute_name}: ${a.attribute_value}`).join(', ');

                        return (
                            <div key={item.variant.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', borderBottom: '1px solid #eee' }}>
                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                    <div style={{ width: '80px', height: '80px', background: '#f5f5f5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {item.variant.image_url ? (
                                            <img src={item.variant.image_url} alt="Variant" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                                        ) : (
                                            <span style={{ fontSize: '0.7rem', color: '#aaa' }}>No Image</span>
                                        )}
                                    </div>
                                    <div>
                                        <h3 style={{ margin: '0 0 0.5rem 0' }}>{item.product.name}</h3>
                                        <div style={{ fontSize: '0.9rem', color: '#666' }}>SKU: {item.variant.sku}</div>
                                        {attributes && <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.2rem' }}>{attributes}</div>}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                    <div style={{ fontWeight: 'bold' }}>${item.variant.price}</div>
                                    <div>
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => updateQuantity(item.variant.id, parseInt(e.target.value) || 1)}
                                            style={{ width: '60px', padding: '0.5rem' }}
                                        />
                                    </div>
                                    <div style={{ fontWeight: 'bold', width: '80px', textAlign: 'right' }}>
                                        ${(item.variant.price * item.quantity).toFixed(2)}
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.variant.id)}
                                        style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', fontSize: '1.2rem' }}
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    <div style={{ marginTop: '3rem', padding: '2rem', background: '#f9f9f9', borderRadius: '8px', textAlign: 'right' }}>
                        <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                            Subtotal: <span style={{ fontWeight: 'bold', marginLeft: '1rem', fontSize: '1.5rem' }}>${cartTotal.toFixed(2)}</span>
                        </div>
                        <p style={{ color: '#777', fontSize: '0.9rem', marginBottom: '2rem' }}>
                            Prices are provisional and will be verified against live stock during checkout.
                        </p>
                        <button
                            disabled
                            style={{ padding: '1rem 3rem', background: '#ccc', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '1.1rem', cursor: 'not-allowed' }}
                            title="Checkout is implemented in Phase 7"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
