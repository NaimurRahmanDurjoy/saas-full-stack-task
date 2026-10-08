import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import ManagementLayout from '../../components/management/ManagementLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Activity, Search, ExternalLink, Calendar, CreditCard, Tag } from 'lucide-react';

export default function ManagementOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/api/admin/orders');
                setOrders(res.data);
            } catch (err) {
                console.error('Failed to fetch orders', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const filteredOrders = orders.filter(order =>
        order.id.toString().includes(searchQuery) ||
        order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.store?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <ManagementLayout
            title="Global Orders"
            description="View all orders across all registered SaaS tenant stores in one unified dashboard."
        >
            <div className="bg-white border flex flex-col border-gray-100 rounded-[2rem] shadow-sm overflow-hidden mb-8">
                <div className="p-6 border-b border-gray-100/60 bg-gray-50/30 flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by Order ID, Customer, or Store..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full h-12 pl-12 pr-4 bg-white border border-gray-200 focus:border-brand-500 rounded-xl font-medium text-sm outline-none transition shadow-sm"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="p-16 text-center text-gray-400 font-bold flex flex-col items-center">
                        <Activity className="w-8 h-8 text-gray-300 animate-spin mb-4" />
                        Loading global transactions...
                    </div>
                ) : (
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase font-extrabold tracking-wider text-gray-400">
                                <tr>
                                    <th className="px-6 py-5">Order ID</th>
                                    <th className="px-6 py-5">Assigned Store</th>
                                    <th className="px-6 py-5">Customer Profile</th>
                                    <th className="px-6 py-5">Date</th>
                                    <th className="px-6 py-5 whitespace-nowrap">Total Value</th>
                                    <th className="px-6 py-5 text-center">Status</th>
                                    <th className="px-6 py-5 text-right">Invoice</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                <AnimatePresence>
                                    {filteredOrders.map((order, idx) => (
                                        <motion.tr
                                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: idx * 0.02 }}
                                            key={order.id} className="hover:bg-gray-50/50 transition-colors group"
                                        >
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                                                        #{order.id.toString().padStart(4, '0')}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2">
                                                    <Tag className="w-4 h-4 text-gray-400" />
                                                    <span className="font-bold text-gray-700">{order.store?.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="font-bold text-gray-900">{order.customer_name}</div>
                                                <div className="text-xs text-gray-400">{order.customer_email || 'No email provided'}</div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2 text-gray-500 font-medium">
                                                    <Calendar className="w-4 h-4 text-gray-300" />
                                                    {new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2 font-black text-gray-900">
                                                    <CreditCard className="w-4 h-4 text-gray-400" />
                                                    ${Number(order.total_amount).toFixed(2)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${order.status === 'completed' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <Link
                                                    to={`/invoices/${order.id}`}
                                                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </Link>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>

                                {filteredOrders.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-16 text-center text-gray-500 font-medium">
                                            <ShoppingCart className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                                            No global orders found matching your criteria.
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
