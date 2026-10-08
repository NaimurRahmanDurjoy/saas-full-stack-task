import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ManagementLayout from '../../components/management/ManagementLayout';
import { motion } from 'framer-motion';
import { Store, Package, CreditCard, TrendingUp, Activity, CheckCircle, XCircle } from 'lucide-react';

const ManagementDashboard = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const res = await api.get('/api/admin/subscription-payments');
            setPayments(res.data);
        } catch (err) {
            setError('Unauthorized or Failed to fetch payments.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (paymentId, status) => {
        try {
            await api.post(`/api/admin/subscription-payments/${paymentId}/verify`, { status });
            fetchPayments();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const metrics = [
        { title: 'Tenant Stores', icon: Store, color: 'text-blue-500', bg: 'bg-blue-50', link: '/admin/stores', desc: 'Manage active/inactive tenants' },
        { title: 'SaaS Packages', icon: Package, color: 'text-purple-500', bg: 'bg-purple-50', link: '/admin/packages', desc: 'Configure pricing & tier limits' },
        { title: 'Payment Gateways', icon: CreditCard, color: 'text-green-500', bg: 'bg-green-50', link: '/admin/payment-channels', desc: 'Global platform payment settings' },
        { title: 'Global Reports', icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-50', link: '/admin/sales-reports', desc: 'Platform-wide sales metrics' },
    ];

    return (
        <ManagementLayout
            title="System Dashboard"
            description="Global oversight and subscription management for the Cartessa platform."
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {metrics.map((metric, idx) => {
                    const Icon = metric.icon;
                    return (
                        <Link key={idx} to={metric.link} className="block group">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                                className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
                            >
                                <div className={`w-14 h-14 rounded-2xl ${metric.bg} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
                                    <Icon className={`w-6 h-6 ${metric.color}`} />
                                </div>
                                <h3 className="font-extrabold text-gray-900 text-lg mb-1 tracking-tight">{metric.title}</h3>
                                <p className="text-gray-500 text-sm font-medium">{metric.desc}</p>
                            </motion.div>
                        </Link>
                    );
                })}
            </div>

            <div className="bg-white border border-gray-100 rounded-[2rem] shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100/60 bg-gray-50/30 flex items-center justify-between">
                    <h2 className="font-extrabold text-gray-900 text-lg">Pending Subscription Verifications</h2>
                </div>

                {error && (
                    <div className="p-6 text-red-500 bg-red-50 border-b border-red-100 font-medium">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="p-16 text-center text-gray-400 font-bold flex flex-col items-center">
                        <Activity className="w-8 h-8 text-gray-300 animate-spin mb-4" />
                        Loading pending verifications...
                    </div>
                ) : (
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase font-extrabold tracking-wider text-gray-400">
                                <tr>
                                    <th className="px-6 py-5">Tenant Store</th>
                                    <th className="px-6 py-5">Payment Method</th>
                                    <th className="px-6 py-5 whitespace-nowrap">Amount Billed</th>
                                    <th className="px-6 py-5">Transaction ID</th>
                                    <th className="px-6 py-5 text-center">Status</th>
                                    <th className="px-6 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {payments.map(payment => (
                                    <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="font-bold text-gray-900">{payment.subscription?.store?.name}</div>
                                        </td>
                                        <td className="px-6 py-5 text-gray-500 font-medium">
                                            {payment.payment_channel?.name}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="font-black text-gray-900 text-lg">${payment.amount}</div>
                                        </td>
                                        <td className="px-6 py-5 font-mono text-xs text-brand-600 bg-brand-50 p-2 rounded-lg inline-block mt-3">
                                            {payment.transaction_id}
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${payment.status === 'verified' ? 'bg-green-50 text-green-700' :
                                                    payment.status === 'rejected' ? 'bg-red-50 text-red-700' : 'bg-orange-50 text-orange-700'
                                                }`}>
                                                {payment.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            {payment.status === 'pending' && (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleVerify(payment.id, 'verified')}
                                                        className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 font-bold text-xs rounded-lg transition"
                                                    >
                                                        <CheckCircle className="w-3.5 h-3.5" /> Verify
                                                    </button>
                                                    <button
                                                        onClick={() => handleVerify(payment.id, 'rejected')}
                                                        className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 font-bold text-xs rounded-lg transition"
                                                    >
                                                        <XCircle className="w-3.5 h-3.5" /> Reject
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {payments.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-16 text-center text-gray-500 font-medium">
                                            <CheckCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                                            No pending payments to verify. You're all caught up!
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
};

export default ManagementDashboard;
