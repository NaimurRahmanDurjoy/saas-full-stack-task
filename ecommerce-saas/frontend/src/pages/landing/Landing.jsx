import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Check, ChevronRight, Zap, Shield, Globe, Star, ArrowRight } from 'lucide-react';
import api from '../../services/api'; // user is using api.js

export default function Landing() {
    const [packages, setPackages] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch active packages for pricing section cleanly softly reliably ideally securely fluently intelligently
        const fetchPackages = async () => {
            try {
                const response = await api.get('/packages'); // Need to ensure this is public or use a public endpoint!
                setPackages(response.data.filter(p => p.status === 'active') || []);
            } catch (error) {
                console.error('Failed to load packages', error);
            }
        };
        fetchPackages();
    }, []);

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-brand-500 selection:text-white overflow-hidden">
            {/* Dynamic Background */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-brand-400/20 blur-[120px] mix-blend-multiply" />
                <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-indigo-400/20 blur-[120px] mix-blend-multiply" />
            </div>

            {/* Navbar */}
            <nav className="relative z-50 flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2"
                >
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 text-white font-bold text-xl shadow-lg shadow-brand-500/30">
                        E
                    </div>
                    <span className="text-xl font-bold tracking-tight text-gray-900">Cartessa</span>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-4"
                >
                    <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                        Login
                    </Link>
                    <Link to="/register" className="px-5 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm">
                        Get Started
                    </Link>
                </motion.div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 pt-20 pb-32">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-sm font-medium rounded-full bg-white border border-gray-200 shadow-sm text-brand-600 backdrop-blur-md"
                    >
                        <span className="flex w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                        Introducing Next-Gen E-Commerce SaaS
                    </motion.div>

                    <motion.h1
                        {...fadeIn}
                        className="mb-8 text-5xl font-extrabold tracking-tight text-gray-900 md:text-7xl lg:text-8xl"
                    >
                        Build your empire. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600">
                            Without the code.
                        </span>
                    </motion.h1>

                    <motion.p
                        {...fadeIn}
                        transition={{ delay: 0.1 }}
                        className="max-w-2xl mx-auto mb-10 text-lg text-gray-600 md:text-xl leading-relaxed"
                    >
                        Launch your stunning e-commerce store in minutes. Manage inventory, process payments, and scale globally with our enterprise-grade SaaS platform.
                    </motion.p>

                    <motion.div
                        {...fadeIn}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col items-center justify-center gap-4 sm:flex-row"
                    >
                        <Link to="/register" className="flex items-center gap-2 px-8 py-4 text-base font-semibold text-white transition-all bg-brand-600 rounded-full shadow-lg hover:shadow-brand-500/25 hover:bg-brand-700 hover:-translate-y-1 active:translate-y-0 group">
                            Start Free Trial
                            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <a href="#features" className="flex items-center gap-2 px-8 py-4 text-base font-semibold text-gray-700 transition-all bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 hover:-translate-y-1 active:translate-y-0">
                            View Features
                        </a>
                    </motion.div>

                    {/* Hero Visual Mockup */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="mt-20 relative mx-auto max-w-5xl"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-transparent z-10 rounded-3xl" />
                        <div className="relative rounded-t-3xl overflow-hidden border border-gray-200/50 shadow-2xl bg-white/40 backdrop-blur-xl p-2 lg:p-4 representation-card">
                            <div className="flex items-center gap-1.5 px-3 py-2 border-b border-gray-100/50">
                                <div className="w-3 h-3 rounded-full bg-red-400" />
                                <div className="w-3 h-3 rounded-full bg-amber-400" />
                                <div className="w-3 h-3 rounded-full bg-green-400" />
                            </div>
                            <div className="aspect-[16/9] w-full bg-gray-50/50 rounded-b-2xl overflow-hidden relative">
                                {/* Abstract UI Representation */}
                                <div className="absolute inset-0 p-8 grid grid-cols-12 gap-6">
                                    <div className="col-span-3 space-y-4">
                                        <div className="h-8 bg-gray-200/50 rounded-lg w-full" />
                                        <div className="h-64 bg-gray-200/50 rounded-xl w-full" />
                                        <div className="h-32 bg-gray-200/50 rounded-xl w-full" />
                                    </div>
                                    <div className="col-span-9 space-y-6">
                                        <div className="h-32 bg-gradient-to-r from-brand-100/50 to-indigo-100/50 rounded-2xl w-full" />
                                        <div className="grid grid-cols-3 gap-4">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="h-40 bg-white shadow-sm border border-gray-100 rounded-xl flex flex-col gap-2 p-4">
                                                    <div className="h-20 bg-gray-100 rounded-lg w-full" />
                                                    <div className="h-4 bg-gray-200 rounded-full w-3/4" />
                                                    <div className="h-4 bg-gray-100 rounded-full w-1/2" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Features Section */}
            <section id="features" className="py-24 bg-white relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 tracking-tight">Everything you need to sell online</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Powerful features designed to help you grow your business and manage your store effortlessly.</p>
                    </div>

                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {[
                            { icon: Zap, title: "Lightning Fast", desc: "Built on modern architecture ensuring sub-second page loads for maximum conversion." },
                            { icon: Shield, title: "Enterprise Security", desc: "Isolated tenant databases and strictly enforced guardrails for your peace of mind." },
                            { icon: Globe, title: "Multi-Store Ready", desc: "Manage multiple storefronts from a single dashboard seamlessly." }
                        ].map((feature, i) => (
                            <motion.div key={i} variants={fadeIn} className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-brand-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <feature.icon className="w-7 h-7 text-brand-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-24 relative z-10 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16 relative">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 tracking-tight">Simple, transparent pricing</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Start for free, upgrade when you need more power.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
                        {/* Fallback Static Cards if API fails */}
                        {[
                            { name: 'Starter', price: 0, store_limit: 1, popular: false },
                            { name: 'Pro', price: 49, store_limit: 5, popular: true },
                            { name: 'Enterprise', price: 99, store_limit: -1, popular: false }
                        ].map((pkg, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.15 }}
                                className={`relative p-8 rounded-3xl bg-white border ${pkg.popular ? 'border-brand-500 shadow-2xl shadow-brand-500/20 scale-105 z-10' : 'border-gray-200 shadow-lg'} transition-all`}
                            >
                                {pkg.popular && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-brand-500 text-white text-xs font-bold uppercase tracking-wider rounded-full self-start">
                                        Most Popular
                                    </div>
                                )}
                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-extrabold text-gray-900">${pkg.price}</span>
                                        <span className="text-gray-500 font-medium">/mo</span>
                                    </div>
                                </div>

                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                                        <span className="text-gray-600">{pkg.store_limit > 0 ? `${pkg.store_limit} Store Limit` : 'Unlimited Stores'}</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                                        <span className="text-gray-600">Custom Domain</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                                        <span className="text-gray-600">24/7 Priority Support</span>
                                    </li>
                                </ul>

                                <Link
                                    to="/register"
                                    className={`block w-full py-3.5 text-center font-semibold rounded-xl transition-all ${pkg.popular ? 'bg-brand-600 text-white hover:bg-brand-700 hover:shadow-lg' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
                                >
                                    Get Started
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-200 bg-white relative z-10">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                                E
                            </div>
                            <span className="text-lg font-bold text-gray-900">Cartessa</span>
                        </div>
                        <p className="text-gray-500 text-sm">
                            &copy; {new Date().getFullYear()} Cartessa. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
