import { useState, useEffect } from 'react';
import api from '../../services/api';
import ManagementLayout from '../../components/management/ManagementLayout';
import { motion } from 'framer-motion';
import { Store, Activity, Power, PowerOff, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManagementStores() {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStores();
    }, []);

    const fetchStores = async () => {
        try {
            const res = await api.get('/api/admin/stores');
            setStores(res.data);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to load stores');
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (store) => {
        const toggleToast = toast.loading('Updating store status...', { className: 'font-medium' });
        try {
            const newStatus = store.status === 'active' ? 'inactive' : 'active';
            await api.patch(`/api/admin/stores/${store.id}/status`, {
                status: newStatus
            });
            toast.success(`Store marked as ${newStatus}`, { id: toggleToast });
            fetchStores();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed', { id: toggleToast });
        }
    };

    return (
        <ManagementLayout
            title="Tenant Management"
            description="Manage all active and inactive multi-tenant store instances directly."
        >
            <div className="bg-white border border-gray-100 rounded-[2rem] shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-400 font-bold flex flex-col items-center">
                        <Activity className="w-8 h-8 text-gray-300 animate-spin mb-4" />
                        Loading tenants...
                    </div>
                ) : (
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase font-extrabold tracking-wider text-gray-400">
                                <tr>
                                    <th className="px-6 py-5">Tenant ID & Name</th>
                                    <th className="px-6 py-5">Assigned Owner</th>
                                    <th className="px-6 py-5">Store Slug</th>
                                    <th className="px-6 py-5 text-center">Status</th>
                                    <th className="px-6 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {stores.map(store => (
                                    <motion.tr layout key={store.id} className="hover:bg-gray-50/30 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0">
                                                    <Store className="w-4 h-4 text-gray-400 group-hover:text-brand-500 transition-colors" />
                                                </div>
                                                <div>
                                                    <div className="font-extrabold text-gray-900 text-base">{store.name}</div>
                                                    <div className="text-xs text-gray-400 mt-0.5">ID: {store.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="inline-flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                                <ShieldCheck className="w-4 h-4 text-brand-500" />
                                                <span className="font-bold text-gray-700">{store.user?.name || `User #${store.user_id}`}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 font-mono text-xs text-gray-500">
                                            {store.slug}
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${store.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                {store.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button
                                                onClick={() => toggleStatus(store)}
                                                className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${store.status === 'active'
                                                        ? 'bg-white border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100 focus:ring-red-500'
                                                        : 'bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500 shadow-brand-500/25'
                                                    }`}
                                            >
                                                {store.status === 'active' ? <PowerOff className="w-3.5 h-3.5" /> : <Power className="w-3.5 h-3.5" />}
                                                {store.status === 'active' ? 'Deactivate' : 'Activate'}
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}

                                {stores.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-16 text-center text-gray-500 font-medium">
                                            <div className="flex flex-col items-center gap-3">
                                                <Store className="w-10 h-10 text-gray-300" />
                                                No tenant stores registered yet.
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </ManagementLayout>
    );
}
