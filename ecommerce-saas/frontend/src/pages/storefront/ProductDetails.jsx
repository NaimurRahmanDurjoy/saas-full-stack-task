import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';

const ProductDetails = () => {
    const { storeSlug, productSlug } = useParams();
    const { addToCart, cart } = useCart();

    const [product, setProduct] = useState(null);
    const [error, setError] = useState('');
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isAdded, setIsAdded] = useState(false);

    useEffect(() => {
        api.get(`/api/storefront/${storeSlug}/products/${productSlug}`)
            .then(res => {
                setProduct(res.data);
                if (res.data.product_variants && res.data.product_variants.length > 0) {
                    setSelectedVariant(res.data.product_variants[0]);
                }
            })
            .catch(() => setError('Product not found or inactive.'));
    }, [storeSlug, productSlug]);

    const handleAddToCart = () => {
        if (!selectedVariant) return;
        addToCart(selectedVariant, product, quantity);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    if (error) return (
        <div className="container" style={{ textAlign: 'center', marginTop: '100px' }}>
            <h1 style={{ color: 'var(--danger)', fontSize: '3rem' }}>Oops!</h1>
            <p style={{ color: 'var(--text-muted)' }}>{error}</p>
            <Link to={`/${storeSlug}`} className="btn-outline" style={{ marginTop: '20px', display: 'inline-block', textDecoration: 'none' }}>Return to Shop</Link>
        </div>
    );
    if (!product) return <div className="container">Loading Product...</div>;

    const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div className="container" style={{ maxWidth: '1000px' }}>
            <header className="dashboard-header" style={{ marginBottom: '40px', borderBottom: 'none', paddingBottom: 0 }}>
                <Link to={`/${storeSlug}`} className="link-text" style={{ fontSize: '1rem', textDecoration: 'none' }}>← Back to Catalog</Link>
                <Link to={`/${storeSlug}/cart`} className="btn-outline" style={{ textDecoration: 'none', position: 'relative' }}>
                    Cart
                    {totalCartItems > 0 && (
                        <span style={{ position: 'absolute', top: '-8px', right: '-8px', backgroundColor: 'var(--danger)', color: '#fff', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                            {totalCartItems}
                        </span>
                    )}
                </Link>
            </header>

            <div style={{ display: 'flex', gap: '60px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <div style={{ flex: '1 1 400px', backgroundColor: 'var(--input-bg)', borderRadius: '24px', overflow: 'hidden', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--surface-border)' }}>
                    {selectedVariant?.image_url ? (
                        <img src={selectedVariant.image_url} alt={selectedVariant.sku} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>No Image Available</span>
                    )}
                </div>

                <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>
                        {product.category?.name || 'Uncategorized'}
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0 0 24px 0', lineHeight: '1.2' }}>{product.name}</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '32px' }}>
                        {product.description}
                    </p>

                    {product.product_variants?.length > 1 && (
                        <div style={{ marginBottom: '32px' }}>
                            <label style={{ display: 'block', fontWeight: '600', marginBottom: '12px', fontSize: '0.95rem' }}>Select Variant</label>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <select
                                    className="input-field"
                                    style={{ padding: '16px 20px', appearance: 'none', cursor: 'pointer', fontWeight: '500' }}
                                    value={selectedVariant?.id || ''}
                                    onChange={e => setSelectedVariant(product.product_variants.find(v => v.id == e.target.value))}
                                >
                                    {product.product_variants.map(v => {
                                        const attributes = v.variant_attributes.map(a => `${a.attribute_name}: ${a.attribute_value}`).join(', ');
                                        return (
                                            <option key={v.id} value={v.id}>
                                                {v.sku} {attributes ? `- ${attributes}` : ''}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>
                    )}

                    {selectedVariant && (
                        <div className="card" style={{ padding: '32px', backgroundColor: 'var(--surface)', border: '1px solid var(--surface-border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                                <div>
                                    <h2 style={{ fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', color: 'var(--text-main)' }}>
                                        ${selectedVariant.price}
                                    </h2>
                                    <span className="badge" style={{ backgroundColor: selectedVariant.stock > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(220, 38, 38, 0.1)', color: selectedVariant.stock > 0 ? 'var(--accent)' : 'var(--danger)' }}>
                                        {selectedVariant.stock > 0 ? `${selectedVariant.stock} in stock` : 'Out of stock'}
                                    </span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '16px', alignItems: 'stretch' }}>
                                <div className="form-group" style={{ marginBottom: 0, flex: '0 0 100px' }}>
                                    <input
                                        className="input-field"
                                        type="number"
                                        min="1"
                                        max={selectedVariant.stock}
                                        value={quantity}
                                        onChange={e => setQuantity(parseInt(e.target.value) || 1)}
                                        disabled={selectedVariant.stock <= 0}
                                        style={{ textAlign: 'center', padding: '16px', fontWeight: '600' }}
                                        placeholder=" "
                                    />
                                    <label className="floating-label" style={{ left: '50%', transform: 'translate(-50%, -50%)', width: 'max-content' }}>Qty</label>
                                </div>
                                
                                <button
                                    onClick={handleAddToCart}
                                    disabled={selectedVariant.stock <= 0}
                                    className="btn-primary"
                                    style={{ flex: 1, backgroundColor: isAdded ? 'var(--accent)' : (selectedVariant.stock <= 0 ? 'var(--surface-border)' : 'var(--primary)') }}
                                >
                                    {isAdded ? '✓ Added to Cart' : (selectedVariant.stock > 0 ? 'Add to Cart' : 'Out of Stock')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
