import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Check, ChevronRight, Zap, Shield, Globe, Star, ArrowRight, LayoutDashboard, ShoppingBag, BarChart3, CreditCard, Moon, Sun } from 'lucide-react';
import api from '../../services/api';

export default function Landing() {
    const [packages, setPackages] = useState([]);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isDark, setIsDark] = useState(true);
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
    
    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await api.get('/packages');
                if (response.data && response.data.length > 0) {
                    setPackages(response.data.filter(p => p.status === 'active'));
                }
            } catch (error) {
                console.error('Failed to load packages', error);
            }
        };
        fetchPackages();
    }, []);

    const displayPackages = packages.length > 0 ? packages : [
        { name: 'Monthly', price: 1000, store_limit: -1, popular: false, desc: 'Billed every month', billing_period: 'monthly' },
        { name: 'Quarterly', price: 2800, store_limit: -1, popular: false, desc: 'Billed every 3 months', billing_period: 'quarterly' },
        { name: 'Half-Yearly', price: 5500, store_limit: -1, popular: true, desc: 'Billed every 6 months', billing_period: 'half-yearly' },
        { name: 'Yearly', price: 10000, store_limit: -1, popular: false, desc: 'Billed every 12 months', billing_period: 'yearly' }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
    };

    return (
        <div className={`min-h-screen transition-colors duration-500 font-sans selection:bg-emerald-500 selection:text-white overflow-hidden ${isDark ? 'bg-[#0a0a0a] text-white' : 'bg-gray-50 text-gray-900'}`}>
            
            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className={`absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[150px] mix-blend-screen transition-all duration-500 ${isDark ? 'bg-emerald-600/20' : 'bg-emerald-300/40 mix-blend-multiply'}`} />
                <div className={`absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[150px] mix-blend-screen transition-all duration-500 ${isDark ? 'bg-teal-600/20' : 'bg-teal-300/40 mix-blend-multiply'}`} />
            </div>

            {/* Navbar */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? (isDark ? 'bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10 py-4' : 'bg-white/80 backdrop-blur-md border-b border-gray-200 py-4 shadow-sm') : 'bg-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3"
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xl shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                            C
                        </div>
                        <span className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Cartessa</span>
                    </motion.div>
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4 md:gap-6"
                    >
                        <button 
                            onClick={() => setIsDark(!isDark)} 
                            className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-gray-200 text-gray-500 hover:text-gray-900'}`}
                            aria-label="Toggle Dark Mode"
                        >
                            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        <Link to="/login" className={`text-sm font-medium transition-colors hidden sm:block ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                            Management Login
                        </Link>
                        <Link to="/register" className={`px-5 py-2.5 text-sm font-medium rounded-full transition-all duration-300 ${isDark ? 'bg-white/10 text-white border border-white/20 hover:bg-white hover:text-black shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'bg-gray-900 text-white shadow-md hover:shadow-xl hover:-translate-y-0.5'}`}>
                            Create Store
                        </Link>
                    </motion.div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 pt-40 pb-20 md:pt-48 md:pb-32 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className={`inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-medium rounded-full backdrop-blur-md ${isDark ? 'bg-white/5 border border-white/10 text-emerald-300' : 'bg-white border border-gray-200 text-emerald-600 shadow-sm'}`}
                    >
                        <span className={`flex w-2 h-2 rounded-full bg-emerald-500 animate-pulse ${isDark ? 'shadow-[0_0_10px_rgba(16,185,129,0.8)]' : ''}`} />
                        The Ultimate E-Commerce Engine
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className={`mb-8 text-5xl font-extrabold tracking-tighter md:text-7xl lg:text-8xl drop-shadow-lg ${isDark ? 'text-white' : 'text-gray-900'}`}
                    >
                        Launch your store. <br />
                        <span className={`text-transparent bg-clip-text bg-gradient-to-r ${isDark ? 'from-emerald-400 via-teal-400 to-green-400' : 'from-emerald-500 via-teal-500 to-green-500'}`}>
                            Scale infinitely.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className={`max-w-2xl mx-auto mb-12 text-lg md:text-xl leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                    >
                        Everything you need to build, run, and grow your e-commerce empire. Multi-tenant architecture, seamless payments, and enterprise-grade performance.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link to="/register" className={`flex items-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-full transition-all group ${isDark ? 'bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] hover:-translate-y-1' : 'bg-emerald-600 shadow-lg hover:shadow-emerald-500/25 hover:bg-emerald-700 hover:-translate-y-1'}`}>
                            Start Building Now
                            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <a href="#pricing" className={`flex items-center gap-2 px-8 py-4 text-base font-semibold rounded-full transition-all hover:-translate-y-1 ${isDark ? 'bg-white/5 border border-white/10 text-white hover:bg-white/10' : 'bg-white border border-gray-200 text-gray-700 shadow-sm hover:bg-gray-50'}`}>
                            View Pricing
                        </a>
                    </motion.div>

                    {/* Dashboard Mockup */}
                    <motion.div
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.5, type: "spring" }}
                        className="mt-24 relative mx-auto max-w-5xl perspective-1000"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-t z-20 ${isDark ? 'from-[#0a0a0a] via-transparent' : 'from-gray-50 via-transparent'}`} />
                        <motion.div 
                            style={{ y: y1 }}
                            className={`relative rounded-2xl overflow-hidden border shadow-2xl backdrop-blur-xl transform rotate-x-12 scale-105 ${isDark ? 'border-white/10 bg-[#111111]' : 'border-gray-200 bg-white'}`}
                        >
                            {/* Browser Bar */}
                            <div className={`flex items-center gap-2 px-4 py-3 border-b ${isDark ? 'border-white/5 bg-[#1a1a1a]' : 'border-gray-100 bg-gray-50'}`}>
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-400" />
                                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                                    <div className="w-3 h-3 rounded-full bg-green-400" />
                                </div>
                                <div className={`mx-auto px-4 py-1 rounded-md text-xs font-mono ${isDark ? 'bg-white/5 text-gray-500' : 'bg-gray-200/50 text-gray-500'}`}>
                                    admin.cartessa.com
                                </div>
                            </div>
                            
                            {/* App UI */}
                            <div className="flex h-[400px]">
                                {/* Sidebar */}
                                <div className={`w-64 border-r p-4 space-y-4 hidden md:block ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                                    <div className={`h-8 w-3/4 rounded-md mb-8 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
                                    {[1,2,3,4].map(i => (
                                        <div key={i} className={`h-10 w-full rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-100'}`} />
                                    ))}
                                </div>
                                {/* Main Content */}
                                <div className="flex-1 p-8 grid grid-cols-3 gap-6">
                                    <div className="col-span-3 flex justify-between items-end mb-4">
                                        <div>
                                            <div className={`h-6 w-32 rounded mb-2 ${isDark ? 'bg-white/20' : 'bg-gray-200'}`} />
                                            <div className={`h-4 w-48 rounded ${isDark ? 'bg-white/10' : 'bg-gray-100'}`} />
                                        </div>
                                        <div className="h-10 w-32 bg-emerald-500/50 rounded-lg" />
                                    </div>
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className={`h-32 border rounded-xl p-4 flex flex-col justify-between ${isDark ? 'bg-gradient-to-br from-white/5 to-white/[0.02] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
                                            <div className={`h-8 w-8 rounded-full ${isDark ? 'bg-white/10' : 'bg-gray-100'}`} />
                                            <div>
                                                <div className={`h-6 w-20 rounded mb-2 ${isDark ? 'bg-white/20' : 'bg-gray-200'}`} />
                                                <div className={`h-4 w-12 rounded ${isDark ? 'bg-emerald-400/50' : 'bg-emerald-200'}`} />
                                            </div>
                                        </div>
                                    ))}
                                    <div className={`col-span-3 h-48 rounded-xl border mt-4 ${isDark ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`} />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </main>

            {/* Features Section */}
            <section id="features" className={`py-32 relative z-10 border-t ${isDark ? 'border-white/5 bg-[#0a0a0a]/50' : 'border-gray-200 bg-white'}`}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className={`text-3xl md:text-5xl font-bold mb-6 tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Everything you need, <br/><span className="text-gray-400">nothing you don't.</span></h2>
                        <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Built from the ground up for performance, scalability, and absolute control over your digital storefront.</p>
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {[
                            { icon: LayoutDashboard, title: "Centralized Dashboard", desc: "Manage products, orders, and variants from a single, beautiful interface." },
                            { icon: ShoppingBag, title: "Modern Storefronts", desc: "Highly optimized customer-facing stores designed for maximum conversion." },
                            { icon: CreditCard, title: "Manual Payments", desc: "Built-in manual payment verification system tailored for local markets." },
                            { icon: BarChart3, title: "Actionable Insights", desc: "Real-time analytics and sales reports to drive your business decisions." }
                        ].map((feature, i) => (
                            <motion.div key={i} variants={itemVariants} className={`p-8 rounded-2xl border transition-all duration-300 group ${isDark ? 'bg-gradient-to-b from-white/[0.05] to-transparent border-white/[0.05] hover:border-emerald-500/30 hover:bg-white/[0.08]' : 'bg-gray-50 border-gray-100 hover:border-emerald-200 hover:shadow-xl hover:-translate-y-1'}`}>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 ${isDark ? 'bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white' : 'bg-white shadow-sm text-emerald-600'}`}>
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>{feature.title}</h3>
                                <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{feature.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-32 relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4 border ${isDark ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' : 'bg-teal-50 text-teal-700 border-teal-200'}`}
                        >
                            Simple Pricing
                        </motion.div>
                        <h2 className={`text-3xl md:text-5xl font-bold mb-6 tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Scale without surprises</h2>
                        <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Choose the perfect plan for your business needs. Upgrade anytime.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                        {displayPackages.map((pkg, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.15 }}
                                className={`relative p-8 rounded-3xl backdrop-blur-sm border transition-all duration-500 flex flex-col
                                    ${(pkg.popular || idx === 1) 
                                        ? (isDark ? 'bg-gradient-to-b from-emerald-900/40 to-[#111] border-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.2)] md:-translate-y-4' : 'bg-white border-emerald-500 shadow-2xl shadow-emerald-500/20 md:-translate-y-4 scale-105 z-10') 
                                        : (isDark ? 'bg-white/[0.02] border-white/10 hover:border-white/20' : 'bg-white border-gray-200 shadow-lg')}`}
                            >
                                {(pkg.popular || idx === 1) && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
                                        Most Popular
                                    </div>
                                )}
                                
                                <div className="mb-8">
                                    <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{pkg.name}</h3>
                                    <p className={`text-sm h-10 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{pkg.description || pkg.desc}</p>
                                    <div className="flex items-baseline gap-1 mt-6">
                                        <span className={`text-5xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>৳{pkg.price}</span>
                                        <span className={`font-medium ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>/{pkg.billing_period || 'mo'}</span>
                                    </div>
                                </div>

                                <ul className="space-y-4 mb-10 flex-1">
                                    <li className="flex items-start gap-3">
                                        <div className={`rounded-full p-1 mt-0.5 ${isDark ? 'bg-emerald-500/20' : ''}`}>
                                            <Check className={`w-4 h-4 shrink-0 ${isDark ? 'text-emerald-400' : 'text-emerald-500 w-5 h-5'}`} />
                                        </div>
                                        <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{pkg.store_limit > 0 ? `${pkg.store_limit} Store Limit` : 'Unlimited Stores'}</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className={`rounded-full p-1 mt-0.5 ${isDark ? 'bg-emerald-500/20' : ''}`}>
                                            <Check className={`w-4 h-4 shrink-0 ${isDark ? 'text-emerald-400' : 'text-emerald-500 w-5 h-5'}`} />
                                        </div>
                                        <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Custom Subdomain</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className={`rounded-full p-1 mt-0.5 ${isDark ? 'bg-emerald-500/20' : ''}`}>
                                            <Check className={`w-4 h-4 shrink-0 ${isDark ? 'text-emerald-400' : 'text-emerald-500 w-5 h-5'}`} />
                                        </div>
                                        <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Manual Payment Verification</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className={`rounded-full p-1 mt-0.5 ${isDark ? 'bg-emerald-500/20' : ''}`}>
                                            <Check className={`w-4 h-4 shrink-0 ${isDark ? 'text-emerald-400' : 'text-emerald-500 w-5 h-5'}`} />
                                        </div>
                                        <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Full Dashboard Access</span>
                                    </li>
                                </ul>

                                <Link
                                    to="/register"
                                    className={`block w-full py-4 text-center font-semibold rounded-xl transition-all duration-300
                                        ${(pkg.popular || idx === 1) 
                                            ? (isDark ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg') 
                                            : (isDark ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-gray-100 text-gray-900 hover:bg-gray-200')}`}
                                >
                                    Select Plan
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className={`border-t relative z-10 ${isDark ? 'border-white/10 bg-[#050505]' : 'border-gray-200 bg-white'}`}>
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm">
                                C
                            </div>
                            <span className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Cartessa</span>
                        </div>
                        <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                            &copy; {new Date().getFullYear()} Cartessa Platform. Designed for Excellence.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
