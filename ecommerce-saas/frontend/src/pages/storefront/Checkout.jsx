import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { ShieldCheck, ArrowLeft, CreditCard, Lock, Package, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Checkout = () => {
    const { storeSlug } = useParams();
    const { cart, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        shipping_address: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (cart.length === 0) return;
        setLoading(true);
        setError(null);

        const checkoutToast = toast.loading('Processing your secure order...', { className: 'font-medium' });

        try {
            const items = cart.map(item => ({
                variant_id: item.variant.id,
                quantity: item.quantity
            }));

            const payload = { ...form, items };
            const response = await api.post(`/api/storefront/${storeSlug}/checkout`, payload);

            toast.success('Order placed successfully!', { id: checkoutToast });
            clearCart();

            navigate(`/${storeSlug}/orders/${response.data.order.id}/success`, {
                state: {
                    order: response.data.order,
                    guestToken: response.data.guest_token
                }
            });
        } catch (err) {
            const errMsg = err.response?.data?.message || 'Error processing checkout.';
            setError(errMsg);
            toast.error(errMsg, { id: checkoutToast });
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 font-sans flex items-center justify-center p-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm max-w-lg w-full">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package className="w-8 h-8 text-gray-300" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Cart is empty</h2>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">You have no items to checkout. Proceed back to the store to add items.</p>
                    <Link to={`/${storeSlug}`} className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-brand-600 text-white font-bold hover:bg-brand-700 transition">
                        Return to Store
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-brand-500 selection:text-white pb-24">
            {/* Header */}
            <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
                <div className="px-6 py-4 mx-auto max-w-7xl flex items-center justify-between">
                    <Link to={`/${storeSlug}/cart`} className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Cart
                    </Link>
                    <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-4 py-1.5 rounded-full text-sm">
                        <Lock className="w-4 h-4" /> Secure Checkout
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-12">
                {error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-medium text-sm flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-4 h-4 text-red-600" />
                        </div>
                        {error}
                    </motion.div>
                )}

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
                    {/* Checkout Form */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex-1">
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">
                            Shipping Details
                        </h1>

                        <form id="checkoutForm" onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Full Name *</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full h-14 bg-gray-50 focus:bg-white border-2 border-transparent focus:border-brand-500 rounded-2xl px-5 font-semibold text-gray-900 outline-none transition-all shadow-sm"
                                        placeholder="Jane Doe"
                                        value={form.customer_name}
                                        onChange={e => setForm({ ...form, customer_name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Email Address *</label>
                                    <input
                                        required
                                        type="email"
                                        className="w-full h-14 bg-gray-50 focus:bg-white border-2 border-transparent focus:border-brand-500 rounded-2xl px-5 font-semibold text-gray-900 outline-none transition-all shadow-sm"
                                        placeholder="jane@example.com"
                                        value={form.customer_email}
                                        onChange={e => setForm({ ...form, customer_email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Phone Number</label>
                                <input
                                    type="tel"
                                    className="w-full h-14 bg-gray-50 focus:bg-white border-2 border-transparent focus:border-brand-500 rounded-2xl px-5 font-semibold text-gray-900 outline-none transition-all shadow-sm"
                                    placeholder="+1 (555) 000-0000"
                                    value={form.customer_phone}
                                    onChange={e => setForm({ ...form, customer_phone: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Shipping Address *</label>
                                <textarea
                                    required
                                    className="w-full bg-gray-50 focus:bg-white border-2 border-transparent focus:border-brand-500 rounded-2xl p-5 font-semibold text-gray-900 outline-none transition-all shadow-sm resize-none"
                                    placeholder="123 Example St, City, State 12345, Country"
                                    value={form.shipping_address}
                                    onChange={e => setForm({ ...form, shipping_address: e.target.value })}
                                    rows="4"
                                />
                            </div>
                        </form>
                    </motion.div>

                    {/* Order Summary */}
                    <motion.aside initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:w-[420px] shrink-0">
                        <div className="bg-gray-50/50 rounded-[2rem] border border-gray-100 p-8 sticky top-28 shadow-sm">
                            <h3 className="font-extrabold text-lg text-gray-900 mb-6">Order Summary</h3>

                            <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {cart.map(item => (
                                    <div key={item.variant.id} className="flex gap-4 items-center bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                                        <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 border border-gray-50 p-1">
                                            {item.variant.image_url ? (
                                                <img src={item.variant.image_url} alt="Variant" className="w-full h-full object-contain mix-blend-multiply" />
                                            ) : (
                                                <Package className="w-5 h-5 text-gray-300" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-gray-900 text-sm truncate">{item.product.name}</h4>
                                            <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="font-extrabold text-sm text-gray-900">
                                            ${(item.variant.price * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 mb-8">
                                <div className="flex justify-between items-center text-gray-500 font-medium text-sm">
                                    <span>Subtotal</span>
                                    <span>${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-500 font-medium text-sm">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-bold bg-green-50 px-2 rounded">FREE</span>
                                </div>
                            </div>

                            <div className="h-px bg-gray-200/60 w-full mb-6" />

                            <div className="flex justify-between items-end mb-8">
                                <span className="font-extrabold text-gray-900 text-lg">Total Due</span>
                                <span className="font-black text-3xl text-gray-900 tracking-tight">${cartTotal.toFixed(2)}</span>
                            </div>

                            <button
                                form="checkoutForm"
                                type="submit"
                                disabled={loading}
                                className={`w-full flex items-center justify-center gap-2 h-14 rounded-2xl font-bold text-lg transition-all shadow-xl active:scale-[0.98] ${loading ? 'bg-gray-200 text-gray-400 cursor-wait' : 'bg-brand-600 text-white hover:bg-brand-700 shadow-brand-500/25 cursor-pointer'
                                    }`}
                            >
                                {loading ? (
                                    <>Processing...</>
                                ) : (
                                    <>
                                        <CreditCard className="w-5 h-5" /> Confirm & Pay
                                    </>
                                )}
                            </button>

                            <div className="mt-6 flex flex-col gap-3">
                                <div className="flex items-center gap-2 justify-center text-xs font-semibold text-gray-500">
                                    <Lock className="w-3.5 h-3.5 text-gray-400" />
                                    256-bit encrypted secure transaction
                                </div>
                            </div>
                        </div>
                    </motion.aside>
                </div>
            </main>
        </div>
    );
};

export default Checkout;
