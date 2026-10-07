import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useParams, Link, useNavigate } from 'react-router-dom';

const ProductVariants = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [variants, setVariants] = useState([]);
    const [form, setForm] = useState({ sku: '', price: '', stock: '' });
    const [attrForm, setAttrForm] = useState({ name: '', value: '' });

    useEffect(() => {
        api.get(`/api/products/${productId}/variants`).then(res => setVariants(res.data)).catch(console.error);
    }, [productId]);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const attributes = attrForm.name && attrForm.value ? { [attrForm.name]: attrForm.value } : {};
            const res = await api.post(`/api/products/${productId}/variants`, { ...form, attributes });
            setVariants([res.data.variant, ...variants]);
        } catch (err) {
            alert('Error creating variant: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <button onClick={() => navigate(-1)}>← Back</button>
            <h2>Variants (Product {productId})</h2>

            <form onSubmit={handleCreate} style={{ marginBottom: '2rem', display: 'flex', gap: '10px' }}>
                <input placeholder="SKU" required onChange={e => setForm({ ...form, sku: e.target.value })} />
                <input type="number" placeholder="Price" min="0" required onChange={e => setForm({ ...form, price: e.target.value })} />
                <input type="number" placeholder="Stock" min="0" required onChange={e => setForm({ ...form, stock: e.target.value })} />
                <input placeholder="Attr Name (e.g. Size)" onChange={e => setAttrForm({ ...attrForm, name: e.target.value })} />
                <input placeholder="Attr Value (e.g. XL)" onChange={e => setAttrForm({ ...attrForm, value: e.target.value })} />
                <button type="submit">Create Variant</button>
            </form>

            <ul>
                {variants.map(v => (
                    <li key={v.id}>
                        {v.sku} - ${v.price} ({v.stock} in stock)
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>
                            Attributes: {v.variant_attributes?.map(a => `${a.attribute_name}=${a.attribute_value}`).join(', ') || 'None'}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductVariants;
