import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Package, Store, ShoppingCart, TrendingUp, Menu, X, LogOut, ChevronRight, User } from 'lucide-react';

export default function AdminLayout({ children, title, description, headerAction }) {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Extract storeId if we are in a store context (e.g. /admin/1/products)
    const storeMatch = location.pathname.match(/^\/admin\/(\d+)/);
    const currentStoreId = storeMatch ? storeMatch[1] : null;

    const storeLinks = [
        { path: '/admin', label: 'Back to Workspaces', icon: LayoutDashboard },
        { path: `/admin/${currentStoreId}/categories`, label: 'Category Management', icon: Package },
        { path: `/admin/${currentStoreId}/products`, label: 'Product Management', icon: Store },
        { path: `/admin/${currentStoreId}/orders`, label: 'Order Management & Invoice', icon: ShoppingCart },
        { path: `/admin/${currentStoreId}/sales-reports`, label: 'Sales Reports', icon: TrendingUp }
    ];

    const ownerLinks = [
        { path: '/admin', label: 'My Workspaces', icon: Store },
    ];

    const links = currentStoreId ? storeLinks : ownerLinks;

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans selection:bg-brand-500 selection:text-white">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-[280px] fixed inset-y-0 left-0 bg-white border-r border-gray-100 z-30 shadow-sm">
                <div className="h-20 flex items-center px-8 border-b border-gray-100/60">
                    <Link to="/admin" className="text-2xl font-black tracking-tighter text-gray-900 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-inner">
                            <span className="text-lg">C</span>
                        </div>
                        Cartessa
                    </Link>
                </div>

                <div className="flex-1 overflow-y-auto py-8 px-4 custom-scrollbar">
                    <div className="space-y-1">
                        <div className="px-4 text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Admin Panel</div>
                        {links.map(link => {
                            const Icon = link.icon;
                            // Exact match or active sub-route match
                            const isActive = location.pathname === link.path || (link.path !== '/admin' && location.pathname.startsWith(link.path + '/'));
                            
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-200 group relative ${
                                        isActive 
                                            ? 'bg-brand-50 text-brand-700 font-bold' 
                                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium'
                                    }`}
                                >
                                    {isActive && (
                                        <motion.div 
                                            layoutId="activeTab" 
                                            className="absolute left-0 w-1 h-8 bg-brand-600 rounded-r-full" 
                                            initial={false}
                                        />
                                    )}
                                    <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-brand-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100/60 bg-gray-50/50">
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-gray-100 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-100 to-brand-50 flex items-center justify-center text-brand-600 border border-brand-200/50 shrink-0">
                            <User className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 text-sm truncate">{user?.name}</h4>
                            <p className="text-xs text-gray-500 font-medium truncate capitalize">Admin Panel</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Sidebar overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 lg:hidden"
                        />
                        <motion.aside 
                            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                            className="fixed inset-y-0 left-0 w-[280px] bg-white border-r border-gray-100 z-50 flex flex-col shadow-2xl lg:hidden"
                        >
                            <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100/60 shrink-0">
                                <Link to="/admin" className="text-2xl font-black tracking-tighter text-gray-900 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center">C</div>
                                    Cartessa
                                </Link>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto px-4 py-8 space-y-2 custom-scrollbar">
                                <div className="px-4 text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Admin Panel</div>
                                {links.map(link => {
                                    const Icon = link.icon;
                                    const isActive = location.pathname === link.path || (link.path !== '/admin' && location.pathname.startsWith(link.path + '/'));
                                    return (
                                        <Link
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            key={link.path}
                                            to={link.path}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                                                isActive ? 'bg-brand-50 text-brand-700 font-bold' : 'text-gray-500 font-medium'
                                            }`}
                                        >
                                            <Icon className={`w-5 h-5 ${isActive ? 'text-brand-600' : 'text-gray-400'}`} />
                                            {link.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <div className="flex-1 lg:pl-[280px] flex flex-col min-h-screen">
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100/60 sticky top-0 z-20 flex items-center justify-between px-6 lg:px-10">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600 bg-white shadow-sm hover:bg-gray-50 transition">
                            <Menu className="w-5 h-5" />
                        </button>
                        
                        <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-400">
                            <span>Cartessa</span>
                            <ChevronRight className="w-4 h-4" />
                            <span className="text-gray-900 font-bold capitalize">Admin</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button onClick={logout} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all border border-transparent hover:border-red-100">
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </header>

                <main className="flex-1 p-6 lg:p-10 max-w-[1600px] mx-auto w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight">{title}</h1>
                            {description && <p className="text-gray-500 mt-2 font-medium">{description}</p>}
                        </div>
                        {headerAction && (
                            <div className="shrink-0">
                                {headerAction}
                            </div>
                        )}
                    </div>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
