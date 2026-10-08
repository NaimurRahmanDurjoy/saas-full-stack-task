import { useState, useEffect } from 'react';
import api from '../../services/api';
import ManagementLayout from '../../components/management/ManagementLayout';
import { motion } from 'framer-motion';
import { TrendingUp, ShoppingBag, CreditCard, Activity } from 'lucide-react';

export default function ManagementSalesReports() {
    const [report, setReport] = useState({ total_sales: 0, total_orders: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const res = await api.get('/api/admin/sales-report');
                setReport(res.data);
            } catch (err) {
                setError('Failed to fetch global sales report');
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, []);

    const avgOrder = report.total_orders > 0 ? (report.total_sales / report.total_orders).toFixed(2) : 0;

    return (
        <ManagementLayout
            title="Global Sales Report"
            description="High-level overview of cross-tenant sales metrics and revenue performance across the platform."
        >
            {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-medium text-sm flex items-center gap-3">
                    {error}
                </motion.div>
            )}

            {loading ? (
                <div className="p-16 text-center text-gray-400 font-bold flex flex-col items-center">
                    <Activity className="w-8 h-8 text-gray-300 animate-spin mb-4" />
                    Calculating platform metrics...
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm flex flex-col group hover:shadow-xl hover:-translate-y-1 transition-all"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-sm font-extrabold text-gray-500 uppercase tracking-widest">Global Revenue</h3>
                            <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center transition-transform group-hover:scale-110">
                                <TrendingUp className="w-6 h-6 text-brand-600" />
                            </div>
                        </div>
                        <div className="mt-auto">
                            <span className="text-5xl font-black text-gray-900 tracking-tighter">${parseFloat(report.total_sales).toFixed(2)}</span>
                            <div className="mt-2 text-sm font-medium text-brand-600 bg-brand-50 inline-block px-3 py-1 rounded-lg">Gross Volume</div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm flex flex-col group hover:shadow-xl hover:-translate-y-1 transition-all"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-sm font-extrabold text-gray-500 uppercase tracking-widest">Total Orders</h3>
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center transition-transform group-hover:scale-110">
                                <ShoppingBag className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                        <div className="mt-auto">
                            <span className="text-5xl font-black text-gray-900 tracking-tighter">{report.total_orders}</span>
                            <div className="mt-2 text-sm font-medium text-blue-600 bg-blue-50 inline-block px-3 py-1 rounded-lg">Completed Transactions</div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm flex flex-col group hover:shadow-xl hover:-translate-y-1 transition-all"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-sm font-extrabold text-gray-500 uppercase tracking-widest">Avg Order Value</h3>
                            <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center transition-transform group-hover:scale-110">
                                <CreditCard className="w-6 h-6 text-orange-600" />
                            </div>
                        </div>
                        <div className="mt-auto">
                            <span className="text-5xl font-black text-gray-900 tracking-tighter">${avgOrder}</span>
                            <div className="mt-2 text-sm font-medium text-orange-600 bg-orange-50 inline-block px-3 py-1 rounded-lg">Per Transaction</div>
                        </div>
                    </motion.div>
                </div>
            )}
        </ManagementLayout>
    );
}
