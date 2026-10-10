import { useState, useEffect } from 'react';
import api from '../../services/api';
import ManagementLayout from '../../components/management/ManagementLayout';
import { Users, Store as StoreIcon } from 'lucide-react';

export default function ManagementMerchants() {
    const [merchants, setMerchants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMerchants = async () => {
            try {
                const res = await api.get('/api/admin/merchants');
                setMerchants(res.data);
            } catch (err) {
                setError('Failed to fetch merchants list');
            } finally {
                setLoading(false);
            }
        };
        fetchMerchants();
    }, []);

    return (
        <ManagementLayout
            title="Merchants"
            description="Manage and view all registered store owners."
        >
            {error && (
                <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl font-medium border border-red-100">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center p-12">
                    <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full"></div>
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-gray-900">Registered Merchants</h2>
                            <p className="text-sm font-medium text-gray-500">Total {merchants.length} merchants found</p>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-xs">
                                <tr>
                                    <th className="px-6 py-4">Merchant Details</th>
                                    <th className="px-6 py-4">Joined Date</th>
                                    <th className="px-6 py-4">Total Stores</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {merchants.length > 0 ? merchants.map(merchant => (
                                    <tr key={merchant.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900 text-base mb-0.5">{merchant.name}</div>
                                            <div className="text-gray-500 font-medium">{merchant.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 font-medium">
                                            {new Date(merchant.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-50 text-brand-700 font-bold">
                                                <StoreIcon className="w-4 h-4" />
                                                {merchant.stores_count} Store{merchant.stores_count !== 1 && 's'}
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-12 text-center text-gray-500 font-medium">
                                            No merchants found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </ManagementLayout>
    );
}
