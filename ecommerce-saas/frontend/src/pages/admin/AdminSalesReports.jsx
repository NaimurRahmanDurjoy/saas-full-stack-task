import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';
import { Banknote, ShoppingCart, TrendingUp, Calendar, Printer, Filter } from 'lucide-react';

export default function AdminSalesReports() {
    const { storeId } = useParams();
    const [report, setReport] = useState({ total_sales: 0, total_orders: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const fetchReport = async () => {
        setLoading(true);
        try {
            let url = `/api/stores/${storeId}/sales-report`;
            const params = new URLSearchParams();
            if (startDate) params.append('start_date', startDate);
            if (endDate) params.append('end_date', endDate);
            
            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const res = await api.get(url);
            setReport(res.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch store sales report');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, [storeId]);

    const handlePrint = () => {
        const params = new URLSearchParams();
        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);
        
        const url = `/admin/${storeId}/sales-reports/print?${params.toString()}`;
        window.open(url, '_blank');
    };

    const avgOrder = report.total_orders > 0 ? (report.total_sales / report.total_orders).toFixed(2) : 0;

    return (
        <AdminLayout
            title="Sales Report"
            description="Track your store's performance and revenue over time."
            headerAction={
                <button 
                    onClick={handlePrint}
                    className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-black transition-colors font-medium print:hidden shadow-sm"
                >
                    <Printer className="w-4 h-4" />
                    Print Report
                </button>
            }
        >
            {/* Print Header - Only visible when printing */}
            <div className="hidden print:block mb-8 border-b pb-4">
                <h1 className="text-3xl font-black text-gray-900">Sales Report: {storeId}</h1>
                <p className="text-gray-500 mt-2">
                    Period: {startDate || 'Beginning'} to {endDate || 'Present'}
                </p>
                <p className="text-gray-500 text-sm">Generated on: {new Date().toLocaleDateString()}</p>
            </div>

            <div className="print:hidden bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-8 flex flex-col sm:flex-row items-end gap-4">
                <div className="flex-1 w-full">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Start Date</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="date" 
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-500 outline-none text-sm font-medium"
                        />
                    </div>
                </div>
                <div className="flex-1 w-full">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">End Date</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="date" 
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-500 outline-none text-sm font-medium"
                        />
                    </div>
                </div>
                <button 
                    onClick={fetchReport}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-50 text-brand-600 px-6 py-2.5 rounded-xl hover:bg-brand-100 transition-colors font-bold"
                >
                    <Filter className="w-4 h-4" />
                    Filter Results
                </button>
            </div>

            {error && (
                <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl font-medium border border-red-100 print:hidden">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex items-center justify-center p-20 print:hidden">
                    <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Revenue Card */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group print:shadow-none print:border-gray-300">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500 print:hidden">
                            <Banknote className="w-24 h-24 text-green-600" />
                        </div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-4 print:bg-transparent print:p-0 print:w-auto print:h-auto">
                                <Banknote className="w-6 h-6 print:w-8 print:h-8" />
                            </div>
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Gross Revenue</h3>
                            <div className="text-3xl font-black text-gray-900">
                                ৳{parseFloat(report.total_sales).toFixed(2)}
                            </div>
                        </div>
                    </div>

                    {/* Orders Card */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group print:shadow-none print:border-gray-300">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500 print:hidden">
                            <ShoppingCart className="w-24 h-24 text-brand-600" />
                        </div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mb-4 print:bg-transparent print:p-0 print:w-auto print:h-auto">
                                <ShoppingCart className="w-6 h-6 print:w-8 print:h-8" />
                            </div>
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Total Orders</h3>
                            <div className="text-3xl font-black text-gray-900">
                                {report.total_orders}
                            </div>
                        </div>
                    </div>

                    {/* AOV Card */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group print:shadow-none print:border-gray-300">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500 print:hidden">
                            <TrendingUp className="w-24 h-24 text-purple-600" />
                        </div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-4 print:bg-transparent print:p-0 print:w-auto print:h-auto">
                                <TrendingUp className="w-6 h-6 print:w-8 print:h-8" />
                            </div>
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Avg Order Value</h3>
                            <div className="text-3xl font-black text-gray-900">
                                ৳{avgOrder}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Detailed Table for Print & View */}
            {!loading && report.orders && (
                <div className="mt-8 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden print:overflow-visible print:shadow-none print:border-none print:mt-12">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50 print:bg-transparent print:border-b-2 print:border-gray-900 print:px-0">
                        <h2 className="text-lg font-black text-gray-900">Detailed Sales List</h2>
                        <p className="text-sm font-medium text-gray-500 mt-1">Breakdown of all transactions within the selected period.</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50/50 text-gray-500 font-bold uppercase tracking-wider text-xs print:bg-transparent print:text-gray-900 print:border-b-2 print:border-gray-900">
                                <tr>
                                    <th className="px-6 py-4 print:px-2 print:py-3">Order ID</th>
                                    <th className="px-6 py-4 print:px-2 print:py-3">Date</th>
                                    <th className="px-6 py-4 print:px-2 print:py-3">Customer Info</th>
                                    <th className="px-6 py-4 print:px-2 print:py-3">Payment Status</th>
                                    <th className="px-6 py-4 text-right print:px-2 print:py-3">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {report.orders.length > 0 ? report.orders.map(order => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group print:hover:bg-transparent print:break-inside-avoid">
                                        <td className="px-6 py-4 font-bold text-gray-900 print:px-2">#{order.id}</td>
                                        <td className="px-6 py-4 text-gray-500 font-medium print:px-2">
                                            {new Date(order.created_at).toLocaleDateString()} <br className="hidden print:block" />
                                            <span className="text-xs text-gray-400 print:text-gray-500">{new Date(order.created_at).toLocaleTimeString()}</span>
                                        </td>
                                        <td className="px-6 py-4 print:px-2">
                                            <div className="font-bold text-gray-900">{order.customer_name}</div>
                                            <div className="text-gray-500 text-xs">{order.customer_phone}</div>
                                        </td>
                                        <td className="px-6 py-4 print:px-2">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider print:p-0 print:bg-transparent
                                                ${order.payment_status === 'paid' ? 'bg-green-50 text-green-700 print:text-gray-900' : 
                                                  order.payment_status === 'failed' ? 'bg-red-50 text-red-700 print:text-gray-900' : 
                                                  'bg-orange-50 text-orange-700 print:text-gray-900'}
                                            `}>
                                                {order.payment_status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-black text-gray-900 print:px-2">
                                            ৳{parseFloat(order.total_amount).toFixed(2)}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500 font-medium print:py-8">
                                            No sales found for the selected period.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot className="bg-gray-50/50 font-black text-gray-900 border-t-2 border-gray-100 print:bg-transparent print:border-t-2 print:border-gray-900">
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-right print:px-2">Total Sales:</td>
                                    <td className="px-6 py-4 text-right print:px-2">৳{parseFloat(report.total_sales).toFixed(2)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
