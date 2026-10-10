import React, { useState, useEffect } from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, CreditCard, ChevronRight, Store, ArrowLeft } from 'lucide-react';
import api from '../../services/api';

const OrderSuccess = () => {
    const { storeSlug, orderId } = useParams();
    const location = useLocation();

    // Graceful zero-trust fallback dynamically purely handling state gracefully!
    const order = location.state?.order;
    const guestToken = location.state?.guestToken;

    const [channels, setChannels] = useState([]);
    const [selectedChannel, setSelectedChannel] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [amount, setAmount] = useState(order?.total_amount || '');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        if (order) {
            api.get(`/api/storefront/${storeSlug}/payment-channels`)
                .then(res => {
                    setChannels(res.data);
                    if (res.data.length > 0) setSelectedChannel(res.data[0].id);
                })
                .catch(console.error);
        }
    }, [storeSlug, order]);

    if (!order || !guestToken) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#fafafa] p-6">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center p-12 bg-white rounded-3xl shadow-xl border border-gray-100 max-w-md w-full">
                    <AlertCircle className="w-20 h-20 mx-auto mb-6 text-red-500" />
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">Invalid Session</h1>
                    <p className="text-gray-500 mb-8 font-medium">Please check your email for order tracking instructions.</p>
                    <Link to={`/${storeSlug}`} className="inline-flex items-center justify-center w-full h-14 rounded-2xl bg-gray-900 text-white font-bold hover:bg-emerald-600 transition shadow-lg">
                        Return to Store
                    </Link>
                </motion.div>
            </div>
        );
    }

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage('');

        try {
            const payload = {
                guest_token: guestToken,
                payment_channel_id: selectedChannel,
                amount: amount,
                transaction_id: transactionId
            };

            const res = await api.post(`/api/storefront/${storeSlug}/orders/${orderId}/payments`, payload);
            setMessage(res.data.message);
            setTransactionId('');
        } catch (err) {
            setError(err.response?.data?.errors?.transaction_id?.[0] || err.response?.data?.message || 'Payment submission failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] font-sans flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="w-full max-w-2xl bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden relative"
            >
                {/* Background Ambient Lights */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 blur-[80px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-50 blur-[80px] rounded-full pointer-events-none" />

                <div className="p-8 sm:p-12 relative z-10 text-center">
                    <motion.div 
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1 }} 
                        transition={{ type: 'spring', damping: 15 }}
                        className="w-24 h-24 mx-auto bg-emerald-50 rounded-full border border-emerald-100 flex items-center justify-center mb-6"
                    >
                        <CheckCircle className="w-12 h-12 text-emerald-500" />
                    </motion.div>
                    
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Order Confirmed!</h1>
                    <p className="text-gray-500 font-medium mb-8">Order #{order.id} • Total Amount: <span className="text-gray-900 font-black">৳{Number(order.total_amount).toFixed(2)}</span></p>

                    {message ? (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-emerald-50 border border-emerald-100 p-8 rounded-3xl text-center">
                            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-emerald-700 mb-2">{message}</h3>
                            <p className="text-emerald-600/80 mb-6 font-medium">Your payment validation request has been received.</p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Link to={`/${storeSlug}`} className="inline-flex items-center justify-center px-8 h-12 rounded-full bg-white border border-gray-200 text-gray-900 font-bold hover:bg-gray-50 transition shadow-sm">
                                    Continue Shopping
                                </Link>
                                <Link 
                                    to={`/${storeSlug}/orders/${order.id}/invoice`}
                                    state={{ order }}
                                    className="inline-flex items-center justify-center px-8 h-12 rounded-full bg-gray-900 text-white font-bold hover:bg-emerald-600 transition shadow-lg"
                                >
                                    Print Invoice
                                </Link>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="bg-gray-50 border border-gray-200 p-6 sm:p-8 rounded-3xl text-left shadow-inner">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-emerald-600" /> Submit Manual Payment
                            </h2>
                            
                            {error && (
                                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-medium text-sm flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handlePaymentSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest pl-2 mb-2">Payment Method</label>
                                    <div className="relative">
                                        <select
                                            value={selectedChannel}
                                            onChange={e => setSelectedChannel(e.target.value)}
                                            className="w-full h-14 bg-white focus:bg-white border border-gray-200 focus:border-emerald-500 rounded-2xl px-5 font-semibold text-gray-900 outline-none transition-all appearance-none cursor-pointer shadow-sm"
                                            required
                                        >
                                            <option value="" disabled>Select a method...</option>
                                            {channels.map(ch => (
                                                <option key={ch.id} value={ch.id}>{ch.name}</option>
                                            ))}
                                        </select>
                                        <ChevronRight className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
                                    </div>
                                    
                                    {selectedChannel && (
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-3 bg-white border border-gray-200 p-4 rounded-xl text-sm text-gray-600 font-medium leading-relaxed">
                                            {channels.find(c => c.id == selectedChannel)?.instructions || 'No instructions provided.'}
                                        </motion.div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest pl-2 mb-2">Transaction ID / Reference Number *</label>
                                    <input
                                        type="text"
                                        required
                                        value={transactionId}
                                        onChange={e => setTransactionId(e.target.value)}
                                        className="w-full h-14 bg-white border border-gray-200 focus:border-emerald-500 rounded-2xl px-5 font-semibold text-gray-900 outline-none transition-all placeholder-gray-400 shadow-sm"
                                        placeholder="e.g. TrxID-123456"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest pl-2 mb-2">Amount Paid *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={amount}
                                        onChange={e => setAmount(e.target.value)}
                                        className="w-full h-14 bg-gray-100 border border-gray-200 rounded-2xl px-5 font-semibold text-gray-500 outline-none cursor-not-allowed"
                                        disabled
                                    />
                                </div>

                                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                                    <button 
                                        type="submit" 
                                        disabled={loading} 
                                        className={`flex-1 flex items-center justify-center gap-2 h-14 rounded-2xl font-bold text-lg transition-all shadow-lg active:scale-[0.98] ${loading ? 'bg-gray-200 text-gray-400 cursor-wait border border-gray-200' : 'bg-gray-900 text-white hover:bg-emerald-600 cursor-pointer'}`}
                                    >
                                        {loading ? 'Submitting...' : 'Submit Payment Details'}
                                    </button>
                                    
                                    <Link 
                                        to={`/${storeSlug}/orders/${order.id}/invoice`}
                                        state={{ order }}
                                        className="sm:w-auto flex items-center justify-center px-6 h-14 rounded-2xl bg-white border border-gray-200 text-gray-900 font-bold hover:bg-gray-50 transition-colors shadow-sm"
                                    >
                                        Print Invoice (Pay Later)
                                    </Link>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default OrderSuccess;
