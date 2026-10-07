import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useParams, useNavigate } from 'react-router-dom';

const ProductVariants = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [variants, setVariants] = useState([]);
    const [form, setForm] = useState({ sku: '', price: '', stock: '', image: null });
    const [attrForm, setAttrForm] = useState({ name: '', value: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        api.get(`/api/products/${productId}/variants`).then(res => setVariants(res.data)).catch(console.error);
    }, [productId]);

    const handleCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('sku', form.sku);
            formData.append('price', form.price);
            formData.append('stock', form.stock);
            
            if (form.image) {
                formData.append('image', form.image);
            }

            if (attrForm.name && attrForm.value) {
                formData.append(`attributes[${attrForm.name}]`, attrForm.value);
            }

            const res = await api.post(`/api/products/${productId}/variants`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setVariants([res.data.variant, ...variants]);
            setForm({ sku: '', price: '', stock: '', image: null });
            setAttrForm({ name: '', value: '' });
        } catch (err) {
            alert('Error creating variant: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (variantId) => {
        if (!window.confirm("Delete this variant?")) return;
        try {
            await api.delete(`/api/products/${productId}/variants/${variantId}`);
            setVariants(variants.filter(v => v.id !== variantId));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container">
            <div className="dashboard-header">
                <div>
                    <button onClick={() => navigate(-1)} className="link-text" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'inline-block', marginBottom: '8px', fontSize: '1rem' }}>← Back to Products</button>
                    <h1>Product Variants</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Product #{productId}</p>
                </div>
            </div>

            <div className="card" style={{ marginBottom: '32px' }}>
                <h3 style={{ marginTop: 0, marginBottom: '24px' }}>Add New Variant</h3>
                <form onSubmit={handleCreate} style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        <div className="form-group" style={{ flex: '1 1 200px', marginBottom: 0 }}>
                            <input 
                                className="input-field" 
                                placeholder=" " 
                                value={form.sku} 
                                onChange={e => setForm({ ...form, sku: e.target.value })} 
                                required 
                            />
                            <label className="floating-label">SKU (e.g. TSHIRT-RED-XL)</label>
                        </div>
                        <div className="form-group" style={{ flex: '1 1 150px', marginBottom: 0 }}>
                            <input 
                                className="input-field" 
                                type="number"
                                placeholder=" " 
                                value={form.price} 
                                onChange={e => setForm({ ...form, price: e.target.value })} 
                                required 
                                min="0" step="0.01"
                            />
                            <label className="floating-label">Price ($)</label>
                        </div>
                        <div className="form-group" style={{ flex: '1 1 150px', marginBottom: 0 }}>
                            <input 
                                className="input-field" 
                                type="number"
                                placeholder=" " 
                                value={form.stock} 
                                onChange={e => setForm({ ...form, stock: e.target.value })} 
                                required 
                                min="0"
                            />
                            <label className="floating-label">Stock Quantity</label>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        <div className="form-group" style={{ flex: '1 1 200px', marginBottom: 0 }}>
                            <input 
                                className="input-field" 
                                placeholder=" " 
                                value={attrForm.name} 
                                onChange={e => setAttrForm({ ...attrForm, name: e.target.value })} 
                            />
                            <label className="floating-label">Attribute Name (e.g. Size)</label>
                        </div>
                        <div className="form-group" style={{ flex: '1 1 200px', marginBottom: 0 }}>
                            <input 
                                className="input-field" 
                                placeholder=" " 
                                value={attrForm.value} 
                                onChange={e => setAttrForm({ ...attrForm, value: e.target.value })} 
                            />
                            <label className="floating-label">Attribute Value (e.g. XL)</label>
                        </div>
                        <div className="form-group" style={{ flex: '1 1 200px', marginBottom: 0 }}>
                            <input 
                                className="input-field" 
                                type="file"
                                accept="image/*"
                                onChange={e => setForm({ ...form, image: e.target.files[0] })} 
                                style={{ padding: '14px 20px 0px 20px' }}
                            />
                            <label className="floating-label" style={{ top: '0', fontSize: '0.8rem', backgroundColor: 'var(--surface)' }}>Product Image</label>
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '8px' }} disabled={loading}>
                        {loading ? 'Creating...' : 'Create Variant'}
                    </button>
                </form>
            </div>

            <h2>Current Variants & Inventory</h2>
            <div className="grid" style={{ marginTop: '24px' }}>
                {variants.map(v => (
                    <div key={v.id} className="card" style={{ padding: '24px', display: 'flex', gap: '20px' }}>
                        {v.image_url ? (
                            <img src={v.image_url} alt={v.sku} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--surface-border)' }} />
                        ) : (
                            <div style={{ width: '80px', height: '80px', backgroundColor: 'var(--input-bg)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No Img</div>
                        )}
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem' }}>{v.sku}</h3>
                                <span className="badge" style={{ backgroundColor: v.stock > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(220, 38, 38, 0.1)', color: v.stock > 0 ? 'var(--accent)' : 'var(--danger)' }}>
                                    {v.stock > 0 ? `${v.stock} In Stock` : 'Out of Stock'}
                                </span>
                            </div>
                            <p style={{ margin: '0 0 8px 0', fontWeight: '600', fontSize: '1.1rem' }}>${v.price}</p>
                            <p style={{ margin: '0 0 16px 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                Attributes: {v.variant_attributes?.length > 0 ? v.variant_attributes.map(a => `${a.attribute_name}: ${a.attribute_value}`).join(', ') : 'None'}
                            </p>
                            <button onClick={() => handleDelete(v.id)} className="link-text" style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Delete Variant</button>
                        </div>
                    </div>
                ))}
                {variants.length === 0 && (
                    <p style={{ color: 'var(--text-muted)' }}>No variants found for this product. Add one above.</p>
                )}
            </div>
        </div>
    );
};

export default ProductVariants;
