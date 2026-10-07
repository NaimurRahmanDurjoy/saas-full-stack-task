import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';

const ProductDetails = () => {
    const { storeSlug, productSlug } = useParams();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [error, setError] = useState('');
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);

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
        alert('Added to cart!');
    };

    if (error) return <div style={{ padding: '2rem', color: 'red' }}><h1>{error}</h1></div>;
    if (!product) return <div style={{ padding: '2rem' }}>Loading Product...</div>;

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <Link to={`/${storeSlug}`}>← Back to {storeSlug} Catalog</Link>

            <div style={{ display: 'flex', gap: '3rem', marginTop: '2rem' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ width: '100%', height: '300px', background: '#eee', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {selectedVariant?.image_url ? (
                            <img src={selectedVariant.image_url} alt={selectedVariant.sku} style={{ maxWidth: '100%', maxHeight: '100%' }} />
                        ) : (
                            <span style={{ color: '#aaa' }}>No Image</span>
                        )}
                    </div>
                </div>

                <div style={{ flex: 1 }}>
                    <div style={{ color: '#888', marginBottom: '0.5rem' }}>{product.category?.name}</div>
                    <h1 style={{ margin: '0 0 1rem 0' }}>{product.name}</h1>
                    <p style={{ color: '#555', marginBottom: '2rem', lineHeight: '1.6' }}>{product.description}</p>

                    {product.product_variants?.length > 1 && (
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Select Variant:</label>
                            <select
                                style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
                                value={selectedVariant?.id || ''}
                                onChange={e => setSelectedVariant(product.product_variants.find(v => v.id == e.target.value))}
                            >
                                {product.product_variants.map(v => {
                                    const attributes = v.variant_attributes.map(a => `${a.attribute_name}: ${a.attribute_value}`).join(', ');
                                    return (
                                        <option key={v.id} value={v.id}>
                                            {v.sku} {attributes ? `- ${attributes}` : ''} (${v.price})
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    )}

                    {selectedVariant && (
                        <div style={{ padding: '1.5rem', background: '#f9f9f9', borderRadius: '8px' }}>
                            <h2 style={{ margin: '0 0 1rem 0' }}>${selectedVariant.price}</h2>
                            <p style={{ color: selectedVariant.stock > 0 ? 'green' : 'red', margin: '0 0 1rem 0' }}>
                                {selectedVariant.stock > 0 ? `${selectedVariant.stock} in stock` : 'Out of stock'}
                            </p>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <input
                                    type="number"
                                    min="1"
                                    max={selectedVariant.stock}
                                    value={quantity}
                                    onChange={e => setQuantity(parseInt(e.target.value) || 1)}
                                    style={{ width: '60px', padding: '0.5rem' }}
                                    disabled={selectedVariant.stock <= 0}
                                />
                                <button
                                    onClick={handleAddToCart}
                                    disabled={selectedVariant.stock <= 0}
                                    style={{ flex: 1, padding: '0.5rem', background: selectedVariant.stock > 0 ? '#000' : '#ccc', color: '#fff', border: 'none', borderRadius: '4px', cursor: selectedVariant.stock > 0 ? 'pointer' : 'not-allowed' }}
                                >
                                    Add to Cart
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
