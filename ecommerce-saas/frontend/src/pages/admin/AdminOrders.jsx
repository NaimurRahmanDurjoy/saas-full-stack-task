import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';
import { ShoppingCart, Eye, Search, Filter, CheckCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminOrders() {
    const { storeId } = useParams();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [statusValue, setStatusValue] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get(`/api/stores/${storeId}/orders`);
                setOrders(res.data);
            } catch (err) {
                setError('Failed to fetch store orders');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [storeId]);

    const openModal = (order) => {
        setSelectedOrder(order);
        setStatusValue(order.status);
        setIsModalOpen(true);
    };

    const handleUpdateStatus = async () => {
        if (!selectedOrder) return;
        try {
            const toastId = toast.loading('Updating status...');
            await api.patch(`/api/stores/${storeId}/orders/${selectedOrder.id}/status`, { status: statusValue });
            
            // Update local state
            setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, status: statusValue } : o));
            
            toast.success('Order status updated!', { id: toastId });
            setIsModalOpen(false);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update status');
        }
    };

    return (
        <AdminLayout
            title="Store Orders"
            description="Manage and fulfill customer orders."
        >
            <div className="bg-white border border-gray-100 shadow-sm rounded-3xl overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-64">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input 
                                type="text"
                                placeholder="Search orders..."
                                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                            />
                        </div>
                        <button className="p-2 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-12 text-center">
                            <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full mx-auto"></div>
                        </div>
                    ) : error ? (
                        <div className="p-12 text-center text-red-500">{error}</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Order ID</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Customer</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Date</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Total</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {orders.map(order => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-gray-900">#{order.id.toString().padStart(5, '0')}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{order.customer_name}</div>
                                            <div className="text-xs text-gray-500">{order.customer_email || 'No email'}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-gray-900">৳{parseFloat(order.total_amount).toFixed(2)}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                                                order.status === 'completed' || order.status === 'paid' ? 'bg-green-50 text-green-600' :
                                                order.status === 'processing' ? 'bg-blue-50 text-blue-600' :
                                                order.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                                                'bg-gray-100 text-gray-600'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <Link 
                                                to={`/admin/${storeId}/invoices/${order.id}`} 
                                                className="inline-flex items-center justify-center p-2 text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-xl transition-colors tooltip mr-2"
                                                title="View Invoice"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                            <button 
                                                onClick={() => openModal(order)}
                                                className="inline-flex items-center justify-center p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors tooltip"
                                                title="Update Status"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {orders.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center">
                                            <ShoppingCart className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                                            <h3 className="text-lg font-bold text-gray-900 mb-1">No Orders Yet</h3>
                                            <p className="text-gray-500">When customers place orders, they will appear here.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Manage Status Modal */}
            {isModalOpen && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-bold text-lg text-gray-900">Manage Order #{selectedOrder.id.toString().padStart(5, '0')}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 transition-colors bg-white border border-gray-200 p-1.5 rounded-full shadow-sm"><X className="w-4 h-4"/></button>
                        </div>
                        <div className="p-6">
                            <div className="mb-6 bg-gray-50 p-5 rounded-2xl border border-gray-100 shadow-inner">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Payment Information</h4>
                                {selectedOrder.payments && selectedOrder.payments.length > 0 ? (
                                    selectedOrder.payments.map(p => (
                                        <div key={p.id} className="text-sm text-gray-700 space-y-1.5 mb-3 last:mb-0 pb-3 last:pb-0 border-b border-gray-200/50 last:border-0">
                                            <div className="flex justify-between">
                                                <span className="font-medium text-gray-500">Method:</span> 
                                                <span className="font-bold">{p.payment_channel?.name}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium text-gray-500">TrxID:</span> 
                                                <span className="font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200 shadow-sm">{p.transaction_id}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium text-gray-500">Amount:</span> 
                                                <span className="font-bold text-emerald-600">৳{p.amount}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-sm text-red-500 font-bold flex items-center gap-2">
                                        No payment submitted yet.
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Update Status</label>
                                <select
                                    value={statusValue}
                                    onChange={(e) => setStatusValue(e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none shadow-sm cursor-pointer"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="completed">Completed (Verify Payment)</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div className="mt-8">
                                <button 
                                    onClick={handleUpdateStatus}
                                    className="w-full py-3.5 bg-gray-900 text-white font-bold text-sm rounded-xl hover:bg-brand-600 transition-all shadow-lg active:scale-[0.98]"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
