import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

export default function Packages() {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [editingPkg, setEditingPkg] = useState(null);
    const [formData, setFormData] = useState({ name: '', price: '', store_limit: '', status: 'active' });

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            const res = await api.get('/api/admin/packages');
            setPackages(res.data);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load packages');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingPkg) {
                await api.put(`/api/admin/packages/${editingPkg.id}`, formData);
            } else {
                await api.post('/api/admin/packages', formData);
            }
            setShowModal(false);
            fetchPackages();
        } catch (err) {
            alert(err.response?.data?.message || 'Validation Error');
        }
    };

    const toggleStatus = async (pkg) => {
        try {
            await api.patch(`/api/admin/packages/${pkg.id}/status`, {
                status: pkg.status === 'active' ? 'inactive' : 'active'
            });
            fetchPackages();
        } catch (err) {
            alert(err.response?.data?.message || 'Update failed');
        }
    };

    const deletePackage = async (pkg) => {
        if (!confirm('Are you sure you want to delete this package?')) return;
        try {
            await api.delete(`/api/admin/packages/${pkg.id}`);
            fetchPackages();
        } catch (err) {
            alert(err.response?.data?.message || err.response?.data?.errors?.package?.[0] || 'Deletion blocked due to active subscriptions.');
        }
    };

    if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '100px' }}>Loading...</div>;

    return (
        <div className="container">
            <header className="dashboard-header">
                <div>
                    <Link to="/admin" className="link-text" style={{ fontSize: '0.9rem', marginBottom: '8px', display: 'inline-block' }}>← Back to Dashboard</Link>
                    <h1>SaaS Packages</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Create, edit, and disable subscription plans for your core platform.</p>
                </div>
                <div>
                    <button
                        className="btn-primary"
                        onClick={() => {
                            setEditingPkg(null);
                            setFormData({ name: '', price: '', store_limit: '', status: 'active' });
                            setShowModal(true);
                        }}
                    >
                        + Add Package
                    </button>
                </div>
            </header>

            {error && <div className="error-text">{error}</div>}

            <div className="grid">
                {packages.map(pkg => (
                    <div key={pkg.id} className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h2 style={{ fontSize: '1.4rem', margin: 0 }}>{pkg.name}</h2>
                            <span className="badge" style={{ backgroundColor: pkg.status === 'active' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: pkg.status === 'active' ? '#10b981' : '#ef4444' }}>
                                {pkg.status}
                            </span>
                        </div>
                        
                        <div style={{ marginBottom: '24px' }}>
                            <span style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-main)' }}>${pkg.price}</span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>/month</span>
                        </div>

                        <div style={{ marginBottom: '32px', flexGrow: 1 }}>
                            <p style={{ margin: '8px 0', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', fontSize: '0.95rem' }}>
                                <span style={{ color: '#10b981' }}>✓</span> {pkg.store_limit ? `${pkg.store_limit} Store Limit` : 'Unlimited Stores'}
                            </p>
                            <p style={{ margin: '8px 0', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', fontSize: '0.95rem' }}>
                                <span style={{ color: '#10b981' }}>✓</span> Priority Support
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--surface-border)', paddingTop: '20px' }}>
                            <button
                                className="btn-outline" style={{ flex: 1 }}
                                onClick={() => {
                                    setEditingPkg(pkg);
                                    setFormData({ name: pkg.name, price: pkg.price, store_limit: pkg.store_limit || '', status: pkg.status });
                                    setShowModal(true);
                                }}
                            >
                                Edit
                            </button>
                            <button
                                className="btn-outline" style={{ flex: 1, color: pkg.status === 'active' ? '#f59e0b' : '#10b981' }}
                                onClick={() => toggleStatus(pkg)}
                            >
                                {pkg.status === 'active' ? 'Disable' : 'Enable'}
                            </button>
                            <button
                                className="btn-outline" style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)', padding: '10px' }}
                                onClick={() => deletePackage(pkg)}
                            >
                                🗑
                            </button>
                        </div>
                    </div>
                ))}
                {packages.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No packages found.</p>}
            </div>

            {showModal && (
                <div className="mobile-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}>
                    <div className="card" style={{ width: '100%', maxWidth: '440px', padding: '32px' }}>
                        <h2 style={{ marginBottom: '24px' }}>{editingPkg ? 'Edit' : 'Create'} Package</h2>
                        <form onSubmit={handleSave}>
                            <div className="form-group">
                                <input required className="input-field" placeholder=" " value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                <label className="floating-label">Package Name (e.g. Pro Plan)</label>
                            </div>
                            <div className="form-group">
                                <input required type="number" step="0.01" className="input-field" placeholder=" " value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                                <label className="floating-label">Monthly Price ($)</label>
                            </div>
                            <div className="form-group">
                                <input type="number" className="input-field" placeholder=" " value={formData.store_limit} onChange={e => setFormData({ ...formData, store_limit: e.target.value })} />
                                <label className="floating-label">Store Limit (Leave blank for unlimited)</label>
                            </div>
                            <div className="form-group" style={{ marginBottom: '32px' }}>
                                <select className="input-field" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} style={{ padding: '16px', appearance: 'none' }}>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                                <label className="floating-label" style={{ top: 0, fontSize: '0.75rem', backgroundColor: 'var(--surface-solid)' }}>Status</label>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button type="button" className="btn-outline" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary" style={{ flex: 2 }}>Save Package</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
