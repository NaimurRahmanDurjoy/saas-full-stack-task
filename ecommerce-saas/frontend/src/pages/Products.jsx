import React, { useState, useEffect } from 'react';
import api from '../services/api';
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
        } catch (err) {
            alert('Error creating product: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <Link to="/stores">← Back to Stores</Link>
            <h2>Products (Store {storeId})</h2>

            <form onSubmit={handleCreate} style={{ marginBottom: '2rem' }}>
                <input placeholder="Name" required onChange={e => setForm({ ...form, name: e.target.value })} />
                <input placeholder="Slug" required onChange={e => setForm({ ...form, slug: e.target.value })} />
                <select required onChange={e => setForm({ ...form, category_id: e.target.value })}>
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <button type="submit">Create Product</button>
            </form>

            <ul>
                {products.map(p => (
                    <li key={p.id} style={{ marginBottom: '1rem' }}>
                        <strong>{p.name}</strong>
                        <span style={{ fontSize: '0.8rem', marginLeft: '1rem' }}>Cat: {p.category?.name}</span>
                        <div style={{ marginTop: '0.5rem' }}>
                            <Link to={`/products/${p.id}/variants`}>Manage Variants</Link>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Products;
