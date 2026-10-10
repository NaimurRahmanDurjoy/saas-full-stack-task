import React, { useState, useEffect } from 'react';
import { useParams, Link, useOutletContext, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ArrowRight, Sparkles, Zap, TrendingUp, Star } from 'lucide-react';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';

const StorefrontHome = () => {
    const { storeSlug } = useParams();
    const { store, categories, setIsCartOpen } = useOutletContext();
    const { addToCart } = useCart();
    const location = useLocation();
    
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const search = queryParams.get('search');
        const category = queryParams.get('category');
        
        setSearchQuery(search || '');
        setSelectedCategory(category || '');
    }, [location]);

    useEffect(() => {
        setLoading(true);
        let url = `/api/storefront/${storeSlug}/products?`;
        if (selectedCategory) url += `category=${selectedCategory}&`;
        if (searchQuery) url += `search=${searchQuery}`;

        api.get(url)
            .then(res => {
                const productList = res.data.data ? res.data.data : res.data;
                const filtered = searchQuery 
                    ? productList.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    : productList;
                setProducts(filtered);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [storeSlug, selectedCategory, searchQuery]);

    const handleAddToCart = (e, product) => {
        e.preventDefault();
        const defaultVariant = product.product_variants?.[0];
        if (defaultVariant) {
            addToCart(defaultVariant, product, 1);
            setIsCartOpen(true); // Open slide-out cart drawer
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            {/* Stunning Hero Section - Premium Light variant */}
            {!selectedCategory && !searchQuery && (
                <div className="relative mb-20 rounded-[2rem] sm:rounded-[3rem] bg-white border border-gray-100 overflow-hidden min-h-[500px] flex items-center justify-center p-8 sm:p-16 isolate shadow-xl shadow-gray-200/40">
                    {/* Background Gradients */}
                    <div className="absolute top-0 -left-1/4 w-full h-full bg-gradient-to-br from-emerald-100/60 to-transparent blur-[120px] -z-10 mix-blend-multiply" />
                    <div className="absolute bottom-0 -right-1/4 w-full h-full bg-gradient-to-tl from-teal-100/60 to-transparent blur-[120px] -z-10 mix-blend-multiply" />
                    
                    {/* Floating Orbs */}
                    <motion.div animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute top-1/4 left-1/4 w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-200 to-teal-200 blur-2xl opacity-40 -z-10" />
                    <motion.div animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-1/4 right-1/4 w-32 h-32 rounded-full bg-gradient-to-tr from-teal-200 to-emerald-200 blur-2xl opacity-40 -z-10" />

                    <div className="text-center max-w-4xl mx-auto z-10 flex flex-col items-center">
                        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-gray-200/50 text-emerald-700 text-sm font-bold tracking-wide mb-8 shadow-sm">
                            <Sparkles className="w-4 h-4 text-emerald-500" /> Introducing the new collection
                        </motion.div>
                        
                        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 tracking-tighter leading-[1.1] mb-6">
                            Experience <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                                True Excellence.
                            </span>
                        </motion.h1>
                        
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
                            {store?.description || 'Discover a curated selection of premium products designed to elevate your everyday life. Shop the trend.'}
                        </motion.p>
                        
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row items-center gap-4">
                            <button onClick={() => window.scrollTo({top: 600, behavior: 'smooth'})} className="px-8 py-4 rounded-full bg-gray-900 text-white font-black text-lg hover:bg-emerald-600 hover:shadow-[0_10px_30px_rgba(16,185,129,0.3)] transition-all duration-300 flex items-center gap-2">
                                Start Shopping <ArrowRight className="w-5 h-5" />
                            </button>
                        </motion.div>
                    </div>
                </div>
            )}

            {/* Top Categories Pills */}
            <div className="mb-12 flex items-center justify-center sm:justify-start gap-3 overflow-x-auto pb-4 hide-scrollbar">
                <Link 
                    to={`/${storeSlug}`}
                    className={`shrink-0 px-6 py-2.5 rounded-full text-sm font-black transition-all duration-300 ${!selectedCategory && !searchQuery ? 'bg-gray-900 text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900 border border-gray-200'}`}
                >
                    All Items
                </Link>
                {categories.map(cat => (
                    <Link 
                        key={cat.id}
                        to={`/${storeSlug}?category=${cat.slug}`}
                        className={`shrink-0 px-6 py-2.5 rounded-full text-sm font-black transition-all duration-300 ${selectedCategory === cat.slug ? 'bg-gray-900 text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900 border border-gray-200'}`}
                    >
                        {cat.name}
                    </Link>
                ))}
            </div>

            {/* Title */}
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                    {searchQuery ? `Results for "${searchQuery}"` : selectedCategory ? categories.find(c => c.slug === selectedCategory)?.name : (
                        <><TrendingUp className="w-8 h-8 text-emerald-500" /> Trending Now</>
                    )}
                </h3>
                <span className="text-sm font-bold text-gray-500 bg-gray-100 border border-gray-200 px-3 py-1 rounded-full">{products.length} Products</span>
            </div>

            {/* Product Grid - Premium glass cards */}
            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="bg-white rounded-3xl p-3 border border-gray-100 flex flex-col h-full animate-pulse">
                            <div className="aspect-[4/5] bg-gray-100 rounded-2xl mb-4 w-full" />
                            <div className="px-1 flex-1 flex flex-col">
                                <div className="h-3 w-1/3 bg-gray-100 rounded-full mb-3" />
                                <div className="h-4 w-3/4 bg-gray-200 rounded-full mb-2" />
                                <div className="h-4 w-1/2 bg-gray-200 rounded-full mb-4" />
                                <div className="mt-auto pt-3 flex items-center justify-between">
                                    <div className="h-6 w-16 bg-gray-200 rounded-full" />
                                    <div className="w-8 h-8 rounded-full bg-gray-100" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={selectedCategory + searchQuery}
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8"
                    >
                        {products.map(product => {
                            const defaultVariant = product.product_variants?.[0];
                            const price = defaultVariant ? Number(defaultVariant.price) : 0;
                            
                            // Fake Trust Rating between 4.5 and 5.0
                            const rating = (4.5 + Math.random() * 0.5).toFixed(1);
                            const reviews = Math.floor(Math.random() * 150) + 12;

                            return (
                                <motion.div variants={item} key={product.id}>
                                    <Link to={`/${storeSlug}/products/${product.slug}`} className="group block relative bg-white rounded-3xl p-3 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 border border-gray-100 hover:border-emerald-200 flex flex-col h-full">
                                        {/* Image Container - Soft rounded */}
                                        <div className="relative aspect-[4/5] bg-gray-50/80 rounded-2xl mb-4 overflow-hidden">
                                            {defaultVariant?.image_url ? (
                                                <img 
                                                    src={defaultVariant.image_url} 
                                                    alt={product.name}
                                                    loading="lazy"
                                                    decoding="async"
                                                    className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-out"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                                                    <Zap className="w-10 h-10 mb-2 opacity-30" />
                                                </div>
                                            )}
                                            
                                            {/* Hover Overlay Button */}
                                            <div className="absolute inset-0 bg-gray-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-end justify-center p-4">
                                                <button 
                                                    onClick={(e) => handleAddToCart(e, product)}
                                                    className="w-full bg-white/95 backdrop-blur-md text-gray-900 font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-xl hover:bg-emerald-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300"
                                                >
                                                    <ShoppingCart className="w-4 h-4" /> Add to Cart
                                                </button>
                                            </div>
                                        </div>

                                        {/* Product Info */}
                                        <div className="px-1 flex-1 flex flex-col">
                                            {/* Trust Stars */}
                                            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 mb-2">
                                                <Star className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
                                                <span className="text-gray-700">{rating}</span> 
                                                <span>({reviews})</span>
                                            </div>

                                            <h4 className="text-sm sm:text-base font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                                                {product.name}
                                            </h4>
                                            <div className="mt-auto pt-3 flex items-center justify-between">
                                                <span className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
                                                    ৳{price.toFixed(0)}
                                                </span>
                                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-emerald-50 border border-transparent group-hover:border-emerald-200 transition-colors">
                                                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 -rotate-45 group-hover:rotate-0 transition-all duration-300" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </AnimatePresence>
            )}

            {!loading && products.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-16 text-center rounded-[3rem] border border-gray-100 mt-8 shadow-sm">
                    <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100">
                        <Zap className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">Nothing Found</h3>
                    <p className="text-gray-500 font-medium mb-6">We couldn't find any products matching your criteria.</p>
                    <Link to={`/${storeSlug}`} className="inline-flex px-6 py-3 rounded-full bg-gray-900 text-white font-bold hover:bg-emerald-600 transition shadow-lg">
                        Clear all filters
                    </Link>
                </motion.div>
            )}
        </div>
    );
};

export default StorefrontHome;
