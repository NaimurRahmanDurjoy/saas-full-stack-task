import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { FolderPlus, Trash2, Tag } from 'lucide-react';
import toast from 'react-hot-toast';

const Categories = () => {
    const { storeId } = useParams();
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/api/stores/${storeId}/categories`)
            .then(res => setCategories(res.data))
            .catch(err => toast.error('Failed to load categories'))
            .finally(() => setLoading(false));
    }, [storeId]);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post(`/api/stores/${storeId}/categories`, { name, slug });
            setCategories([...categories, res.data.category]);
            setName('');
            setSlug('');
            toast.success('Category created successfully');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error creating category');
        }
    };

    const handleDelete = async (catId) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        try {
            await api.delete(`/api/stores/${storeId}/categories/${catId}`);
            setCategories(categories.filter(c => c.id !== catId));
            toast.success('Category deleted');
        } catch (err) {
            toast.error('Failed to delete category');
        }
    };

    return (
        <AdminLayout
            title="Category Management"
            description="Organize your store products into categories."
        >
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="xl:col-span-1">
                    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm sticky top-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600">
                                <FolderPlus className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">New Category</h3>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Category Name</label>
                                <input 
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium" 
                                    placeholder="e.g. Electronics" 
                                    value={name} 
                                    onChange={e => {
                                        setName(e.target.value);
                                        // Auto-generate slug
                                        if (!slug || slug === name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')) {
                                            setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                                        }
                                    }} 
                                    required 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">URL Slug</label>
                                <input 
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium" 
                                    placeholder="e.g. electronics" 
                                    value={slug} 
                                    onChange={e => setSlug(e.target.value)} 
                                    required 
                                />
                            </div>
                            <button type="submit" className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 px-4 rounded-xl transition-colors mt-2">
                                Add Category
                            </button>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div className="xl:col-span-2">
                    <div className="bg-white border border-gray-100 shadow-sm rounded-3xl overflow-hidden">
                        <div className="p-5 border-b border-gray-50 flex items-center justify-between">
                            <h2 className="text-lg font-extrabold text-gray-900">Existing Categories</h2>
                            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-bold">
                                {categories.length} Categories
                            </span>
                        </div>
                        
                        {loading ? (
                            <div className="p-12 text-center">
                                <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full mx-auto"></div>
                            </div>
                        ) : categories.length === 0 ? (
                            <div className="p-12 text-center">
                                <Tag className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                                <h3 className="text-lg font-bold text-gray-900 mb-1">No Categories Yet</h3>
                                <p className="text-sm text-gray-500">Create your first category using the form.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {categories.map(c => (
                                    <div key={c.id} className="p-5 flex items-center justify-between hover:bg-gray-50/50 transition">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400">
                                                <Tag className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-900">{c.name}</h3>
                                                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md mt-1 inline-block">/{c.slug}</span>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleDelete(c.id)} 
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                                            title="Delete category"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
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

export default Categories;
