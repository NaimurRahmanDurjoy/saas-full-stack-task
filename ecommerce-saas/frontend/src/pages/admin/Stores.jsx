import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { Store, ArrowRight, Package, ShoppingCart } from 'lucide-react';

const Stores = () => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/api/stores')
            .then(res => setStores(res.data))
            .finally(() => setLoading(false));
    }, []);

    return (
        <AdminLayout
            title="My Workspaces"
            description="Select a store to manage its products, categories, and orders."
        >
            {loading ? (
                <div className="flex items-center justify-center p-20">
                    <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full"></div>
                </div>
            ) : stores.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                    <Store className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Stores Found</h3>
                    <p className="text-gray-500 mb-6">You don't have any active stores right now.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stores.map(store => (
                        <div key={store.id} className="bg-white border border-gray-100 rounded-3xl p-6 hover:shadow-lg transition-all duration-300 group">
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
                            <p className="text-sm text-gray-500 mb-6 truncate">{store.domain || 'No domain set'}</p>
                            
                            <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                                <div className="flex -space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-orange-50 border-2 border-white flex items-center justify-center text-orange-600 tooltip" title="Manage Products">
                                        <Package className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-blue-50 border-2 border-white flex items-center justify-center text-blue-600 tooltip" title="View Orders">
                                        <ShoppingCart className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                                
                                <Link 
                                    to={`/admin/${store.id}/products`}
                                    className="flex items-center gap-2 text-sm font-bold text-brand-600 hover:text-brand-700 group-hover:translate-x-1 transition-transform"
                                >
                                    Manage Store <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
};

export default Stores;
