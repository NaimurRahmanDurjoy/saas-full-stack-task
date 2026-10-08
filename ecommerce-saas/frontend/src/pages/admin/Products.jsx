import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useParams, Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { Package, Trash2, Edit, Plus, LayoutGrid, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Products = () => {
    const { storeId } = useParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ name: '', slug: '', category_id: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.get(`/api/stores/${storeId}/products`),
            api.get(`/api/stores/${storeId}/categories`)
        ]).then(([prodRes, catRes]) => {
            setProducts(prodRes.data);
            setCategories(catRes.data);
        }).catch(err => {
            toast.error('Failed to load products');
        }).finally(() => setLoading(false));
    }, [storeId]);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post(`/api/stores/${storeId}/products`, form);
            setProducts([res.data.product, ...products]);
            setForm({ name: '', slug: '', category_id: '' });
            toast.success('Product created successfully');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error creating product');
        }
    };

    const handleDelete = async (productId) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await api.delete(`/api/stores/${storeId}/products/${productId}`);
            setProducts(products.filter(p => p.id !== productId));
            toast.success('Product deleted');
        } catch (err) {
            toast.error('Failed to delete product');
        }
    };

    return (
        <AdminLayout
            title="Product Management"
            description="Add and manage products in your store inventory."
        >
            {categories.length === 0 && !loading && (
                <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-800">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-bold">No categories found</h4>
                        <p className="text-sm mt-1">You need to create at least one category before adding products.</p>
                        <Link to={`/admin/${storeId}/categories`} className="inline-block mt-2 text-sm font-bold underline hover:text-amber-900">
                            Create a category
                        </Link>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="xl:col-span-1">
                    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm sticky top-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600">
                                <Package className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">New Product</h3>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Product Name</label>
                                <input 
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium" 
                                    placeholder="e.g. Wireless Mouse" 
                                    value={form.name} 
                                    onChange={e => {
                                        setForm({ 
                                            ...form, 
                                            name: e.target.value,
                                            slug: (!form.slug || form.slug === form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')) 
                                                ? e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') 
                                                : form.slug
                                        });
                                    }} 
                                    required 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">URL Slug</label>
                                <input 
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium" 
                                    placeholder="e.g. wireless-mouse" 
                                    value={form.slug} 
                                    onChange={e => setForm({ ...form, slug: e.target.value })} 
                                    required 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Category</label>
                                <select 
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium appearance-none"
                                    value={form.category_id} 
                                    onChange={e => setForm({ ...form, category_id: e.target.value })} 
                                    required
                                >
                                    <option value="" disabled>Select a category</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <button 
                                type="submit" 
                                disabled={categories.length === 0}
                                className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-xl transition-colors mt-2"
                            >
                                Add Product
                            </button>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div className="xl:col-span-2">
                    <div className="bg-white border border-gray-100 shadow-sm rounded-3xl overflow-hidden">
                        <div className="p-5 border-b border-gray-50 flex items-center justify-between">
                            <h2 className="text-lg font-extrabold text-gray-900">Inventory</h2>
                            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-bold">
                                {products.length} Products
                            </span>
                        </div>
                        
                        {loading ? (
                            <div className="p-12 text-center">
                                <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full mx-auto"></div>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="p-12 text-center">
                                <LayoutGrid className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                                <h3 className="text-lg font-bold text-gray-900 mb-1">No Products Yet</h3>
                                <p className="text-sm text-gray-500">Add products to your catalog to start selling.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {products.map(p => (
                                    <div key={p.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                                                <Package className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-900 mb-0.5">{p.name}</h3>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md uppercase tracking-wider">{p.category?.name || 'Uncategorized'}</span>
                                                    <span className="text-xs text-gray-400">/{p.slug}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Link 
                                                to={`/admin/${storeId}/products/${p.id}/variants`} 
                                                className="px-3 py-1.5 bg-brand-50 text-brand-700 hover:bg-brand-100 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                                Variants
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(p.id)} 
                                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                                                title="Delete product"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Products;
