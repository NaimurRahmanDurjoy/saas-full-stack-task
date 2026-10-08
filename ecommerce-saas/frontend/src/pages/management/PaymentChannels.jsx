import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import ManagementLayout from '../../components/management/ManagementLayout';
import { CreditCard, Edit, Trash2, PowerOff, Power } from 'lucide-react';
import toast from 'react-hot-toast';

const PaymentChannels = () => {
    const [channels, setChannels] = useState([]);
    const [name, setName] = useState('');
    const [type, setType] = useState('bank_transfer'); // 'bank_transfer' or 'mobile_banking'
    const [instructions, setInstructions] = useState('');
    const [loading, setLoading] = useState(true);
    const [confirmingId, setConfirmingId] = useState(null);

    useEffect(() => {
        fetchChannels();
    }, []);

    const fetchChannels = async () => {
        try {
            const res = await api.get('/api/admin/payment-channels');
            setChannels(res.data);
        } catch (error) {
            console.error("Failed to fetch payment channels");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/admin/payment-channels', { name, type, instructions, status: 'active' });
            setName('');
            setInstructions('');
            fetchChannels();
        } catch (error) {
            alert('Failed to create payment channel');
        }
    };

    const handleDelete = async (id) => {
        if (confirmingId !== id) {
            setConfirmingId(id);
            setTimeout(() => setConfirmingId(null), 3000);
            return;
        }
        setConfirmingId(null);
        const deleteToast = toast.loading('Deleting...', { id: `delete-${id}` });
        try {
            await api.delete(`/api/admin/payment-channels/${id}`);
            toast.success('Channel deleted successfully', { id: `delete-${id}` });
            fetchChannels();
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to delete payment channel';
            toast.error(message, { id: `delete-${id}` });
            if (error.response?.status === 409) {
                fetchChannels();
            }
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        try {
            await api.patch(`/api/admin/payment-channels/${id}/status`, { status: newStatus });
            fetchChannels();
        } catch (error) {
            alert('Failed to update status');
        }
    };

    if (loading) return (
        <ManagementLayout title="Payment Gateways" description="Loading..."></ManagementLayout>
    );

    return (
        <ManagementLayout
            title="Payment Gateways"
            description="Configure platform-wide payment acceptance methods."
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <form onSubmit={handleCreate} className="bg-white border border-gray-100 shadow-sm rounded-3xl p-6 lg:p-8 h-fit">
                    <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-brand-600" />
                        Add New Gateway
                    </h2>

                    <div className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Gateway Name</label>
                            <input
                                required
                                className="w-full h-12 bg-gray-50 focus:bg-white border-2 border-transparent focus:border-brand-500 rounded-xl px-4 font-semibold text-gray-900 outline-none transition"
                                placeholder="e.g. Bkash, City Bank"
                                value={name} onChange={e => setName(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Method Type</label>
                            <select
                                className="w-full h-12 bg-gray-50 focus:bg-white border-2 border-transparent focus:border-brand-500 rounded-xl px-4 font-semibold text-gray-900 outline-none transition appearance-none"
                                value={type} onChange={e => setType(e.target.value)}
                            >
                                <option value="bank_transfer">Bank Transfer</option>
                                <option value="mobile_banking">Mobile Banking</option>
                            </select>
                        </div>

                        <div className="space-y-1 pb-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Account Details</label>
                            <textarea
                                required
                                className="w-full bg-gray-50 focus:bg-white border-2 border-transparent focus:border-brand-500 rounded-xl p-4 font-medium text-gray-700 outline-none transition resize-none"
                                placeholder="Instructions..."
                                value={instructions} onChange={e => setInstructions(e.target.value)} rows="4"
                            />
                        </div>

                        <button type="submit" className="w-full h-12 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/20 active:scale-[0.98] transition">Save Gateway</button>
                    </div>
                </form>

                <div className="lg:col-span-2">
                    <div className="bg-white border border-gray-100 shadow-sm rounded-3xl overflow-hidden">
                        <div className="p-4 lg:p-5 border-b border-gray-50">
                            <h2 className="text-lg font-extrabold text-gray-900">Active Gateways</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50/60 border-b border-gray-100">
                                    <tr>
                                        <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Gateway Name</th>
                                        <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Type</th>
                                        <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                                        <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {channels.map(channel => (
                                        <tr key={channel.id} className="hover:bg-gray-50/50 transition">
                                            <td className="px-5 py-4">
                                                <div className="font-bold text-gray-900">{channel.name}</div>
                                                <div className="text-xs text-gray-400 mt-0.5">{channel.instructions}</div>
                                            </td>
                                            <td className="px-5 py-4 whitespace-nowrap">
                                                <span className="text-[10px] font-bold tracking-widest text-brand-600 uppercase">{channel.type.replace('_', ' ')}</span>
                                            </td>
                                            <td className="px-5 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${channel.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                    {channel.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => toggleStatus(channel.id, channel.status)} className={`px-3 flex items-center justify-center gap-1.5 h-8 rounded-lg font-bold text-[11px] transition ${channel.status === 'active' ? 'bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-orange-600' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}>
                                                        {channel.status === 'active' ? 'Disable' : 'Enable'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(channel.id)}
                                                        className={`px-3 flex items-center justify-center gap-1.5 h-8 rounded-lg font-bold text-[11px] transition-all duration-200 ${confirmingId === channel.id
                                                                ? 'bg-red-500 text-white border border-red-500 scale-105'
                                                                : 'bg-white border border-red-100 text-red-500 hover:bg-red-50'
                                                            }`}
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                        {confirmingId === channel.id ? 'Confirm?' : 'Delete'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {channels.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="p-10 text-center text-gray-500 font-medium">
                                                <CreditCard className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                                                No payment channels configured yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </ManagementLayout>
    );
};

export default PaymentChannels;
