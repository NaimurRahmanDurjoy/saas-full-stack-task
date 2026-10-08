import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';
import { DollarSign, ShoppingCart, TrendingUp, ArrowLeft } from 'lucide-react';

export default function AdminSalesReports() {
    const { storeId } = useParams();
    const [report, setReport] = useState({ total_sales: 0, total_orders: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const res = await api.get(`/api/stores/${storeId}/sales-report`);
                setReport(res.data);
            } catch (err) {
                setError('Failed to fetch store sales report');
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [storeId]);

    const avgOrder = report.total_orders > 0 ? (report.total_sales / report.total_orders).toFixed(2) : 0;

    return (
        <AdminLayout
            title="Sales Analytics"
            description="Track your store's performance and revenue over time."
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Revenue Card */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500">
                            <DollarSign className="w-24 h-24 text-green-600" />
                        </div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-4">
                                <DollarSign className="w-6 h-6" />
                            </div>
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Gross Revenue</h3>
                            <div className="text-3xl font-black text-gray-900">
                                ${parseFloat(report.total_sales).toFixed(2)}
                            </div>
                        </div>
                    </div>

                    {/* Orders Card */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500">
                            <ShoppingCart className="w-24 h-24 text-brand-600" />
                        </div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mb-4">
                                <ShoppingCart className="w-6 h-6" />
                            </div>
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Total Orders</h3>
                            <div className="text-3xl font-black text-gray-900">
                                {report.total_orders}
                            </div>
                        </div>
                    </div>

                    {/* AOV Card */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500">
                            <TrendingUp className="w-24 h-24 text-purple-600" />
                        </div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Avg Order Value</h3>
                            <div className="text-3xl font-black text-gray-900">
                                ${avgOrder}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
