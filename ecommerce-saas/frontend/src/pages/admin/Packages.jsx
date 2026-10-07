import { useState, useEffect } from 'react';
import api from '../../services/api';
import ManagementLayout from '../../components/management/ManagementLayout';

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
            const res = await api.get('/admin/packages');
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
                await api.put(`/admin/packages/${editingPkg.id}`, formData);
            } else {
                await api.post('/admin/packages', formData);
            }
            setShowModal(false);
            fetchPackages();
        } catch (err) {
            alert(err.response?.data?.message || 'Validation Error');
        }
    };

    const toggleStatus = async (pkg) => {
        try {
            await api.patch(`/admin/packages/${pkg.id}/status`, {
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
            await api.delete(`/admin/packages/${pkg.id}`);
            fetchPackages();
        } catch (err) {
            alert(err.response?.data?.message || err.response?.data?.errors?.package?.[0] || 'Deletion blocked due to active subscriptions.');
        }
    };

    return (
        <ManagementLayout
            title="Package Management"
            description="Create, edit, and disable subscription plans for your core platform."
        >
            <div className="flex justify-space-between" style={{ marginBottom: '20px' }}>
                <div></div>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setEditingPkg(null);
                        setFormData({ name: '', price: '', store_limit: '', status: 'active' });
                        setShowModal(true);
                    }}
                >
                    + Add Package
                </button>
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {loading ? <p>Loading packages...</p> : (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Store Limit</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {packages.map(pkg => (
                            <tr key={pkg.id}>
                                <td>{pkg.id}</td>
                                <td>{pkg.name}</td>
                                <td>${pkg.price}</td>
                                <td>{pkg.store_limit || 'Unlimited'}</td>
                                <td>
                                    <span className={`badge badge-${pkg.status}`}>
                                        {pkg.status}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-secondary" style={{ marginRight: '8px', padding: '4px 8px' }}
                                        onClick={() => {
                                            setEditingPkg(pkg);
                                            setFormData({ name: pkg.name, price: pkg.price, store_limit: pkg.store_limit || '', status: pkg.status });
                                            setShowModal(true);
                                        }}
                                    >Edit</button>
                                    <button
                                        className="btn btn-secondary" style={{ marginRight: '8px', padding: '4px 8px' }}
                                        onClick={() => toggleStatus(pkg)}
                                    >
                                        {pkg.status === 'active' ? 'Deactivate' : 'Activate'}
                                    </button>
                                    <button
                                        className="btn btn-danger" style={{ padding: '4px 8px', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                        onClick={() => deletePackage(pkg)}
                                    >Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {showModal && (
                <div className="mobile-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', width: '400px' }}>
                        <h3>{editingPkg ? 'Edit' : 'Add'} Package</h3>
                        <form onSubmit={handleSave}>
                            <div className="form-group" style={{ marginBottom: '16px' }}>
                                <label>Name</label>
                                <input required className="form-control" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '8px' }} />
                            </div>
                            <div className="form-group" style={{ marginBottom: '16px' }}>
                                <label>Price</label>
                                <input required type="number" step="0.01" className="form-control" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} style={{ width: '100%', padding: '8px' }} />
                            </div>
                            <div className="form-group" style={{ marginBottom: '16px' }}>
                                <label>Store Limit</label>
                                <input type="number" placeholder="Leave empty for unlimited" className="form-control" value={formData.store_limit} onChange={e => setFormData({ ...formData, store_limit: e.target.value })} style={{ width: '100%', padding: '8px' }} />
                            </div>
                            <div className="form-group" style={{ marginBottom: '24px' }}>
                                <label>Status</label>
                                <select className="form-control" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} style={{ width: '100%', padding: '8px' }}>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Package</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </ManagementLayout>
    );
}
