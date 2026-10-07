import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useParams, Link } from 'react-router-dom';

const Products = () => {
    const { storeId } = useParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ name: '', slug: '', category_id: '' });

    useEffect(() => {
        api.get(`/api/stores/${storeId}/products`).then(res => setProducts(res.data)).catch(console.error);
        api.get(`/api/stores/${storeId}/categories`).then(res => setCategories(res.data)).catch(console.error);
    }, [storeId]);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post(`/api/stores/${storeId}/products`, form);
            setProducts([res.data.product, ...products]);
            setForm({ name: '', slug: '', category_id: '' });
        } catch (err) {
            alert('Error creating product: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="container">
            <div className="dashboard-header">
                <div>
                    <Link to="/dashboard" className="link-text" style={{ display: 'inline-block', marginBottom: '8px' }}>← Back to Dashboard</Link>
                    <h1>Manage Products</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Store #{storeId}</p>
                </div>
                <Link to={`/stores/${storeId}/categories`} className="btn-outline" style={{ textDecoration: 'none' }}>Manage Categories</Link>
            </div>

            <div className="card" style={{ marginBottom: '32px' }}>
                <h3 style={{ marginTop: 0, marginBottom: '24px' }}>Create New Product</h3>
                <form onSubmit={handleCreate} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    <div className="form-group" style={{ flex: '1 1 200px', marginBottom: 0 }}>
                        <input 
                            className="input-field" 
                            placeholder=" " 
                            value={form.name} 
                            onChange={e => setForm({ ...form, name: e.target.value })} 
                            required 
                        />
                        <label className="floating-label">Product Name</label>
                    </div>
                    <div className="form-group" style={{ flex: '1 1 200px', marginBottom: 0 }}>
                        <input 
                            className="input-field" 
                            placeholder=" " 
                            value={form.slug} 
                            onChange={e => setForm({ ...form, slug: e.target.value })} 
                            required 
                        />
                        <label className="floating-label">Product Slug</label>
                    </div>
                    <div className="form-group" style={{ flex: '1 1 200px', marginBottom: 0 }}>
                        <select 
                            className="input-field"
                            style={{ padding: '16px 20px', appearance: 'none' }}
                            required 
                            value={form.category_id}
                            onChange={e => setForm({ ...form, category_id: e.target.value })}
                        >
                            <option value="">Select Category</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '8px' }}>Create Product</button>
                </form>
            </div>

            <h2>Existing Products</h2>
            <div className="grid" style={{ marginTop: '24px' }}>
                {products.map(p => (
                    <div key={p.id} className="card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <div>
                                <h3 style={{ margin: '0 0 8px 0' }}>{p.name}</h3>
                                <span className="badge">{p.category?.name || 'Uncategorized'}</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <Link to={`/products/${p.id}/variants`} className="btn-outline" style={{ flex: 1, textDecoration: 'none', textAlign: 'center' }}>
                                Manage Variants & Inventory
                            </Link>
                        </div>
                    </div>
                ))}
                {products.length === 0 && (
                    <p style={{ color: 'var(--text-muted)' }}>No products found. Add a category and create one!</p>
                )}
            </div>
        </div>
    );
};

export default Products;
