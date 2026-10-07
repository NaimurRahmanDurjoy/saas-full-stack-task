import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';

const StorefrontHome = () => {
    const { storeSlug } = useParams();
    const { cart } = useCart();
    const [store, setStore] = useState(null);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        api.get(`/api/storefront/${storeSlug}`)
            .then(res => setStore(res.data))
            .catch(() => setError('Store not found.'));

        api.get(`/api/storefront/${storeSlug}/categories`)
            .then(res => setCategories(res.data))
            .catch(console.error);
    }, [storeSlug]);

    useEffect(() => {
        const url = selectedCategory
            ? `/api/storefront/${storeSlug}/products?category=${selectedCategory}`
            : `/api/storefront/${storeSlug}/products`;

        api.get(url)
            .then(res => {
                // Handle both paginated (res.data.data) and unpaginated (res.data) responses
                const productList = res.data.data ? res.data.data : res.data;
                setProducts(productList);
            })
            .catch(console.error);
    }, [storeSlug, selectedCategory]);

    if (error) return (
        <div className="container" style={{ textAlign: 'center', marginTop: '100px' }}>
            <h1 style={{ color: 'var(--danger)', fontSize: '3rem' }}>404</h1>
            <p style={{ color: 'var(--text-muted)' }}>{error}</p>
        </div>
    );
    if (!store) return <div className="container">Loading Storefront...</div>;

    const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div className="container">
            <header className="dashboard-header" style={{ marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800' }}>{store.name}</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '8px' }}>{store.description}</p>
                </div>
                <div>
                    <Link to={`/${storeSlug}/cart`} className="btn-primary" style={{ textDecoration: 'none', position: 'relative' }}>
                        View Cart
                        {totalCartItems > 0 && (
                            <span style={{ position: 'absolute', top: '-8px', right: '-8px', backgroundColor: 'var(--danger)', color: '#fff', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                {totalCartItems}
                            </span>
                        )}
                    </Link>
                </div>
            </header>

            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
                <aside style={{ width: '250px', flexShrink: 0 }}>
                    <h3 style={{ marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Categories</h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <li>
                            <button
                                onClick={() => setSelectedCategory('')}
                                className={!selectedCategory ? 'btn-primary' : 'btn-outline'}
                                style={{ width: '100%', textAlign: 'left', padding: '12px 16px', border: !selectedCategory ? 'none' : '1px solid var(--surface-border)' }}
                            >
                                All Products
                            </button>
                        </li>
                        {categories.map(cat => (
                            <li key={cat.id}>
                                <button
                                    onClick={() => setSelectedCategory(cat.slug)}
                                    className={selectedCategory === cat.slug ? 'btn-primary' : 'btn-outline'}
                                    style={{ width: '100%', textAlign: 'left', padding: '12px 16px', border: selectedCategory === cat.slug ? 'none' : '1px solid var(--surface-border)' }}
                                >
                                    {cat.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </aside>

                <main style={{ flex: 1 }}>
                    <div className="grid">
                        {products.map(product => {
                            const defaultVariant = product.product_variants?.[0];
                            return (
                                <Link to={`/${storeSlug}/products/${product.slug}`} key={product.id} className="card" style={{ textDecoration: 'none', color: 'inherit', padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ width: '100%', aspectRatio: '1', backgroundColor: 'var(--input-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {defaultVariant?.image_url ? (
                                            <img src={defaultVariant.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <span style={{ color: 'var(--text-muted)' }}>No Image</span>
                                        )}
                                    </div>
                                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{product.category?.name || 'Uncategorized'}</div>
                                        <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: '600' }}>{product.name}</h3>
                                        
                                        <div style={{ marginTop: 'auto', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontWeight: '700', fontSize: '1.2rem', color: 'var(--accent)' }}>
                                                {defaultVariant ? `$${defaultVariant.price}` : 'Unavailable'}
                                            </span>
                                            <span className="link-text">View Details →</span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                    {products.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '60px', backgroundColor: 'var(--surface)', borderRadius: '16px', border: '1px dashed var(--surface-border)' }}>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>No products found in this category.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default StorefrontHome;
