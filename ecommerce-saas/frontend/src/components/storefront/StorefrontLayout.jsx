import React, { useState, useEffect } from 'react';
import { useParams, Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Search, Menu, X, ArrowRight, Trash2, CreditCard } from 'lucide-react';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';

export default function StorefrontLayout() {
    const { storeSlug } = useParams();
    const { cart, cartTotal, updateQuantity, removeFromCart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    
    const [store, setStore] = useState(null);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        api.get(`/api/storefront/${storeSlug}`)
            .then(res => setStore(res.data))
            .catch(err => {
                if (err.response && err.response.status === 402) setError('STORE_OFFLINE');
                else setError('Store not found.');
            });

        api.get(`/api/storefront/${storeSlug}/categories`)
            .then(res => setCategories(res.data))
            .catch(console.error);
    }, [storeSlug]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/${storeSlug}?search=${encodeURIComponent(searchQuery)}`);
        } else {
            navigate(`/${storeSlug}`);
        }
    };

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#fafafa] p-6 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-100 blur-[100px] rounded-full pointer-events-none" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative z-10 text-center">
                <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">{error === 'STORE_OFFLINE' ? 'Store Offline' : '404'}</h1>
                <p className="text-gray-500 mb-8">{error === 'STORE_OFFLINE' ? 'This store is temporarily unavailable.' : 'The page you are looking for does not exist.'}</p>
                <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-full font-bold hover:bg-emerald-700 transition shadow-lg">
                    Return Home <ArrowRight className="w-4 h-4" />
                </Link>
            </motion.div>
        </div>
    );

    if (!store) return (
        <div className="min-h-screen bg-[#fafafa] flex flex-col">
            {/* Header Skeleton */}
            <div className="h-20 bg-white/80 border-b border-gray-200/50 flex items-center px-8 justify-between mt-6 mx-4 rounded-3xl animate-pulse">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-200" />
                    <div className="w-32 h-6 rounded-full bg-gray-200 hidden sm:block" />
                </div>
                <div className="hidden md:block w-[500px] h-12 rounded-full bg-gray-100" />
                <div className="flex items-center gap-6">
                    <div className="w-20 h-5 rounded-full bg-gray-200 hidden sm:block" />
                    <div className="w-10 h-10 rounded-xl bg-gray-200" />
                </div>
            </div>
            
            {/* Hero Skeleton */}
            <div className="px-8 mt-12 animate-pulse">
                <div className="w-full h-[500px] rounded-[3rem] bg-gray-100 mb-12 flex flex-col items-center justify-center">
                    <div className="w-48 h-8 rounded-full bg-gray-200 mb-6" />
                    <div className="w-[60%] h-16 rounded-full bg-gray-200 mb-6" />
                    <div className="w-[40%] h-6 rounded-full bg-gray-200 mb-10" />
                    <div className="w-48 h-14 rounded-full bg-gray-200" />
                </div>
            </div>
        </div>
    );

    const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div className="min-h-screen print:h-auto bg-[#fafafa] font-sans flex flex-col text-gray-900 selection:bg-emerald-500 selection:text-white transition-colors duration-500">
            
            {/* Ambient Background Glow (Very Light) */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none print:hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-50/50 blur-[150px] mix-blend-multiply transition-all duration-500" />
            </div>

            {/* Floating Glassmorphic Header */}
            <header className={`print:hidden fixed top-0 inset-x-0 z-40 transition-all duration-500 ${isScrolled ? 'pt-4 px-4' : 'pt-6 px-4 md:px-8'}`}>
                <div className={`mx-auto max-w-[1400px] bg-white/80 backdrop-blur-xl border border-gray-200/50 transition-all duration-500 flex items-center justify-between gap-4 ${isScrolled ? 'rounded-2xl shadow-sm py-3 px-6' : 'rounded-3xl shadow-sm py-4 px-6 md:px-8'}`}>
                    
                    {/* Logo Area */}
                    <div className="flex items-center gap-4">
                        <button className="md:hidden text-gray-600 p-2 -ml-2 rounded-xl hover:bg-gray-100" onClick={() => setIsMobileMenuOpen(true)}>
                            <Menu className="w-6 h-6" />
                        </button>
                        <Link to={`/${storeSlug}`} className="text-2xl font-black tracking-tighter flex items-center gap-2 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-xl shadow-sm group-hover:scale-105 transition-transform duration-300">
                                {store.name.charAt(0)}
                            </div>
                            <span className="hidden sm:block text-gray-900">{store.name}</span>
                        </Link>
                    </div>

                    {/* Desktop Search Pill */}
                    <div className="hidden md:flex flex-1 max-w-xl mx-8">
                        <form onSubmit={handleSearch} className="w-full relative group">
                            <input 
                                type="text" 
                                placeholder="Search everything..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-gray-100/80 border border-transparent focus:border-emerald-500 focus:bg-white rounded-full py-3 pl-12 pr-6 text-sm font-medium transition-all outline-none text-gray-900 placeholder-gray-400 shadow-inner"
                            />
                            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-emerald-500 transition-colors" />
                            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-600 text-white p-1.5 rounded-full hover:bg-emerald-500 transition-colors opacity-0 group-focus-within:opacity-100 shadow-sm">
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3 sm:gap-6 shrink-0">
                        <Link to={`/${storeSlug}/track-order`} className="hidden sm:block text-sm font-bold text-gray-500 hover:text-emerald-600 transition-colors tracking-wide">
                            Track Order
                        </Link>
                        <button onClick={() => setIsCartOpen(true)} className="relative flex items-center gap-3 p-2 rounded-2xl hover:bg-gray-50 transition-colors group cursor-pointer border-none bg-transparent">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-white flex items-center justify-center transition-colors border border-gray-200/50 shadow-sm">
                                    <ShoppingCart className="w-5 h-5 text-gray-700" />
                                </div>
                                {totalCartItems > 0 && (
                                    <motion.span 
                                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                                        className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[11px] font-black rounded-full border-2 border-white shadow-md"
                                    >
                                        {totalCartItems}
                                    </motion.span>
                                )}
                            </div>
                            <div className="hidden lg:block text-left">
                                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Your Cart</span>
                                <span className="block text-sm font-extrabold leading-none">{totalCartItems} Items</span>
                            </div>
                        </button>
                    </div>
                </div>
            </header>

            {/* Slide-out Cart Drawer */}
            <AnimatePresence>
                {isCartOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50" />
                        <motion.div 
                            initial={{ x: '100%' }} 
                            animate={{ x: 0 }} 
                            exit={{ x: '100%' }} 
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }} 
                            className="fixed inset-y-0 right-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col border-l border-gray-100"
                        >
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                <h2 className="text-xl font-extrabold flex items-center gap-2">
                                    <ShoppingCart className="w-5 h-5 text-emerald-600" /> Your Cart
                                </h2>
                                <button onClick={() => setIsCartOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:text-gray-900 shadow-sm">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                                {cart.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center">
                                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                                            <ShoppingCart className="w-8 h-8 text-gray-300" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">Cart is empty</h3>
                                        <p className="text-gray-500 text-sm mb-6">Looks like you haven't added anything yet.</p>
                                        <button onClick={() => setIsCartOpen(false)} className="px-6 py-2.5 rounded-full bg-gray-900 text-white font-bold text-sm hover:bg-emerald-600 transition-colors">
                                            Continue Shopping
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <AnimatePresence mode="popLayout">
                                            {cart.map(item => (
                                                <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} key={item.variant.id} className="flex gap-4 group">
                                                    <div className="w-20 h-20 rounded-xl bg-gray-50 border border-gray-100 shrink-0 p-2 overflow-hidden flex items-center justify-center">
                                                        {item.variant.image_url ? (
                                                            <img src={item.variant.image_url} alt={item.product.name} loading="lazy" decoding="async" className="w-full h-full object-contain mix-blend-multiply" />
                                                        ) : (
                                                            <ShoppingCart className="w-5 h-5 text-gray-300" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <Link to={`/${storeSlug}/products/${item.product.slug}`} onClick={() => setIsCartOpen(false)} className="font-bold text-sm text-gray-900 hover:text-emerald-600 line-clamp-2 leading-tight">
                                                            {item.product.name}
                                                        </Link>
                                                        <div className="text-xs text-gray-500 mt-1 mb-2 truncate">
                                                            {item.variant.variant_attributes?.map(a => a.attribute_value).join(' / ') || 'Standard'}
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm h-8 w-24">
                                                                <button onClick={() => updateQuantity(item.variant.id, Math.max(1, item.quantity - 1))} className="flex-1 text-gray-500 hover:bg-gray-50 font-bold hover:text-gray-900">−</button>
                                                                <input type="text" readOnly value={item.quantity} className="w-8 text-center text-xs font-bold text-gray-900 bg-transparent border-x border-gray-200" />
                                                                <button onClick={() => updateQuantity(item.variant.id, item.quantity + 1)} className="flex-1 text-gray-500 hover:bg-gray-50 font-bold hover:text-gray-900">+</button>
                                                            </div>
                                                            <span className="font-extrabold text-sm text-gray-900">৳{(item.variant.price * item.quantity).toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                    <button onClick={() => removeFromCart(item.variant.id)} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 shrink-0 transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </div>

                            {cart.length > 0 && (
                                <div className="p-6 border-t border-gray-100 bg-white">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="font-bold text-gray-500">Subtotal</span>
                                        <span className="font-black text-2xl text-gray-900 tracking-tight">৳{cartTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <Link to={`/${storeSlug}/cart`} onClick={() => setIsCartOpen(false)} className="w-full flex items-center justify-center h-12 rounded-xl bg-white border-2 border-gray-200 text-gray-700 font-bold hover:border-gray-300 hover:bg-gray-50 transition-colors">
                                            View Full Cart
                                        </Link>
                                        <button onClick={() => { setIsCartOpen(false); navigate(`/${storeSlug}/checkout`); }} className="w-full flex items-center justify-center gap-2 h-14 rounded-xl bg-gray-900 text-white font-bold text-lg hover:bg-emerald-600 transition-colors shadow-lg shadow-gray-200/50">
                                            <CreditCard className="w-5 h-5" /> Checkout Securely
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Mobile Menu Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 md:hidden" />
                        <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed inset-y-0 left-0 w-[85vw] max-w-sm bg-white z-50 shadow-2xl flex flex-col md:hidden overflow-hidden rounded-r-[2rem]">
                            <div className="p-6 bg-gray-50 flex items-center justify-between border-b border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold text-xl shadow-sm">{store.name.charAt(0)}</div>
                                    <span className="font-black text-xl tracking-tight text-gray-900">{store.name}</span>
                                </div>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"><X className="w-5 h-5"/></button>
                            </div>
                            
                            <div className="p-6">
                                <form onSubmit={(e) => { handleSearch(e); setIsMobileMenuOpen(false); }} className="relative mb-8">
                                    <input 
                                        type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-gray-100 border border-transparent rounded-2xl py-3.5 pl-12 pr-4 font-medium text-gray-900 focus:bg-white focus:border-emerald-500 outline-none transition-all placeholder-gray-400"
                                    />
                                    <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                </form>

                                <div className="font-black text-xs uppercase tracking-widest text-gray-400 mb-4">Quick Links</div>
                                <div className="flex flex-col gap-2 mb-6">
                                    <Link to={`/${storeSlug}/track-order`} onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl font-bold text-gray-600 bg-gray-50 hover:text-emerald-600 transition-colors">
                                        Track Order
                                    </Link>
                                </div>

                                <div className="font-black text-xs uppercase tracking-widest text-gray-400 mb-4">Categories</div>
                                <div className="flex flex-col gap-2">
                                    <Link to={`/${storeSlug}`} onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-50 hover:text-emerald-600 transition-colors">
                                        All Collection
                                    </Link>
                                    {categories.map(cat => (
                                        <Link key={cat.id} to={`/${storeSlug}?category=${cat.slug}`} onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-50 hover:text-emerald-600 transition-colors">
                                            {cat.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Spacer for fixed header */}
            <div className="h-32" />

            <main className="flex-1 w-full max-w-[1400px] mx-auto flex flex-col relative z-10">
                <Outlet context={{ store, categories, setIsCartOpen }} />
            </main>

            {/* Modern Footer */}
            <footer className="print:hidden mt-20 bg-white border-t border-gray-100 px-6 lg:px-12 py-16 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2" />
                <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex flex-col items-center md:items-start">
                        <Link to={`/${storeSlug}`} className="text-3xl font-black tracking-tighter flex items-center gap-2 mb-4 text-gray-900">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-lg shadow-sm">{store.name.charAt(0)}</div>
                            {store.name}
                        </Link>
                        <p className="text-gray-500 font-medium max-w-xs text-center md:text-left leading-relaxed">
                            {store.description || 'Elevating your shopping experience with curated, premium products.'}
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm font-bold text-gray-400">
                        <a href="#" className="hover:text-emerald-600 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-emerald-600 transition-colors">Terms</a>
                        <a href="#" className="hover:text-emerald-600 transition-colors">Contact</a>
                    </div>
                </div>
                <div className="max-w-[1400px] mx-auto mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <span>© {new Date().getFullYear()} {store.name}</span>
                    <span className="mt-2 md:mt-0">Powered by <span className="text-gray-900 font-black">Cartessa</span></span>
                </div>
            </footer>
        </div>
    );
}
