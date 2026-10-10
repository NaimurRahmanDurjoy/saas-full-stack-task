import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useParams, Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { Package, Trash2, Edit2, Plus, X, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const Products = () => {
    const { storeId } = useParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { name, slug, category_id: categoryId };
            if (editingProduct) {
                const res = await api.put(`/api/stores/${storeId}/products/${editingProduct.id}`, payload);
                const updatedProd = res.data.product || res.data;
                // Fetch again to get the category relation or just update it manually
                // Since our backend returns the product, we'll just update it
                // To be safe, we might just update the list, but let's map it
                const categoryObj = categories.find(c => c.id.toString() === categoryId.toString());
                const finalProd = { ...updatedProd, category: categoryObj };
                setProducts(products.map(p => p.id === editingProduct.id ? finalProd : p));
                toast.success('Product updated successfully');
            } else {
                const res = await api.post(`/api/stores/${storeId}/products`, payload);
                const newProd = res.data.product || res.data;
                const categoryObj = categories.find(c => c.id.toString() === categoryId.toString());
                const finalProd = { ...newProd, category: categoryObj };
                setProducts([finalProd, ...products]);
                toast.success('Product created successfully');
            }
            setName('');
            setSlug('');
            setCategoryId('');
            setEditingProduct(null);
            setIsModalOpen(false);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error saving product');
        }
    };

    const handleDelete = async (productId) => {
        const result = await Swal.fire({
            title: 'Delete Product?',
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
                await api.delete(`/api/stores/${storeId}/products/${productId}`);
                setProducts(products.filter(p => p.id !== productId));
                toast.success('Product deleted');
            } catch (err) {
                toast.error('Failed to delete product');
            }
        }
    };

    return (
        <AdminLayout
            title="Product Management"
            description="Add and manage products in your store inventory."
            headerAction={
                <button 
                    onClick={() => {
                        if (categories.length === 0) {
                            toast.error('Please create a category first!');
                            return;
                        }
                        setEditingProduct(null);
                        setName('');
                        setSlug('');
                        setCategoryId('');
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
                >
                    <Plus className="w-5 h-5" />
                    Add Product
                </button>
            }
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

            <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
                {loading ? (
                    <div className="p-16 text-center">
                        <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full mx-auto"></div>
                    </div>
                ) : products.length === 0 ? (
                    <div className="p-16 text-center">
                        <Package className="w-16 h-16 mx-auto text-gray-200 mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Products Found</h3>
                        <p className="text-gray-500 mb-6 max-w-md mx-auto">You haven't created any products yet. Start adding items to your store.</p>
                        <button 
                            onClick={() => {
                                if (categories.length === 0) {
                                    toast.error('Please create a category first!');
                                    return;
                                }
                                setIsModalOpen(true);
                            }}
                            className="inline-flex items-center gap-2 bg-brand-50 text-brand-600 hover:bg-brand-100 px-6 py-3 rounded-xl font-semibold transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Add Your First Product
                        </button>
                    </div>
                ) : (
                    <React.Fragment>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-brand-50/50 border-b border-brand-100">
                                        <th className="px-6 py-3.5 text-[11px] font-extrabold text-brand-700 uppercase tracking-widest">Product Info</th>
                                        <th className="px-6 py-3.5 text-[11px] font-extrabold text-brand-700 uppercase tracking-widest">Category</th>
                                        <th className="px-6 py-3.5 text-[11px] font-extrabold text-brand-700 uppercase tracking-widest">Variants</th>
                                        <th className="px-6 py-3.5 text-[11px] font-extrabold text-brand-700 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {products.map(p => (
                                        <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group bg-white">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3.5">
                                                    <div className="w-9 h-9 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:border-brand-100 group-hover:text-brand-500 transition-all shadow-sm">
                                                        <Package className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-gray-900">{p.name}</div>
                                                        <div className="text-xs font-medium text-gray-500 mt-0.5">/{p.slug}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-xs font-bold text-gray-600 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-md uppercase tracking-wide">
                                                    {p.category?.name || 'Uncategorized'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Link 
                                                    to={`/admin/${storeId}/products/${p.id}/variants`} 
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 text-brand-700 hover:bg-brand-100 hover:text-brand-800 rounded-lg text-xs font-bold transition-colors"
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                    Manage Variants
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button 
                                                        onClick={() => {
                                                            setEditingProduct(p);
                                                            setName(p.name);
                                                            setSlug(p.slug);
                                                            setCategoryId(p.category_id || (p.category ? p.category.id : ''));
                                                            setIsModalOpen(true);
                                                        }}
                                                        className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors border border-transparent hover:border-brand-100"
                                                        title="Edit product"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(p.id)} 
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                                        title="Delete product"
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
                        
                        <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/30">
                            <span className="text-xs font-medium text-gray-500">
                                Showing <span className="font-bold text-gray-900">{products.length}</span> products
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

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm transition-opacity">
                    <div 
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                {editingProduct ? <Edit2 className="w-5 h-5 text-brand-500" /> : <Package className="w-5 h-5 text-brand-500" />}
                                {editingProduct ? 'Edit Product' : 'Create New Product'}
                            </h3>
                            <button 
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setEditingProduct(null);
                                }} 
                                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Product Name</label>
                                <input 
                                    className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium shadow-sm" 
                                    placeholder="e.g. Wireless Mouse" 
                                    value={name} 
                                    onChange={e => {
                                        setName(e.target.value);
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
                                    placeholder="e.g. wireless-mouse" 
                                    value={slug} 
                                    onChange={e => setSlug(e.target.value)} 
                                    required 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Category</label>
                                <select 
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium appearance-none"
                                    value={categoryId} 
                                    onChange={e => setCategoryId(e.target.value)} 
                                    required
                                >
                                    <option value="" disabled>Select a category</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="pt-2 flex gap-3">
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setEditingProduct(null);
                                    }}
                                    className="flex-1 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-bold py-3 px-4 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-sm shadow-brand-500/30"
                                >
                                    {editingProduct ? 'Update Product' : 'Add Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default Products;
