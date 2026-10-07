import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';

const StorefrontHome = () => {
    const { storeSlug } = useParams();
    const [store, setStore] = useState(null);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // Load initial store config and categories!
        api.get(`/api/storefront/${storeSlug}`)
            .then(res => setStore(res.data))
            .catch(() => setError('Store not found.'));

        api.get(`/api/storefront/${storeSlug}/categories`)
            .then(res => setCategories(res.data))
            .catch(console.error);
    }, [storeSlug]);

    useEffect(() => {
        // Load products optionally filtering properly scoping purely unauthenticated backend endpoints natively!
        const url = selectedCategory
            ? `/api/storefront/${storeSlug}/products?category=${selectedCategory}`
            : `/api/storefront/${storeSlug}/products`;

        api.get(url)
            .then(res => setProducts(res.data))
            .catch(console.error);
    }, [storeSlug, selectedCategory]);

    if (error) return <div style={{ padding: '2rem', color: 'red' }}><h1>{error}</h1><p>The requested URL returned 404.</p></div>;
    if (!store) return <div style={{ padding: '2rem' }}>Loading Storefront...</div>;

    return (
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ddd', paddingBottom: '1rem', marginBottom: '2rem' }}>
                <div>
                    <h1>Welcome to {store.name}</h1>
                    <p style={{ color: '#666' }}>{store.description}</p>
                </div>
                <div style={{ alignSelf: 'center' }}>
                    <Link to={`/${storeSlug}/cart`} style={{ padding: '0.5rem 1rem', background: '#000', color: '#fff', textDecoration: 'none', borderRadius: '4px' }}>
                        View Cart
                    </Link>
                </div>
            </header>

            <div style={{ display: 'flex', gap: '2rem' }}>
                <aside style={{ width: '250px' }}>
                    <h3>Categories</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li style={{ marginBottom: '0.5rem' }}>
                            <button
                                onClick={() => setSelectedCategory('')}
                                style={{ fontWeight: !selectedCategory ? 'bold' : 'normal', background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                All Products
                            </button>
                        </li>
                        {categories.map(cat => (
                            <li key={cat.id} style={{ marginBottom: '0.5rem' }}>
                                <button
                                    onClick={() => setSelectedCategory(cat.slug)}
                                    style={{ fontWeight: selectedCategory === cat.slug ? 'bold' : 'normal', background: 'none', border: 'none', cursor: 'pointer' }}
                                >
                                    {cat.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </aside>

                <main style={{ flex: 1 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                        {products.map(product => (
                            <Link to={`/${storeSlug}/products/${product.slug}`} key={product.id} style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px', textDecoration: 'none', color: '#000' }}>
                                <h3 style={{ margin: '0 0 0.5rem 0' }}>{product.name}</h3>
                                <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '1rem' }}>{product.category?.name}</div>
                                {product.description && <p style={{ fontSize: '0.9rem', color: '#555' }}>{product.description.substring(0, 50)}...</p>}
                                <div style={{ marginTop: 'auto', textAlign: 'center', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
                                    <strong>View Details</strong>
                                </div>
                            </Link>
                        ))}
                        {products.length === 0 && <p>No products available.</p>}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default StorefrontHome;
