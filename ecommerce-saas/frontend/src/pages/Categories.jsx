import React, { useState, useEffect } from 'react';
import api from '../services/api';
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
        try {
            await api.delete(`/api/stores/${storeId}/categories/${catId}`);
            setCategories(categories.filter(c => c.id !== catId));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <Link to="/stores">← Back to Stores</Link>
            <h2>Categories (Store {storeId})</h2>

            <form onSubmit={handleCreate} style={{ marginBottom: '2rem' }}>
                <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
                <input placeholder="Slug" value={slug} onChange={e => setSlug(e.target.value)} required />
                <button type="submit">Create Category</button>
            </form>

            <ul>
                {categories.map(c => (
                    <li key={c.id}>
                        {c.name} ({c.slug})
                        <button onClick={() => handleDelete(c.id)} style={{ marginLeft: '1rem', color: 'red' }}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Categories;
