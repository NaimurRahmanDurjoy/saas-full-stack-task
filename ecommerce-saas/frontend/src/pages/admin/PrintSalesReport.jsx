import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import { Banknote, ShoppingCart, TrendingUp } from 'lucide-react';

export default function PrintSalesReport() {
    const { storeId } = useParams();
    const [searchParams] = useSearchParams();
    const [report, setReport] = useState({ total_sales: 0, total_orders: 0, orders: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const startDate = searchParams.get('start_date') || '';
    const endDate = searchParams.get('end_date') || '';

    useEffect(() => {
        const fetchReport = async () => {
            try {
                let url = `/api/stores/${storeId}/sales-report`;
                if (searchParams.toString()) {
                    url += `?${searchParams.toString()}`;
                }

                const res = await api.get(url);
                setReport(res.data);
                
                // Trigger print once data is loaded and rendered
                // setTimeout(() => {
                //     window.print();
                // }, 1000);

            } catch (err) {
                setError('Failed to fetch store sales report');
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [storeId, searchParams]);

    const avgOrder = report.total_orders > 0 ? (report.total_sales / report.total_orders).toFixed(2) : 0;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="animate-spin w-10 h-10 border-4 border-gray-900 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (error) {
        return <div className="p-10 text-red-600 font-bold text-center bg-white min-h-screen">{error}</div>;
    }

    return (
        <div className="bg-white min-h-screen w-full p-8 font-sans text-black max-w-5xl mx-auto">
            <style>{`
                @media print {
                    @page { margin: 10mm; }
                    *, *::before, *::after {
                        background-attachment: scroll !important;
                        box-shadow: none !important;
                        text-shadow: none !important;
                        transition: none !important;
                        animation: none !important;
                    }
                    html, body, #root {
                        display: block !important;
                        position: relative !important;
                        height: max-content !important;
                        min-height: auto !important;
                        overflow: visible !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        background: white !important;
                        color: black !important;
                        float: none !important;
                        width: 100% !important;
                    }
                    .print\\:hidden { display: none !important; }
                }
            `}</style>
            {/* Header */}
            <div className="border-b-2 border-gray-900 pb-6 mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-gray-900 uppercase">Sales Report</h1>
                    <h2 className="text-xl font-bold text-gray-600 mt-1">{storeId}</h2>
                </div>
                <div className="text-right">
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Report Period</p>
                    <p className="text-base font-bold text-gray-900">
                        {startDate || 'Beginning'} <span className="text-gray-400 font-normal mx-1">to</span> {endDate || 'Present'}
                    </p>
                    <p className="text-xs font-medium text-gray-400 mt-2">Generated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-6 mb-10">
                <div className="border-2 border-gray-200 rounded-2xl p-6">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Banknote className="w-4 h-4" /> Gross Revenue
                    </h3>
                    <div className="text-3xl font-black text-gray-900">
                        ৳{parseFloat(report.total_sales).toFixed(2)}
                    </div>
                </div>
                <div className="border-2 border-gray-200 rounded-2xl p-6">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4" /> Total Orders
                    </h3>
                    <div className="text-3xl font-black text-gray-900">
                        {report.total_orders}
                    </div>
                </div>
                <div className="border-2 border-gray-200 rounded-2xl p-6">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" /> Avg Order Value
                    </h3>
                    <div className="text-3xl font-black text-gray-900">
                        ৳{avgOrder}
                    </div>
                </div>
            </div>

            {/* Detailed Table */}
            <div>
                <h3 className="text-lg font-black text-gray-900 mb-4">Detailed Transactions</h3>
                <table className="w-full text-left text-sm border-collapse">
                    <thead>
                        <tr className="border-b-2 border-gray-900">
                            <th className="py-3 px-2 font-bold text-gray-900 uppercase tracking-wider text-xs">Order ID</th>
                            <th className="py-3 px-2 font-bold text-gray-900 uppercase tracking-wider text-xs">Date</th>
                            <th className="py-3 px-2 font-bold text-gray-900 uppercase tracking-wider text-xs">Customer</th>
                            <th className="py-3 px-2 font-bold text-gray-900 uppercase tracking-wider text-xs">Status</th>
                            <th className="py-3 px-2 font-bold text-gray-900 uppercase tracking-wider text-xs text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-gray-100">
                        {report.orders && report.orders.length > 0 ? report.orders.map(order => (
                            <tr key={order.id} className="break-inside-avoid">
                                <td className="py-4 px-2 font-bold text-gray-900">#{order.id}</td>
                                <td className="py-4 px-2 text-gray-600 font-medium">
                                    {new Date(order.created_at).toLocaleDateString()}
                                </td>
                                <td className="py-4 px-2">
                                    <div className="font-bold text-gray-900">{order.customer_name}</div>
                                    <div className="text-gray-500 text-xs">{order.customer_phone}</div>
                                </td>
                                <td className="py-4 px-2">
                                    <span className="font-bold uppercase tracking-wider text-xs text-gray-700">
                                        {order.payment_status}
                                    </span>
                                </td>
                                <td className="py-4 px-2 text-right font-black text-gray-900">
                                    ৳{parseFloat(order.total_amount).toFixed(2)}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="py-12 text-center text-gray-500 font-bold">
                                    No sales found for the selected period.
                                </td>
                            </tr>
                        )}
                    </tbody>
                    <tfoot className="border-t-2 border-gray-900">
                        <tr>
                            <td colSpan="4" className="py-4 px-2 text-right font-bold text-gray-500 uppercase tracking-wider text-xs">Total Amount:</td>
                            <td className="py-4 px-2 text-right font-black text-gray-900 text-lg">৳{parseFloat(report.total_sales).toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* Footer */}
            <div className="mt-16 pt-6 border-t-2 border-gray-200 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                End of Report
            </div>
            
            {/* Print trigger instruction for non-auto print users */}
            <div className="fixed top-4 right-4 print:hidden">
                <button onClick={() => window.print()} className="bg-brand-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg">
                    Print Now
                </button>
            </div>
        </div>
    );
}
