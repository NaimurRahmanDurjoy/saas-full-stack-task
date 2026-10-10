import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { Trash2, Tag, Plus, X, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const Categories = () => {
    const { storeId } = useParams();
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    useEffect(() => {
        api.get(`/api/stores/${storeId}/categories`)
            .then(res => setCategories(res.data))
            .catch(err => toast.error('Failed to load categories'))
            .finally(() => setLoading(false));
    }, [storeId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                const res = await api.put(`/api/stores/${storeId}/categories/${editingCategory.id}`, { name, slug });
                // Fallback to res.data if the backend returns the category directly instead of {category: ...}
                const updatedCat = res.data.category || res.data; 
                setCategories(categories.map(c => c.id === editingCategory.id ? updatedCat : c));
                toast.success('Category updated successfully');
            } else {
                const res = await api.post(`/api/stores/${storeId}/categories`, { name, slug });
                const newCat = res.data.category || res.data;
                setCategories([...categories, newCat]);
                toast.success('Category created successfully');
            }
            setName('');
            setSlug('');
            setEditingCategory(null);
            setIsModalOpen(false);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error saving category');
        }
    };

    const handleDelete = async (catId) => {
        const result = await Swal.fire({
            title: 'Delete Category?',
            text: "This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#9ca3af',
            confirmButtonText: 'Yes, delete it',
            customClass: {
                popup: 'rounded-2xl',
                confirmButton: 'rounded-xl',
                cancelButton: 'rounded-xl'
            }
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/api/stores/${storeId}/categories/${catId}`);
                setCategories(categories.filter(c => c.id !== catId));
                toast.success('Category deleted');
            } catch (err) {
                toast.error('Failed to delete category');
            }
        }
    };

    return (
        <AdminLayout
            title="Category Management"
            description="Organize your store products into categories."
            headerAction={
                <button 
                    onClick={() => {
                        setEditingCategory(null);
                        setName('');
                        setSlug('');
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
                >
                    <Plus className="w-5 h-5" />
                    Add Category
                </button>
            }
        >
            <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
                
                {loading ? (
                    <div className="p-16 text-center border-t border-gray-100">
                        <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full mx-auto"></div>
                    </div>
                ) : categories.length === 0 ? (
                    <div className="p-16 text-center border-t border-gray-100">
                        <Tag className="w-16 h-16 mx-auto text-gray-200 mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Categories Found</h3>
                        <p className="text-gray-500 mb-6 max-w-md mx-auto">You haven't created any categories yet. Categories help customers easily find what they are looking for.</p>
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="inline-flex items-center gap-2 bg-brand-50 text-brand-600 hover:bg-brand-100 px-6 py-3 rounded-xl font-semibold transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Create Your First Category
                        </button>
                    </div>
                ) : (
                    <React.Fragment>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-brand-50/50 border-y border-brand-100">
                                        <th className="px-6 py-3.5 text-[11px] font-extrabold text-brand-700 uppercase tracking-widest">Category Info</th>
                                        <th className="px-6 py-3.5 text-[11px] font-extrabold text-brand-700 uppercase tracking-widest">Slug</th>
                                        <th className="px-6 py-3.5 text-[11px] font-extrabold text-brand-700 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {categories.map(c => (
                                        <tr key={c.id} className="hover:bg-gray-50/50 transition-colors group bg-white">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3.5">
                                                    <div className="w-9 h-9 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:border-brand-100 group-hover:text-brand-500 transition-all shadow-sm">
                                                        <Tag className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-900">{c.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-xs font-medium text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-md">/{c.slug}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button 
                                                        onClick={() => {
                                                            setEditingCategory(c);
                                                            setName(c.name);
                                                            setSlug(c.slug);
                                                            setIsModalOpen(true);
                                                        }}
                                                        className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors border border-transparent hover:border-brand-100"
                                                        title="Edit category"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(c.id)} 
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                                        title="Delete category"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Pagination / Table Footer */}
                        <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/30">
                            <span className="text-xs font-medium text-gray-500">
                                Showing <span className="font-bold text-gray-900">{categories.length}</span> categories
                            </span>
                            <div className="flex items-center gap-2">
                                <button disabled className="px-3 py-1.5 text-xs font-medium text-gray-400 bg-white border border-gray-200 rounded-lg transition-colors opacity-50 cursor-not-allowed">
                                    Previous
                                </button>
                                <button disabled className="px-3 py-1.5 text-xs font-medium text-gray-400 bg-white border border-gray-200 rounded-lg transition-colors opacity-50 cursor-not-allowed">
                                    Next
                                </button>
                            </div>
                        </div>
                    </React.Fragment>
                )}
            </div>

            {/* Add Category Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm transition-opacity">
                    <div 
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                {editingCategory ? <Edit2 className="w-5 h-5 text-brand-500" /> : <Plus className="w-5 h-5 text-brand-500" />}
                                {editingCategory ? 'Edit Category' : 'Create New Category'}
                            </h3>
                            <button 
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setEditingCategory(null);
                                }} 
                                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Category Name</label>
                                <input 
                                    className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium shadow-sm" 
                                    placeholder="e.g. Electronics" 
                                    value={name} 
                                    onChange={e => {
                                        setName(e.target.value);
                                        // Auto-generate slug
                                        if (!slug || slug === name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-৳)+/g, '')) {
                                            setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-৳)+/g, ''));
                                        }
                                    }} 
                                    required 
                                    autoFocus
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
                                <p className="text-xs text-gray-400 mt-2">This will be used in the product URL. Keep it simple.</p>
                            </div>
                            
                            <div className="pt-2 flex gap-3">
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setEditingCategory(null);
                                    }}
                                    className="flex-1 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-bold py-3 px-4 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-sm shadow-brand-500/30"
                                >
                                    {editingCategory ? 'Update Category' : 'Create Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default Categories;
