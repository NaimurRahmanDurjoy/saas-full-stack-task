import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Package, CheckCircle, Clock, ShieldAlert } from 'lucide-react';
import api from '../../services/api';

export default function TrackOrder() {
    const { storeSlug } = useParams();
    const [orderId, setOrderId] = useState('');
    const [contact, setContact] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [orders, setOrders] = useState(null);

    const handleTrack = async (e) => {
        e.preventDefault();
        if (!contact.trim()) {
            setError('Please provide an email or phone number.');
            return;
        }

        setLoading(true);
        setError('');
        setOrders(null);
        
        try {
            const cleanId = orderId ? orderId.replace(/\D/g, '') : ''; 
            const res = await api.post(`/api/storefront/${storeSlug}/track-order`, {
                order_id: cleanId,
                contact: contact.trim()
            });
            setOrders(res.data.orders);
        } catch (err) {
            setError(err.response?.data?.message || 'Could not track order. Please check your details.');
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { key: 'pending', label: 'Order Placed', icon: Clock },
        { key: 'processing', label: 'Processing', icon: Package },
        { key: 'completed', label: 'Delivered', icon: CheckCircle }
    ];

    const getActiveStep = (status) => {
        if (status === 'completed' || status === 'paid') return 2;
        if (status === 'processing') return 1;
        return 0; // pending or cancelled
    };

    return (
        <div className="min-h-screen print:h-auto print:bg-white bg-[#fafafa] font-sans selection:bg-emerald-500 selection:text-white pb-24 print:pb-0 text-gray-900">
            <main className="max-w-4xl mx-auto px-6 py-12 lg:py-16 print:p-0 print:m-0 print:max-w-none">
                
                <div className="mb-12 text-center print:hidden">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
                        Track Your Order
                    </h1>
                    <p className="text-gray-500 font-medium">Enter your email or phone number to see real-time updates.</p>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-12 relative z-20 print:border-none print:shadow-none print:bg-transparent">
                    <div className="p-8 md:p-10 bg-gray-50/50 border-b border-gray-100 print:hidden">
                        <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4 max-w-3xl mx-auto">
                            <div className="flex-[2]">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Email or Phone <span className="text-red-500">*</span></label>
                                <input 
                                    type="text" 
                                    required
                                    placeholder="Used during checkout"
                                    value={contact}
                                    onChange={e => setContact(e.target.value)}
                                    className="w-full h-14 bg-white border border-gray-200 focus:border-emerald-500 rounded-2xl px-5 font-semibold text-gray-900 outline-none transition-all shadow-sm"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Order ID (Optional)</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. 00012"
                                    value={orderId}
                                    onChange={e => setOrderId(e.target.value)}
                                    className="w-full h-14 bg-white border border-gray-200 focus:border-emerald-500 rounded-2xl px-5 font-semibold text-gray-900 outline-none transition-all shadow-sm"
                                />
                            </div>
                            <div className="flex items-end">
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="h-14 px-8 bg-gray-900 text-white font-bold rounded-2xl hover:bg-emerald-600 transition-all shadow-lg active:scale-95 disabled:opacity-70 flex items-center gap-2"
                                >
                                    {loading ? 'Searching...' : <><Search className="w-5 h-5"/> Track</>}
                                </button>
                            </div>
                        </form>

                        <AnimatePresence>
                            {error && (
                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-6 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-medium text-sm flex items-center justify-center gap-2 max-w-2xl mx-auto">
                                    <ShieldAlert className="w-5 h-5" /> {error}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {orders && orders.length > 0 && (
                        <div className="p-8 md:p-10 space-y-12 bg-white print:p-0">
                            {orders.map((order, index) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    transition={{ delay: index * 0.1 }}
                                    key={order.id} 
                                    className="pt-10 first:pt-0 border-t border-gray-100 first:border-0 print:border-none print:pt-0"
                                >
                                    <div className="print:hidden">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                                            <div>
                                                <h2 className="text-2xl font-black tracking-tight text-gray-900">Order #{order.id.toString().padStart(5, '0')}</h2>
                                                <p className="text-gray-500 font-medium text-sm mt-1">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                                            </div>
                                            <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
                                                order.status === 'completed' || order.status === 'paid' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                                                order.status === 'processing' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                                                order.status === 'cancelled' ? 'bg-red-50 text-red-600 border border-red-200' :
                                                'bg-amber-50 text-amber-600 border border-amber-200'
                                            }`}>
                                                {order.status}
                                            </div>
                                        </div>

                                        {order.status === 'cancelled' ? (
                                            <div className="text-center py-10 bg-red-50 rounded-2xl border border-red-100 mb-8">
                                                <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
                                                <h3 className="text-xl font-bold text-red-700 mb-2">Order Cancelled</h3>
                                                <p className="text-red-600/80 font-medium text-sm">This order has been cancelled and will not be fulfilled.</p>
                                            </div>
                                        ) : (
                                            <div className="mb-12 relative max-w-2xl mx-auto px-4">
                                                <div className="absolute top-5 left-8 right-8 h-1 bg-gray-100 -translate-y-1/2 rounded-full z-0" />
                                                <div className="absolute top-5 left-8 h-1 bg-emerald-500 -translate-y-1/2 rounded-full z-0 transition-all duration-1000" style={{ width: `calc(${(getActiveStep(order.status) / (steps.length - 1)) * 100}% - 4rem)` }} />
                                                
                                                <div className="relative z-10 flex justify-between">
                                                    {steps.map((step, idx) => {
                                                        const isActive = idx <= getActiveStep(order.status);
                                                        const Icon = step.icon;
                                                        return (
                                                            <div key={step.key} className="flex flex-col items-center gap-3">
                                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 shadow-sm border-[3px] bg-white ${isActive ? 'text-emerald-500 border-emerald-500' : 'text-gray-300 border-gray-200'}`}>
                                                                    <Icon className="w-4 h-4" />
                                                                </div>
                                                                <span className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? 'text-emerald-700' : 'text-gray-400'}`}>
                                                                    {step.label}
                                                                </span>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                                <div className="flex items-center gap-2 mb-4 text-gray-500 font-bold uppercase tracking-widest text-xs">
                                                    <MapPin className="w-4 h-4" /> Shipping Address
                                                </div>
                                                <p className="font-semibold text-gray-900">{order.customer_name}</p>
                                                <p className="text-gray-500 mt-1 text-sm">{order.shipping_address}</p>
                                                <p className="text-gray-500 mt-1 text-sm">{order.customer_phone}</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                                <div className="flex items-center gap-2 mb-4 text-gray-500 font-bold uppercase tracking-widest text-xs">
                                                    <Package className="w-4 h-4" /> Order Summary
                                                </div>
                                                <div className="space-y-2 mb-4">
                                                    {order.orderItems?.map(item => (
                                                        <div key={item.id} className="flex justify-between items-center text-sm font-medium">
                                                            <span className="text-gray-600 line-clamp-1">{item.quantity}x {item.productVariant?.product?.name}</span>
                                                            <span className="text-gray-900 font-bold shrink-0">৳{(item.unit_price * item.quantity).toFixed(0)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                                                    <span className="font-bold text-gray-500 text-sm uppercase tracking-widest">Total Paid</span>
                                                    <span className="font-black text-xl text-gray-900">৳{Number(order.total_amount).toFixed(0)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {order.payments?.length > 0 && (
                                            <div className="mt-6 bg-emerald-50/50 rounded-2xl p-5 border border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                                                <div className="text-sm">
                                                    <span className="text-emerald-800 font-bold mr-2">Payment: {order.payments[0].paymentChannel?.name}</span>
                                                    <span className="text-emerald-600 font-medium">TrxID: <span className="bg-white px-1.5 py-0.5 rounded shadow-sm ml-1 text-gray-900 font-mono text-xs">{order.payments[0].transaction_id}</span></span>
                                                </div>
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                                    <CheckCircle className="w-3 h-3" /> {order.payments[0].status}
                                                </div>
                                            </div>
                                        )}

                                        <div className="mt-8 flex justify-end">
                                            <Link 
                                                to={`/${storeSlug}/orders/${order.id}/invoice`}
                                                state={{ order }}
                                                className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors shadow-lg flex items-center gap-2 text-sm"
                                            >
                                                Print Invoice
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
