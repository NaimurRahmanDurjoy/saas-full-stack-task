import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { Store, ArrowRight, Package, ShoppingCart, Plus, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Stores = () => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({ name: '', slug: '', description: '' });

    const fetchStores = () => {
        setLoading(true);
        api.get('/api/stores')
            .then(res => setStores(res.data))
            .catch(err => toast.error('Failed to load stores'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchStores();
        
        if (searchParams.get('error') === 'subscription_required') {
            toast.error('You need an active subscription to manage this store.');
            // Remove the query parameter without refreshing the page
            navigate('/admin', { replace: true });
        }
    }, [searchParams, navigate]);

    const handleNameChange = (e) => {
        const name = e.target.value;
        // Auto-generate a clean slug from the name
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        setFormData(prev => ({ ...prev, name, slug }));
    };

    const handleCreateStore = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.slug) {
            toast.error('Name and URL Slug are required');
            return;
        }

        setSubmitting(true);
        try {
            await api.post('/api/stores', formData);
            toast.success('Store created successfully!');
            setIsModalOpen(false);
            setFormData({ name: '', slug: '', description: '' });
            fetchStores();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create store');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AdminLayout
            title="My Stores"
            description="Select a store to manage its products, categories, and orders."
            headerAction={
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold hover:bg-brand-700 transition-all shadow-sm hover:shadow-md"
                >
                    <Plus className="w-5 h-5" />
                    Create New Store
                </button>
            }
        >
            {loading ? (
                <div className="flex items-center justify-center p-20">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
                </div>
            ) : stores.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                    <Store className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Stores Found</h3>
                    <p className="text-gray-500 mb-6">You don't have any active stores right now. Create one to get started!</p>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-50 text-brand-700 font-bold hover:bg-brand-100 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Create Your First Store
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stores.map(store => (
                        <div key={store.id} className="bg-white border border-gray-100 rounded-3xl p-6 hover:shadow-xl transition-all duration-300 group">
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600">
                                    <Store className="w-6 h-6" />
                                </div>
                                <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg ${
                                    store.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                                }`}>
                                    {store.status || 'Active'}
                                </span>
                            </div>
                            
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{store.name}</h3>
                            <p className="text-sm text-gray-500 mb-6 truncate">{store.domain || store.slug}</p>
                            
                            <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                                <div className="flex -space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-orange-50 border-2 border-white flex items-center justify-center text-orange-600 tooltip" title="Manage Products">
                                        <Package className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-blue-50 border-2 border-white flex items-center justify-center text-blue-600 tooltip" title="View Orders">
                                        <ShoppingCart className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                                
                                {store.subscriptions?.some(s => s.status === 'active' && new Date(s.ends_at) > new Date()) ? (
                                    <Link 
                                        to={`/admin/${store.slug}/dashboard`}
                                        className="flex items-center gap-2 text-sm font-bold text-brand-600 hover:text-brand-700 group-hover:translate-x-1 transition-transform"
                                    >
                                        Manage Store <ArrowRight className="w-4 h-4" />
                                    </Link>
                                ) : store.subscriptions?.some(s => s.status === 'pending' && s.subscription_payments?.some(p => p.status === 'pending')) ? (
                                    <span className="flex items-center gap-2 text-sm font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg">
                                        <Loader2 className="w-4 h-4 animate-spin" /> Verifying Payment
                                    </span>
                                ) : (
                                    <Link 
                                        to={`/admin/${store.slug}/packages`}
                                        className="flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                        Buy Package <ArrowRight className="w-4 h-4" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Store Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div>
                                <h3 className="text-xl font-black text-gray-900">Create New Store</h3>
                                <p className="text-sm text-gray-500 font-medium mt-1">Setup your new storefront</p>
                            </div>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <form id="store-form" onSubmit={handleCreateStore} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Store Name</label>
                                    <input 
                                        type="text" 
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
                                        placeholder="e.g. Awesome Sneakers"
                                        value={formData.name}
                                        onChange={handleNameChange}
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">URL Slug</label>
                                    <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 overflow-hidden focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition-all">
                                        <span className="px-4 text-gray-400 font-medium text-sm select-none border-r border-gray-200">
                                            domain.com/
                                        </span>
                                        <input 
                                            type="text" 
                                            className="w-full px-4 py-3 bg-white outline-none"
                                            placeholder="awesome-sneakers"
                                            value={formData.slug}
                                            onChange={(e) => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})}
                                            required
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1.5 font-medium">This will be your store's public address.</p>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Description <span className="text-gray-400 font-normal">(Optional)</span></label>
                                    <textarea 
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none resize-none"
                                        placeholder="What are you selling?"
                                        rows="3"
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    ></textarea>
                                </div>
                            </form>
                        </div>
                        
                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3 justify-end shrink-0">
                            <button 
                                type="button" 
                                onClick={() => setIsModalOpen(false)}
                                className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                form="store-form"
                                disabled={submitting}
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 text-white font-bold hover:bg-brand-700 transition-colors shadow-sm active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Store className="w-5 h-5" />}
                                {submitting ? 'Creating...' : 'Create Store'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default Stores;
