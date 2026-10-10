import React, { useState, useEffect } from 'react';
import { useParams, Link, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowLeft, Check, AlertCircle, Store, ChevronRight, Package2, Star, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';

const ProductDetails = () => {
    const { storeSlug, productSlug } = useParams();
    const { setIsCartOpen } = useOutletContext();
    const { addToCart, cart } = useCart();

    const [product, setProduct] = useState(null);
    const [store, setStore] = useState(null);
    const [error, setError] = useState('');
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isImageZoomed, setIsImageZoomed] = useState(false);

    // Fake review data
    const rating = 4.8;
    const reviews = 124;

    useEffect(() => {
        api.get(`/api/storefront/${storeSlug}`)
            .then(res => setStore(res.data))
            .catch(err => {
                if (err.response && err.response.status === 402) setError('STORE_OFFLINE');
            });

        api.get(`/api/storefront/${storeSlug}/products/${productSlug}`)
            .then(res => {
                setProduct(res.data);
                if (res.data.product_variants && res.data.product_variants.length > 0) {
                    setSelectedVariant(res.data.product_variants[0]);
                }
            })
            .catch(err => {
                if (err.response && err.response.status === 402) {
                    setError('STORE_OFFLINE');
                } else {
                    setError('Product not found or currently inactive.');
                }
            });
    }, [storeSlug, productSlug]);

    const handleAddToCart = () => {
        if (!selectedVariant || selectedVariant.stock <= 0) return;
        addToCart(selectedVariant, product, quantity);
        setIsCartOpen(true); // Open the slide-out cart drawer
    };

    if (error === 'STORE_OFFLINE') return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#fafafa]">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center p-8 bg-white rounded-3xl shadow-lg border border-gray-100">
                <Store className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Store Offline</h1>
                <p className="text-lg text-gray-500 mb-8 max-w-sm mx-auto">This store is temporarily unavailable due to maintenance or subscription status.</p>
                <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-emerald-600 transition shadow-lg">
                    Return to Platform
                </Link>
            </motion.div>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#fafafa]">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center p-8 bg-white rounded-3xl shadow-lg border border-gray-100">
                <AlertCircle className="w-20 h-20 mx-auto mb-6 text-red-500" />
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Oops!</h1>
                <p className="text-lg text-gray-500 mb-8">{error}</p>
                <Link to={`/${storeSlug}`} className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-emerald-600 transition shadow-lg">
                    <ArrowLeft className="w-4 h-4" /> Return to Shop
                </Link>
            </motion.div>
        </div>
    );

    if (!product) return (
        <div className="flex items-center justify-center min-h-screen bg-[#fafafa]">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-emerald-600 rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-emerald-500 selection:text-white pb-24 text-gray-900">
            <main className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
                    {/* Left: Image Gallery Split (With Hover Zoom & Thumbnails simulation) */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="lg:w-[55%] shrink-0 flex flex-col gap-4"
                    >
                        <div 
                            className="bg-gray-50/80 border border-gray-100 rounded-[2.5rem] p-8 aspect-square relative flex items-center justify-center overflow-hidden cursor-crosshair group"
                            onMouseEnter={() => setIsImageZoomed(true)}
                            onMouseLeave={() => setIsImageZoomed(false)}
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-100/50 to-teal-100/50 blur-3xl pointer-events-none" />

                            <AnimatePresence mode="wait">
                                {selectedVariant?.image_url ? (
                                    <motion.img
                                        key={selectedVariant.image_url}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: isImageZoomed ? 1.3 : 1 }}
                                        exit={{ opacity: 0, scale: 1.1 }}
                                        transition={{ duration: 0.4 }}
                                        src={selectedVariant.image_url}
                                        alt={product.name}
                                        className="w-full h-full object-contain mix-blend-multiply drop-shadow-xl z-10 transition-transform duration-500 ease-out"
                                    />
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        className="flex flex-col items-center justify-center text-gray-300 z-10"
                                    >
                                        <Package2 className="w-24 h-24 mb-4 opacity-50" />
                                        <span className="text-xl font-medium tracking-tight">No Preview Available</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        
                        {/* Simulated Thumbnails Gallery */}
                        {selectedVariant?.image_url && (
                            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
                                <div className="w-24 h-24 rounded-2xl border-2 border-emerald-500 bg-gray-50 p-2 shrink-0 opacity-100 cursor-pointer">
                                    <img src={selectedVariant.image_url} className="w-full h-full object-contain mix-blend-multiply" />
                                </div>
                                <div className="w-24 h-24 rounded-2xl border-2 border-transparent bg-gray-50 p-2 shrink-0 opacity-60 hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center">
                                    <img src={selectedVariant.image_url} className="w-full h-full object-contain mix-blend-multiply filter grayscale" />
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* Right: Product Meta */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="flex-1 flex flex-col pt-4"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <span className="inline-flex px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-widest">
                                {product.category?.name || 'Premium'}
                            </span>
                            
                            {/* Trust Signals: Fake Ratings */}
                            <div className="flex items-center gap-1.5 text-sm font-bold text-gray-700 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                <Star className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                                <span>{rating}</span>
                                <span className="text-gray-400 font-medium ml-1">({reviews} reviews)</span>
                            </div>
                        </div>

                        <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
                            {product.name}
                        </h1>

                        <p className="text-lg text-gray-500 leading-relaxed mb-8">
                            {product.description}
                        </p>

                        <div className="h-px w-full bg-gray-100 mb-8" />

                        {/* Variants Matrix via Pill Buttons */}
                        {product.product_variants?.length > 1 && (
                            <div className="mb-10">
                                <label className="block text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">
                                    Variant & Options
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    {product.product_variants.map(v => {
                                        const isSelected = selectedVariant?.id === v.id;
                                        const shortName = v.variant_attributes.length > 0
                                            ? v.variant_attributes.map(a => a.attribute_value).join(' / ')
                                            : v.sku;

                                        return (
                                            <button
                                                key={v.id}
                                                onClick={() => setSelectedVariant(v)}
                                                className={`px-5 py-3 rounded-2xl text-sm font-semibold transition-all border ${isSelected
                                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                                                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {shortName}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Price & Cart Injection Card */}
                        {selectedVariant && (
                            <div className="mt-auto bg-gray-50/80 p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden backdrop-blur-md hidden md:block">
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <Store className="w-48 h-48 -mt-20 -mr-20 text-gray-900" />
                                </div>

                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
                                    <div>
                                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Price</p>
                                        <div className="flex items-baseline gap-2">
                                            <h2 className="text-5xl font-extrabold text-gray-900 tracking-tight">
                                                ৳{Number(selectedVariant.price).toFixed(0)}
                                            </h2>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200">
                                        <div className={`w-2 h-2 rounded-full ${selectedVariant.stock > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                                        <span className={`text-sm font-bold ${selectedVariant.stock > 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                                            {selectedVariant.stock > 0 ? `${selectedVariant.stock} items left` : 'Out of stock'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                                    <div className="flex bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm h-14">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            disabled={selectedVariant.stock <= 0 || quantity <= 1}
                                            className="px-4 text-gray-500 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 transition-colors"
                                        >−</button>
                                        <div className="w-12 flex items-center justify-center font-bold text-gray-900 border-x border-gray-200">
                                            {quantity}
                                        </div>
                                        <button
                                            onClick={() => setQuantity(Math.min(selectedVariant.stock, quantity + 1))}
                                            disabled={selectedVariant.stock <= 0 || quantity >= selectedVariant.stock}
                                            className="px-4 text-gray-500 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 transition-colors"
                                        >+</button>
                                    </div>

                                    <button
                                        onClick={handleAddToCart}
                                        disabled={selectedVariant.stock <= 0}
                                        className={`flex-1 flex items-center justify-center gap-3 h-14 rounded-2xl font-bold text-lg transition-all shadow-lg active:scale-[0.98] ${selectedVariant.stock <= 0
                                                ? 'bg-gray-200 text-gray-400 shadow-none cursor-not-allowed border border-transparent'
                                                : 'bg-gray-900 text-white hover:bg-emerald-600 shadow-xl border border-transparent'
                                            }`}
                                    >
                                        <ShoppingBag className="w-5 h-5" />
                                        Add to Cart
                                    </button>
                                </div>
                                <div className="mt-4 text-xs font-medium text-gray-400 text-center flex items-center justify-center gap-1.5">
                                    <ShieldCheck className="w-4 h-4" /> Secure SSL Checkout & Payment
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </main>

            {/* Mobile Sticky Add to Cart Bottom Bar */}
            {selectedVariant && (
                <div className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-40 flex items-center gap-4">
                    <div className="flex-1 flex flex-col">
                        <span className="text-xs font-bold text-gray-500 uppercase">Total</span>
                        <span className="text-2xl font-black text-gray-900">৳{Number(selectedVariant.price * quantity).toFixed(0)}</span>
                    </div>
                    <div className="flex bg-gray-50 rounded-xl border border-gray-200 overflow-hidden h-12 shrink-0">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 text-gray-500 font-bold">−</button>
                        <div className="w-8 flex items-center justify-center font-bold text-gray-900">{quantity}</div>
                        <button onClick={() => setQuantity(Math.min(selectedVariant.stock, quantity + 1))} className="px-3 text-gray-500 font-bold">+</button>
                    </div>
                    <button
                        onClick={handleAddToCart}
                        disabled={selectedVariant.stock <= 0}
                        className={`flex-1 flex items-center justify-center h-12 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-[0.98] shrink-0 ${selectedVariant.stock <= 0 ? 'bg-gray-200 text-gray-400' : 'bg-gray-900 text-white hover:bg-emerald-600'}`}
                    >
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Add
                    </button>
                </div>
            )}
        </div>
    );
};

// Simple standalone icon component to avoid importing missing icon
const ShieldCheck = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <path d="m9 12 2 2 4-4"></path>
    </svg>
);

export default ProductDetails;
