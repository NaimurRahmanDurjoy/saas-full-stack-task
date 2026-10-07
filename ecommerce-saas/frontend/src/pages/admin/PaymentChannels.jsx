import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const PaymentChannels = () => {
    const [channels, setChannels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formError, setFormError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        name: '',
        type: 'manual',
        account_number: '',
        instructions: '',
        status: 'active'
    });

    useEffect(() => {
        fetchChannels();
    }, []);

    const fetchChannels = async () => {
        try {
            const res = await api.get('/api/admin/payment-channels');
            setChannels(res.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch payment channels or unauthorized.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);
        try {
            if (isEditing) {
                await api.put(`/api/admin/payment-channels/${formData.id}`, formData);
            } else {
                await api.post('/api/admin/payment-channels', formData);
            }
            fetchChannels();
            resetForm();
        } catch (err) {
            setFormError(err.response?.data?.message || 'Error saving payment channel.');
        }
    };

    const handleEdit = (channel) => {
        setIsEditing(true);
        setFormData({
            id: channel.id,
            name: channel.name,
            type: channel.type,
            account_number: channel.account_number || '',
            instructions: channel.instructions || '',
            status: channel.status
        });
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await api.patch(`/api/admin/payment-channels/${id}/status`, { status });
            fetchChannels();
        } catch (err) {
            alert('Error updating status');
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/api/admin/payment-channels/${id}`);
            fetchChannels();
        } catch (err) {
            alert(err.response?.data?.errors?.channel?.[0] || 'Error deleting channel. Dependent records might exist.');
        }
    };

    const resetForm = () => {
        setIsEditing(false);
        setFormData({
            id: null,
            name: '',
            type: 'manual',
            account_number: '',
            instructions: '',
            status: 'active'
        });
        setFormError(null);
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading Payment Channels...</div>;
    if (error) return <div style={{ padding: '2rem', color: 'red' }}>{error} - Admin Access Only</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>Admin: Payment Channel Management</h1>

            <div style={{ background: '#f9f9f9', padding: '1rem', border: '1px solid #ddd', margin: '2rem 0', borderRadius: '8px' }}>
                <h2>{isEditing ? 'Edit Channel' : 'Create New Channel'}</h2>
                {formError && <div style={{ color: 'red', marginBottom: '1rem' }}>{formError}</div>}
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
                    <div>
                        <label>Name</label>
                        <input required name="name" value={formData.name} onChange={handleInputChange} style={{ width: '100%', padding: '0.5rem' }} />
                    </div>
                    <div>
                        <label>Account Number</label>
                        <input name="account_number" value={formData.account_number} onChange={handleInputChange} style={{ width: '100%', padding: '0.5rem' }} />
                    </div>
                    <div>
                        <label>Type</label>
                        <input required name="type" value={formData.type} onChange={handleInputChange} style={{ width: '100%', padding: '0.5rem' }} />
                    </div>
                    <div>
                        <label>Status</label>
                        <select name="status" value={formData.status} onChange={handleInputChange} style={{ width: '100%', padding: '0.5rem' }}>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label>Instructions</label>
                        <textarea name="instructions" value={formData.instructions} onChange={handleInputChange} style={{ width: '100%', padding: '0.5rem' }} rows="3" />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <button type="submit" style={{ padding: '0.5rem 1rem', background: '#000', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
                            {isEditing ? 'Update Channel' : 'Create Channel'}
                        </button>
                        {isEditing && (
                            <button type="button" onClick={resetForm} style={{ padding: '0.5rem 1rem', marginLeft: '1rem', cursor: 'pointer', borderRadius: '4px' }}>
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                <thead>
                    <tr style={{ background: '#eee' }}>
                        <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ccc' }}>Name</th>
                        <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ccc' }}>Account Number</th>
                        <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ccc' }}>Type</th>
                        <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ccc' }}>Status</th>
                        <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ccc' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {channels.map(channel => (
                        <tr key={channel.id}>
                            <td style={{ padding: '10px', border: '1px solid #ccc' }}>{channel.name}</td>
                            <td style={{ padding: '10px', border: '1px solid #ccc' }}>{channel.account_number || 'N/A'}</td>
                            <td style={{ padding: '10px', border: '1px solid #ccc' }}>{channel.type}</td>
                            <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                                <span style={{ background: channel.status === 'active' ? '#d4edda' : '#f8d7da', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                                    {channel.status}
                                </span>
                            </td>
                            <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                                <button onClick={() => handleEdit(channel)} style={{ marginRight: '0.5rem' }}>Edit</button>
                                {channel.status === 'active' ? (
                                    <button onClick={() => handleUpdateStatus(channel.id, 'inactive')} style={{ marginRight: '0.5rem' }}>Deactivate</button>
                                ) : (
                                    <button onClick={() => handleUpdateStatus(channel.id, 'active')} style={{ marginRight: '0.5rem' }}>Activate</button>
                                )}
                                <button onClick={() => handleDelete(channel.id)} style={{ color: 'red' }}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    {channels.length === 0 && <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center' }}>No payment channels found.</td></tr>}
                </tbody>
            </table>
        </div>
    );
};

export default PaymentChannels;
