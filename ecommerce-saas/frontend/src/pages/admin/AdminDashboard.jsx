import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';
import { Banknote, ShoppingCart, TrendingUp, Package, LayoutGrid } from 'lucide-react';

export default function AdminDashboard() {
    const { storeId } = useParams();
    const [report, setReport] = useState({ 
        total_sales: 0, 
        total_orders: 0, 
        total_products: 0,
        total_categories: 0,
        recent_orders: [] 
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const res = await api.get(`/api/stores/${storeId}/dashboard`);
                setReport(res.data);
            } catch (err) {
                setError('Failed to fetch store dashboard data');
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [storeId]);

    const avgOrder = report.total_orders > 0 ? (report.total_sales / report.total_orders).toFixed(2) : 0;

    return (
        <AdminLayout
            title="Store Dashboard"
            description="Overview of your store's performance and inventory."
        >
            {error && (
                <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl font-medium border border-red-100">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex items-center justify-center p-20">
                    <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full"></div>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Revenue Card */}
                        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500">
                                <Banknote className="w-24 h-24 text-green-600" />
                            </div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-4">
                                    <Banknote className="w-6 h-6" />
                                </div>
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Gross Revenue</h3>
                                <div className="text-3xl font-black text-gray-900">
                                    ৳{parseFloat(report.total_sales).toFixed(2)}
                                </div>
                            </div>
                        </div>

                        {/* Orders Card */}
                        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500">
                                <ShoppingCart className="w-24 h-24 text-brand-600" />
                            </div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mb-4">
                                    <ShoppingCart className="w-6 h-6" />
                                </div>
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total Orders</h3>
                                <div className="text-3xl font-black text-gray-900">
                                    {report.total_orders}
                                </div>
                            </div>
                        </div>

                        {/* Products Card */}
                        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500">
                                <Package className="w-24 h-24 text-orange-600" />
                            </div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-4">
                                    <Package className="w-6 h-6" />
                                </div>
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total Products</h3>
                                <div className="text-3xl font-black text-gray-900">
                                    {report.total_products}
                                </div>
                            </div>
                        </div>

                        {/* Categories Card */}
                        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500">
                                <LayoutGrid className="w-24 h-24 text-blue-600" />
                            </div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                                    <LayoutGrid className="w-6 h-6" />
                                </div>
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total Categories</h3>
                                <div className="text-3xl font-black text-gray-900">
                                    {report.total_categories}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders List */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-black text-gray-900">Recent Orders</h2>
                                <p className="text-sm font-medium text-gray-500 mt-1">Latest 5 orders placed on your store</p>
                            </div>
                            <Link to={`/admin/${storeId}/orders`} className="text-sm font-bold text-brand-600 hover:text-brand-700 bg-brand-50 px-4 py-2 rounded-xl transition-colors">
                                View All
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50/50 text-gray-500 font-bold uppercase tracking-wider text-xs">
                                    <tr>
                                        <th className="px-6 py-4">Order ID</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Customer</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {report.recent_orders && report.recent_orders.length > 0 ? report.recent_orders.map(order => (
                                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-gray-900">#{order.id}</td>
                                            <td className="px-6 py-4 text-gray-500 font-medium">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-900">{order.customer_name}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider
                                                    ${order.payment_status === 'paid' ? 'bg-green-50 text-green-700' : 
                                                      order.payment_status === 'failed' ? 'bg-red-50 text-red-700' : 
                                                      'bg-orange-50 text-orange-700'}
                                                `}>
                                                    {order.payment_status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-black text-gray-900">
                                                ৳{parseFloat(order.total_amount).toFixed(2)}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-gray-500 font-medium">
                                                No recent orders found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
