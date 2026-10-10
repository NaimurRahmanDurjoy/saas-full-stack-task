import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, ShoppingCart } from 'lucide-react';

const Cart = () => {
    const { storeSlug } = useParams();
    const navigate = useNavigate();
    const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();

    const staggerContainer = {
        animate: { transition: { staggerChildren: 0.1 } }
    };

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, x: -20 }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] font-sans selection:bg-emerald-500 selection:text-white pb-24 text-gray-900">

            <main className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
                <div className="mb-10 text-center sm:text-left">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                        Your Shopping Cart
                    </h1>
                    <p className="text-gray-500 mt-3 font-medium">Review your items before proceeding to checkout.</p>
                </div>

                {cart.length === 0 ? (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2rem] border border-gray-100 p-16 text-center shadow-sm max-w-2xl mx-auto">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100">
                            <ShoppingCart className="w-10 h-10 text-gray-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">Looks like you haven't added anything yet. Discover our amazing products!</p>
                        <Link to={`/${storeSlug}`} className="inline-flex items-center justify-center h-14 px-8 rounded-full bg-gray-900 text-white font-bold hover:bg-emerald-600 transition shadow-lg active:scale-95">
                            Start Shopping
                        </Link>
                    </motion.div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-10 items-start">
                        {/* Cart Items List */}
                        <div className="flex-1 w-full">
                            <motion.div
                                variants={staggerContainer}
                                initial="initial"
                                animate="animate"
                                className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden"
                            >
                                <div className="hidden sm:grid grid-cols-12 gap-4 p-6 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50">
                                    <div className="col-span-6">Product Details</div>
                                    <div className="col-span-2 text-center">Quantity</div>
                                    <div className="col-span-2 text-right">Price</div>
                                    <div className="col-span-2 text-right">Total</div>
                                </div>

                                <AnimatePresence mode="popLayout">
                                    {cart.map(item => {
                                        const attributes = item.variant.variant_attributes?.map(a => `${a.attribute_name}: ${a.attribute_value}`).join(', ');

                                        return (
                                            <motion.div
                                                layout
                                                variants={fadeInUp}
                                                key={item.variant.id}
                                                className="grid grid-cols-1 sm:grid-cols-12 gap-6 p-6 border-b border-gray-100 last:border-b-0 items-center group relative hover:bg-gray-50 transition-colors"
                                            >
                                                {/* Mobile Remove Btn (Absolute Top Right on small screens) */}
                                                <button
                                                    onClick={() => removeFromCart(item.variant.id)}
                                                    className="sm:hidden w-8 h-8 absolute top-4 right-4 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors border border-transparent hover:border-red-100"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>

                                                {/* Product Info */}
                                                <div className="col-span-1 sm:col-span-6 flex gap-5 items-center">
                                                    <div className="w-24 h-24 sm:w-20 sm:h-20 shrink-0 bg-white rounded-2xl flex items-center justify-center overflow-hidden border border-gray-200 p-2">
                                                        {item.variant.image_url ? (
                                                            <img src={item.variant.image_url} alt="Variant" className="w-full h-full object-contain mix-blend-multiply" />
                                                        ) : (
                                                            <ShoppingBag className="w-6 h-6 text-gray-300" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <Link to={`/${storeSlug}/products/${item.product.slug}`} className="font-extrabold text-lg sm:text-base text-gray-900 hover:text-emerald-600 line-clamp-2 leading-tight transition-colors">
                                                            {item.product.name}
                                                        </Link>
                                                        <div className="text-sm font-medium text-gray-500 mt-1">SKU: {item.variant.sku}</div>
                                                        {attributes && (
                                                            <div className="inline-block mt-2 px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg">
                                                                {attributes}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Mobile Price Display (Hidden on Desktop) */}
                                                <div className="sm:hidden font-extrabold text-xl text-gray-900 border-t border-gray-100 pt-4 mt-2">
                                                    ৳{Number(item.variant.price).toFixed(2)}
                                                </div>

                                                {/* Quantity Selector */}
                                                <div className="col-span-1 sm:col-span-2 flex justify-center mt-2 sm:mt-0">
                                                    <div className="flex bg-white rounded-xl border border-gray-200 overflow-hidden h-10 w-full sm:w-auto shadow-sm">
                                                        <button
                                                            onClick={() => updateQuantity(item.variant.id, Math.max(1, item.quantity - 1))}
                                                            className="flex-1 sm:px-3 text-gray-400 hover:bg-gray-50 font-bold hover:text-gray-900 transition-colors"
                                                        >−</button>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={item.quantity}
                                                            onChange={(e) => updateQuantity(item.variant.id, parseInt(e.target.value) || 1)}
                                                            className="w-12 text-center text-sm font-bold text-gray-900 bg-transparent border-x border-gray-200 appearance-none m-0"
                                                        />
                                                        <button
                                                            onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                                                            className="flex-1 sm:px-3 text-gray-400 hover:bg-gray-50 font-bold hover:text-gray-900 transition-colors"
                                                        >+</button>
                                                    </div>
                                                </div>

                                                {/* Unit Price (Desktop only) */}
                                                <div className="hidden sm:block col-span-2 text-right text-gray-500 font-bold">
                                                    ৳{Number(item.variant.price).toFixed(2)}
                                                </div>

                                                {/* Total Price & Remove Bin (Desktop only) */}
                                                <div className="hidden sm:flex col-span-2 items-center justify-end gap-4">
                                                    <div className="font-extrabold text-lg text-gray-900">
                                                        ৳{(item.variant.price * item.quantity).toFixed(2)}
                                                    </div>
                                                    <button
                                                        onClick={() => removeFromCart(item.variant.id)}
                                                        className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 hover:border hover:border-red-100 rounded-full transition-all hidden lg:flex opacity-0 group-hover:opacity-100"
                                                        title="Remove Item"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </motion.div>
                        </div>

                        {/* Order Summary Sidebar */}
                        <motion.aside
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                            className="w-full lg:w-[380px] shrink-0"
                        >
                            <div className="sticky top-28 bg-white rounded-3xl border border-gray-100 p-8 shadow-xl shadow-gray-200/30">
                                <h3 className="font-extrabold text-xl text-gray-900 mb-6">Order Summary</h3>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between items-center text-gray-500 font-medium">
                                        <span>Provisional Subtotal</span>
                                        <span className="text-gray-900 font-bold">৳{cartTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-gray-500 font-medium">
                                        <span>Shipping</span>
                                        <span className="text-sm">Calculated at checkout</span>
                                    </div>
                                    <div className="flex justify-between items-center text-gray-500 font-medium">
                                        <span>Taxes</span>
                                        <span className="text-sm">Calculated at checkout</span>
                                    </div>
                                </div>

                                <div className="h-px bg-gray-100 w-full mb-6" />

                                <div className="flex justify-between items-end mb-8">
                                    <span className="font-extrabold text-gray-900 text-lg">Estimated Total</span>
                                    <span className="font-black text-3xl text-gray-900 tracking-tight">৳{cartTotal.toFixed(2)}</span>
                                </div>

                                <button
                                    onClick={() => navigate(`/${storeSlug}/checkout`)}
                                    className="w-full flex items-center justify-center gap-2 h-14 rounded-2xl bg-gray-900 text-white font-bold text-lg hover:bg-emerald-600 hover:-translate-y-0.5 transition-all shadow-lg active:scale-[0.98] active:translate-y-0"
                                >
                                    Proceed to Checkout <ArrowRight className="w-5 h-5 ml-2" />
                                </button>

                                <div className="mt-6 flex flex-col gap-3">
                                    <div className="flex items-center gap-2 justify-center text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 py-2.5 rounded-xl">
                                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                        Secure Encrypted Checkout
                                    </div>
                                    <p className="text-center text-[11px] text-gray-400 px-4 leading-relaxed font-medium">
                                        Prices and stock availability will be strictly verified live during the checkout process.
                                    </p>
                                </div>
                            </div>
                        </motion.aside>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Cart;
