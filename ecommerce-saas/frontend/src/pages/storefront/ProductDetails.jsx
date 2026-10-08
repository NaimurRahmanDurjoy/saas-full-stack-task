import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowLeft, Check, AlertCircle, Store, ChevronRight, Package2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';

const ProductDetails = () => {
    const { storeSlug, productSlug } = useParams();
    const { addToCart, cart } = useCart();

    const [product, setProduct] = useState(null);
    const [store, setStore] = useState(null);
    const [error, setError] = useState('');
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isAdded, setIsAdded] = useState(false);

    useEffect(() => {
        // Fetch store details to show brand name smoothly
        api.get(`/api/storefront/${storeSlug}`)
            .then(res => setStore(res.data))
            .catch(() => { });

        api.get(`/api/storefront/${storeSlug}/products/${productSlug}`)
            .then(res => {
                setProduct(res.data);
                if (res.data.product_variants && res.data.product_variants.length > 0) {
                    setSelectedVariant(res.data.product_variants[0]);
                }
            })
            .catch(() => setError('Product not found or currently inactive.'));
    }, [storeSlug, productSlug]);

    const handleAddToCart = () => {
        if (!selectedVariant || selectedVariant.stock <= 0) return;
        addToCart(selectedVariant, product, quantity);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);

        toast.custom((t) => (
            <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-sm w-full bg-white shadow-xl rounded-2xl pointer-events-auto flex ring-1 ring-black/5`}>
                <div className="flex-1 w-0 p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 pt-0.5">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                <Check className="w-5 h-5 text-green-600" />
                            </div>
                        </div>
                        <div className="ml-3 flex-1">
                            <p className="text-sm font-bold text-gray-900">Added to cart</p>
                            <p className="mt-1 text-sm text-gray-500">
                                {quantity}x {product.name}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex border-l border-gray-100">
                    <Link to={`/${storeSlug}/cart`} onClick={() => toast.dismiss(t.id)} className="w-full border border-transparent rounded-none rounded-r-2xl p-4 flex items-center justify-center text-sm font-bold text-brand-600 hover:text-brand-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500">
                        View Cart
                    </Link>
                </div>
            </div>
        ));
    };

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
                <AlertCircle className="w-20 h-20 mx-auto mb-6 text-red-400" />
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Oops!</h1>
                <p className="text-lg text-gray-500 mb-8">{error}</p>
                <Link to={`/${storeSlug}`} className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition">
                    <ArrowLeft className="w-4 h-4" /> Return to Shop
                </Link>
            </motion.div>
        </div>
    );

    if (!product) return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
        </div>
    );

    const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-brand-500 selection:text-white pb-24">
            {/* Header */}
            <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="px-6 py-4 mx-auto max-w-7xl flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link to={`/${storeSlug}`} className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 transition-all">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>

                        {/* Breadcrumbs */}
                        <div className="hidden sm:flex items-center gap-2 text-sm font-medium">
                            <Link to={`/${storeSlug}`} className="text-gray-500 hover:text-gray-900 transition">{store?.name || 'Shop'}</Link>
                            <ChevronRight className="w-4 h-4 text-gray-300" />
                            <span className="text-gray-400">{product.category?.name || 'Catalog'}</span>
                        </div>
                    </div>

                    <Link to={`/${storeSlug}/cart`} className="relative flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-all shadow-sm hover:shadow-md">
                        <ShoppingBag className="w-4 h-4" />
                        <span className="font-semibold text-sm">Cart</span>
                        <AnimatePresence>
                            {totalCartItems > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                                    className="absolute -top-1.5 -right-1.5 w-6 h-6 flex items-center justify-center bg-brand-500 text-white text-[10px] font-bold rounded-full border-2 border-white shadow-sm"
                                >
                                    {totalCartItems}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
                    {/* Left: Image Gallery Split */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="lg:w-[55%] shrink-0"
                    >
                        <div className="bg-gray-50/50 border border-gray-100 rounded-[2.5rem] p-8 aspect-square relative flex items-center justify-center overflow-hidden">
                            {/* Ambient mesh gradient behind image */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/5 to-purple-500/5 blur-3xl pointer-events-none" />

                            <AnimatePresence mode="wait">
                                {selectedVariant?.image_url ? (
                                    <motion.img
                                        key={selectedVariant.image_url}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.1 }}
                                        transition={{ duration: 0.3 }}
                                        src={selectedVariant.image_url}
                                        alt={product.name}
                                        className="w-full h-full object-contain mix-blend-multiply drop-shadow-xl z-10"
                                    />
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        className="flex flex-col items-center justify-center text-gray-300 z-10"
                                    >
                                        <Package2 className="w-24 h-24 mb-4 opacity-30" />
                                        <span className="text-xl font-medium tracking-tight">No Preview Available</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Right: Product Meta */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="flex-1 flex flex-col pt-4"
                    >
                        <span className="inline-flex max-w-max px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-widest mb-4">
                            {product.category?.name || 'Uncategorized'}
                        </span>

                        <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
                            {product.name}
                        </h1>

                        <p className="text-lg text-gray-600 leading-relaxed mb-8">
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
                                        // Display clean attributes (e.g. Size: M, Color: Red -> M / Red)
                                        const shortName = v.variant_attributes.length > 0
                                            ? v.variant_attributes.map(a => a.attribute_value).join(' / ')
                                            : v.sku;

                                        return (
                                            <button
                                                key={v.id}
                                                onClick={() => setSelectedVariant(v)}
                                                className={`px-5 py-3 rounded-2xl text-sm font-semibold transition-all border-2 ${isSelected
                                                        ? 'border-brand-500 bg-brand-50/50 text-brand-700 shadow-sm'
                                                        : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200 hover:bg-gray-50'
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
                            <div className="mt-auto bg-gray-50/80 p-8 rounded-[2rem] border border-gray-100/80 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <Store className="w-48 h-48 -mt-20 -mr-20" />
                                </div>

                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
                                    <div>
                                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Price</p>
                                        <div className="flex items-baseline gap-2">
                                            <h2 className="text-5xl font-extrabold text-gray-900 tracking-tight">
                                                ${Number(selectedVariant.price).toFixed(2)}
                                            </h2>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100">
                                        <div className={`w-2 h-2 rounded-full ${selectedVariant.stock > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                                        <span className={`text-sm font-bold ${selectedVariant.stock > 0 ? 'text-green-700' : 'text-red-700'}`}>
                                            {selectedVariant.stock > 0 ? `${selectedVariant.stock} items left` : 'Out of stock'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                                    {/* Qty Selector */}
                                    <div className="flex bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm h-14">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            disabled={selectedVariant.stock <= 0 || quantity <= 1}
                                            className="px-4 text-gray-500 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 transition-colors"
                                        >−</button>
                                        <div className="w-12 flex items-center justify-center font-bold text-gray-900 border-x border-gray-100">
                                            {quantity}
                                        </div>
                                        <button
                                            onClick={() => setQuantity(Math.min(selectedVariant.stock, quantity + 1))}
                                            disabled={selectedVariant.stock <= 0 || quantity >= selectedVariant.stock}
                                            className="px-4 text-gray-500 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 transition-colors"
                                        >+</button>
                                    </div>

                                    {/* Add to Cart Btn */}
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={selectedVariant.stock <= 0}
                                        className={`flex-1 flex items-center justify-center gap-3 h-14 rounded-2xl font-bold text-lg transition-all shadow-lg active:scale-[0.98] ${isAdded
                                                ? 'bg-green-500 text-white shadow-green-500/25 border border-green-400'
                                                : (selectedVariant.stock <= 0
                                                    ? 'bg-gray-200 text-gray-400 shadow-none cursor-not-allowed'
                                                    : 'bg-brand-600 text-white hover:bg-brand-700 shadow-brand-500/25 border border-transparent')
                                            }`}
                                    >
                                        <ShoppingBag className="w-5 h-5" />
                                        {isAdded ? 'Added to Cart' : 'Add to Cart'}
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
