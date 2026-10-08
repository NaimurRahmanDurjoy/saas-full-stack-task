import { useState, useEffect } from 'react';
import api from '../../services/api';
import ManagementLayout from '../../components/management/ManagementLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { PackageOpen, Activity, Plus, Edit, Trash2, PowerOff, Power, Store, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Packages() {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [editingPkg, setEditingPkg] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', price: '', store_limit: '', status: 'active' });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            const res = await api.get('/api/admin/packages');
            setPackages(res.data);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to load packages');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        const saveToast = toast.loading('Saving package...', { className: 'font-medium' });
        try {
            if (editingPkg) {
                await api.put(`/api/admin/packages/${editingPkg.id}`, formData);
            } else {
                await api.post('/api/admin/packages', formData);
            }
            toast.success('Package saved successfully!', { id: saveToast });
            setShowModal(false);
            fetchPackages();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Validation Error', { id: saveToast });
        } finally {
            setIsSaving(false);
        }
    };

    const toggleStatus = async (pkg) => {
        const toggleToast = toast.loading('Updating package status...', { className: 'font-medium' });
        try {
            const newStatus = pkg.status === 'active' ? 'inactive' : 'active';
            await api.patch(`/api/admin/packages/${pkg.id}/status`, {
                status: newStatus
            });
            toast.success(`Package marked as ${newStatus}`, { id: toggleToast });
            fetchPackages();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed', { id: toggleToast });
        }
    };

    const deletePackage = async (pkg) => {
        if (!confirm('Are you sure you want to delete this package?')) return;
        const deleteToast = toast.loading('Deleting package...', { className: 'font-medium' });
        try {
            await api.delete(`/api/admin/packages/${pkg.id}`);
            toast.success('Package deleted', { id: deleteToast });
            fetchPackages();
        } catch (err) {
            toast.error(err.response?.data?.message || err.response?.data?.errors?.package?.[0] || 'Blocked due to active subscriptions', { id: deleteToast });
        }
    };

    return (
        <ManagementLayout
            title="SaaS Packages"
            description="Create, edit, and globally manage subscription plans for platform tenants."
            headerAction={
                <button
                    onClick={() => {
                        setEditingPkg(null);
                        setFormData({ name: '', description: '', price: '', store_limit: '', status: 'active' });
                        setShowModal(true);
                    }}
                    className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-brand-600 text-white font-bold hover:bg-brand-700 transition shadow-lg shadow-brand-500/25 active:scale-95"
                >
                    <Plus className="w-5 h-5" /> Add Package
                </button>
            }
        >

            {loading ? (
                <div className="p-12 text-center text-gray-400 font-bold flex flex-col items-center">
                    <Activity className="w-8 h-8 text-gray-300 animate-spin mb-4" />
                    Loading packages...
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {packages.map((pkg, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                            key={pkg.id}
                            className="bg-white border flex flex-col border-gray-100 rounded-[2rem] p-6 lg:p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group h-full min-h-[400px]"
                        >
                            <div className="flex justify-between items-start mb-6 shrink-0">
                                <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center border border-brand-100">
                                    <PackageOpen className="w-6 h-6 text-brand-600" />
                                </div>
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${pkg.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                    {pkg.status}
                                </span>
                            </div>

                            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight leading-none mb-1 shrink-0">{pkg.name}</h2>
                            {pkg.description ? (
                                <p className="text-sm font-medium text-gray-500 mb-6 shrink-0 leading-relaxed min-h-[40px]">{pkg.description}</p>
                            ) : (
                                <div className="mb-6 shrink-0 min-h-[40px]"></div>
                            )}

                            <div className="flex items-end gap-1 mb-8 shrink-0">
                                <span className="text-4xl font-black text-gray-900">${pkg.price}</span>
                                <span className="text-sm font-medium text-gray-400 mb-1">/month</span>
                            </div>

                            <div className="space-y-4 mb-8 flex-grow">
                                <div className="flex items-center gap-3 text-sm font-semibold text-gray-600">
                                    <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                                        ✓
                                    </div>
                                    {pkg.store_limit ? `${pkg.store_limit} Store Limit` : 'Unlimited Stores'}
                                </div>
                                <div className="flex items-center gap-3 text-sm font-semibold text-gray-600">
                                    <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                                        <Store className="w-3.5 h-3.5 text-green-600" />
                                    </div>
                                    Priority Support
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-6 border-t border-gray-50 mt-auto shrink-0">
                                <button
                                    onClick={() => {
                                        setEditingPkg(pkg);
                                        setFormData({ name: pkg.name, description: pkg.description || '', price: pkg.price, store_limit: pkg.store_limit || '', status: pkg.status });
                                        setShowModal(true);
                                    }}
                                    className="flex items-center justify-center gap-2 h-10 rounded-xl bg-gray-50 font-bold text-gray-600 text-xs hover:bg-gray-100 hover:text-brand-600 transition"
                                >
                                    <Edit className="w-4 h-4" /> Edit
                                </button>
                                <button
                                    onClick={() => toggleStatus(pkg)}
                                    className={`flex items-center justify-center gap-2 h-10 rounded-xl font-bold text-xs transition ${pkg.status === 'active'
                                        ? 'bg-gray-50 text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                                        : 'bg-green-50 text-green-700 hover:bg-green-100'
                                        }`}
                                >
                                    {pkg.status === 'active' ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                                    {pkg.status === 'active' ? 'Disable' : 'Enable'}
                                </button>
                                <button
                                    onClick={() => deletePackage(pkg)}
                                    className="col-span-2 flex items-center justify-center gap-2 h-10 rounded-xl bg-white border border-red-100 text-red-500 font-bold text-xs hover:bg-red-50 transition"
                                >
                                    <Trash2 className="w-4 h-4" /> Delete Package
                                </button>
                            </div>
                        </motion.div>
                    ))}
                    {packages.length === 0 && (
                        <div className="col-span-full py-16 text-center text-gray-500 font-medium">
                            <PackageOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            No packages created yet.
                        </div>
                    )}
                </div>
            )}

            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: -20 }}
                            className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
                        >
                            <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 bg-gray-50/50">
                                <h3 className="font-extrabold text-lg text-gray-900">{editingPkg ? 'Edit Package' : 'Create Package'}</h3>
                                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-900">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <form onSubmit={handleSave} className="p-6 space-y-5">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Package Name</label>
                                    <input
                                        required
                                        className="w-full h-12 bg-gray-50 focus:bg-white border-2 border-transparent focus:border-brand-500 rounded-xl px-4 font-semibold text-gray-900 outline-none transition"
                                        placeholder="Pro Plan"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Description</label>
                                    <textarea
                                        rows="2"
                                        className="w-full bg-gray-50 focus:bg-white border-2 border-transparent focus:border-brand-500 rounded-xl p-4 font-medium text-gray-700 outline-none transition resize-none"
                                        placeholder="e.g. Best for small businesses"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Monthly Price ($)</label>
                                    <input
                                        required
                                        type="number" step="0.01"
                                        className="w-full h-12 bg-gray-50 focus:bg-white border-2 border-transparent focus:border-brand-500 rounded-xl px-4 font-semibold text-gray-900 outline-none transition"
                                        placeholder="49.99"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Store Limit</label>
                                    <input
                                        type="number"
                                        className="w-full h-12 bg-gray-50 focus:bg-white border-2 border-transparent focus:border-brand-500 rounded-xl px-4 font-semibold text-gray-900 outline-none transition"
                                        placeholder="Leave blank for unlimited"
                                        value={formData.store_limit}
                                        onChange={e => setFormData({ ...formData, store_limit: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Status</label>
                                    <select
                                        className="w-full h-12 bg-gray-50 focus:bg-white border-2 border-transparent focus:border-brand-500 rounded-xl px-4 font-semibold text-gray-900 outline-none transition appearance-none"
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                                <div className="pt-4 flex gap-3">
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 h-12 rounded-xl font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 transition">
                                        Cancel
                                    </button>
                                    <button disabled={isSaving} type="submit" className="flex-[2] h-12 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/20 active:scale-[0.98] transition">
                                        {isSaving ? 'Saving...' : 'Save Package'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </ManagementLayout>
    );
}
