import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, Filter, ArrowRight, Store, Star } from 'lucide-react';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';

const StorefrontHome = () => {
    const { storeSlug } = useParams();
    const { cart } = useCart();
    const [store, setStore] = useState(null);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [error, setError] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        api.get(`/api/storefront/${storeSlug}`)
            .then(res => setStore(res.data))
            .catch(() => setError('Store not found.'));

        api.get(`/api/storefront/${storeSlug}/categories`)
            .then(res => setCategories(res.data))
            .catch(console.error);
    }, [storeSlug]);

    useEffect(() => {
        const url = selectedCategory
            ? `/api/storefront/${storeSlug}/products?category=${selectedCategory}`
            : `/api/storefront/${storeSlug}/products`;

        api.get(url)
            .then(res => {
                const productList = res.data.data ? res.data.data : res.data;
                setProducts(productList);
            })
            .catch(console.error);
    }, [storeSlug, selectedCategory]);

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
                <Store className="w-24 h-24 mx-auto mb-6 text-gray-300" />
                <h1 className="text-6xl font-extrabold text-gray-900 mb-2">404</h1>
                <p className="text-xl text-gray-500">{error}</p>
                <Link to="/" className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-brand-600 text-white rounded-full font-medium hover:bg-brand-700 transition">
                    Return Home
                </Link>
            </motion.div>
        </div>
    );

    if (!store) return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
        </div>
    );

    const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    const staggerContainer = {
        animate: { transition: { staggerChildren: 0.05 } }
    };

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans selection:bg-brand-500 selection:text-white pb-24">
            {/* Sticky Navigation */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 py-3' : 'bg-transparent py-5'}`}>
                <div className="px-6 mx-auto max-w-7xl flex items-center justify-between">
                    <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 text-white flex items-center justify-center shadow-lg">
                            <Store className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 leading-tight">{store.name}</h1>
                            {isScrolled && <p className="text-xs text-gray-500">{store.description?.substring(0, 40)}...</p>}
                        </div>
                    </motion.div>

                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center gap-4">
                        <Link to={`/${storeSlug}/cart`} className="relative flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-sm border border-gray-100 text-gray-700 hover:text-brand-600 hover:border-brand-200 hover:shadow-md transition-all group">
                            <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-110" />
                            <AnimatePresence>
                                {totalCartItems > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                                        className="absolute -top-1 -right-1 w-6 h-6 flex items-center justify-center bg-brand-500 text-white text-[10px] font-bold rounded-full border-2 border-white shadow-sm"
                                    >
                                        {totalCartItems}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>
                    </motion.div>
                </div>
            </header>

            {/* Storefront Hero */}
            <div className="relative pt-32 pb-16 px-6 mx-auto max-w-7xl">
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                        Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">{store.name}</span>
                    </h2>
                    <p className="text-lg text-gray-500">{store.description}</p>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Category Sidebar */}
                    <aside className="lg:w-64 shrink-0">
                        <div className="sticky top-28 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-50 text-gray-900">
                                <Filter className="w-4 h-4" />
                                <h3 className="font-semibold uppercase tracking-wider text-xs">Categories</h3>
                            </div>
                            <ul className="space-y-1.5">
                                <li>
                                    <button
                                        onClick={() => setSelectedCategory('')}
                                        className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${!selectedCategory ? 'bg-brand-50 text-brand-600' : 'text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        All Products
                                    </button>
                                </li>
                                {categories.map(cat => (
                                    <li key={cat.id}>
                                        <button
                                            onClick={() => setSelectedCategory(cat.slug)}
                                            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${selectedCategory === cat.slug ? 'bg-brand-50 text-brand-600' : 'text-gray-600 hover:bg-gray-50'}`}
                                        >
                                            {cat.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <main className="flex-1">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedCategory}
                                variants={staggerContainer}
                                initial="initial"
                                animate="animate"
                                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                            >
                                {products.map(product => {
                                    const defaultVariant = product.product_variants?.[0];
                                    return (
                                        <motion.div variants={fadeInUp} key={product.id}>
                                            <Link
                                                to={`/${storeSlug}/products/${product.slug}`}
                                                className="group bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-brand-200 transition-all duration-300 flex flex-col h-full block"
                                            >
                                                <div className="aspect-[4/3] bg-gray-50 relative overflow-hidden flex items-center justify-center p-6">
                                                    {defaultVariant?.image_url ? (
                                                        <img
                                                            src={defaultVariant.image_url}
                                                            alt={product.name}
                                                            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="text-gray-300 flex flex-col items-center">
                                                            <ShoppingBag className="w-12 h-12 mb-2 opacity-50" />
                                                            <span className="text-sm font-medium">No Image</span>
                                                        </div>
                                                    )}

                                                    {/* Hover Overlay elements - minimal */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>

                                                <div className="p-6 flex flex-col flex-1">
                                                    <div className="text-xs font-semibold text-brand-600 uppercase tracking-wilder mb-2">
                                                        {product.category?.name || 'Uncategorized'}
                                                    </div>
                                                    <h3 className="text-lg font-bold text-gray-900 mb-4 line-clamp-2 leading-tight group-hover:text-brand-600 transition-colors">
                                                        {product.name}
                                                    </h3>

                                                    <div className="mt-auto flex items-end justify-between">
                                                        <div>
                                                            <span className="text-gray-400 text-xs font-medium uppercase tracking-wider block mb-1">Price</span>
                                                            <span className="text-xl font-extrabold text-gray-900">
                                                                {defaultVariant ? `$${Number(defaultVariant.price).toFixed(2)}` : 'Unavailable'}
                                                            </span>
                                                        </div>
                                                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-900 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                                                            <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        </AnimatePresence>

                        {products.length === 0 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24 px-6 bg-white rounded-3xl border border-dashed border-gray-200">
                                <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No Products Found</h3>
                                <p className="text-gray-500 text-center max-w-sm">We couldn't find any products in this category. Check back later or browse other categories.</p>
                            </motion.div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default StorefrontHome;
