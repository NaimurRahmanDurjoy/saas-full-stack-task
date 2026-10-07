import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useParams, Link } from 'react-router-dom';

const Categories = () => {
    const { storeId } = useParams();
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');

    useEffect(() => {
        api.get(`/api/stores/${storeId}/categories`).then(res => setCategories(res.data)).catch(console.error);
    }, [storeId]);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post(`/api/stores/${storeId}/categories`, { name, slug });
            setCategories([...categories, res.data.category]);
            setName('');
            setSlug('');
        } catch (err) {
            alert('Error creating category: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleDelete = async (catId) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        try {
            await api.delete(`/api/stores/${storeId}/categories/${catId}`);
            setCategories(categories.filter(c => c.id !== catId));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container">
            <div className="dashboard-header">
                <div>
                    <Link to="/dashboard" className="link-text" style={{ display: 'inline-block', marginBottom: '8px' }}>← Back to Dashboard</Link>
                    <h1>Manage Categories</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Store #{storeId}</p>
                </div>
            </div>

            <div className="card" style={{ marginBottom: '32px' }}>
                <h3 style={{ marginTop: 0, marginBottom: '24px' }}>Create New Category</h3>
                <form onSubmit={handleCreate} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                        <input 
                            className="input-field" 
                            placeholder=" " 
                            value={name} 
                            onChange={e => setName(e.target.value)} 
                            required 
                        />
                        <label className="floating-label">Category Name</label>
                    </div>
                    <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                        <input 
                            className="input-field" 
                            placeholder=" " 
                            value={slug} 
                            onChange={e => setSlug(e.target.value)} 
                            required 
                        />
                        <label className="floating-label">Category Slug</label>
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: 'auto' }}>Add Category</button>
                </form>
            </div>

            <h2>Existing Categories</h2>
            <div className="grid" style={{ marginTop: '24px' }}>
                {categories.map(c => (
                    <div key={c.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px' }}>
                        <div>
                            <h3 style={{ margin: '0 0 8px 0' }}>{c.name}</h3>
                            <span className="badge" style={{ backgroundColor: 'var(--surface-border)', color: 'var(--text-muted)' }}>/{c.slug}</span>
                        </div>
                        <button onClick={() => handleDelete(c.id)} className="btn-outline" style={{ color: 'var(--danger)', borderColor: 'rgba(220, 38, 38, 0.3)' }}>Delete</button>
                    </div>
                ))}
                {categories.length === 0 && (
                    <p style={{ color: 'var(--text-muted)' }}>No categories found.</p>
                )}
            </div>
        </div>
    );
};

export default Categories;
