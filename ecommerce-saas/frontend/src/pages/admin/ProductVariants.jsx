import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { Plus, Trash2, ArrowLeft, Image as ImageIcon, Box, Banknote, Tag, Tags, X, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const ProductVariants = () => {
    const { storeId, productId } = useParams();
    const navigate = useNavigate();
    const [variants, setVariants] = useState([]);
    const [form, setForm] = useState({ sku: '', price: '', stock: '', image: null });
    const [attrForm, setAttrForm] = useState({ name: '', value: '' });
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVariant, setEditingVariant] = useState(null);

    useEffect(() => {
        api.get(`/api/products/${productId}/variants`)
            .then(res => setVariants(res.data))
            .catch(err => toast.error('Failed to load variants'))
            .finally(() => setInitialLoading(false));
    }, [productId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('sku', form.sku);
            formData.append('price', form.price);
            formData.append('stock', form.stock);
            
            if (form.image) {
                formData.append('image', form.image);
            }

            if (attrForm.name && attrForm.value) {
                formData.append('attributes[0][name]', attrForm.name);
                formData.append('attributes[0][value]', attrForm.value);
            }

            if (editingVariant) {
                formData.append('_method', 'PUT'); // Laravel workaround for PUT with FormData
                const res = await api.post(`/api/products/${productId}/variants/${editingVariant.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                
                const updatedVar = res.data.variant || res.data;
                setVariants(variants.map(v => v.id === editingVariant.id ? updatedVar : v));
                toast.success('Variant updated successfully');
            } else {
                const res = await api.post(`/api/products/${productId}/variants`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setVariants([res.data.variant, ...variants]);
                toast.success('Variant created successfully');
            }

            setForm({ sku: '', price: '', stock: '', image: null });
            setAttrForm({ name: '', value: '' });
            setEditingVariant(null);
            setIsModalOpen(false);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error saving variant');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (variantId) => {
        const result = await Swal.fire({
            title: 'Delete Variant?',
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
                await api.delete(`/api/products/${productId}/variants/${variantId}`);
                setVariants(variants.filter(v => v.id !== variantId));
                toast.success('Variant deleted');
            } catch (err) {
                toast.error('Failed to delete variant');
            }
        }
    };

    const handleEditClick = (v) => {
        setEditingVariant(v);
        setForm({ sku: v.sku, price: v.price, stock: v.stock, image: null });
        if (v.variant_attributes && v.variant_attributes.length > 0) {
            setAttrForm({ 
                name: v.variant_attributes[0].attribute_name, 
                value: v.variant_attributes[0].attribute_value 
            });
        } else {
            setAttrForm({ name: '', value: '' });
        }
        setIsModalOpen(true);
    };

    return (
        <AdminLayout
            title="Product Variants"
            description="Manage prices, inventory, and images for product variations."
            headerAction={
                <div className="flex items-center gap-3">
                    <Link 
                        to={`/admin/${storeId}/products`}
                        className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Products
                    </Link>
                    <button 
                        onClick={() => {
                            setEditingVariant(null);
                            setForm({ sku: '', price: '', stock: '', image: null });
                            setAttrForm({ name: '', value: '' });
                            setIsModalOpen(true);
                        }}
                        className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
                    >
                        <Plus className="w-5 h-5" />
                        Add Variant
                    </button>
                </div>
            }
        >
            <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
                {initialLoading ? (
                    <div className="p-16 text-center">
                        <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full mx-auto"></div>
                    </div>
                ) : variants.length === 0 ? (
                    <div className="p-16 text-center">
                        <Box className="w-16 h-16 mx-auto text-gray-200 mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Variants Found</h3>
                        <p className="text-gray-500 mb-6 max-w-md mx-auto">Add your first variant to set pricing, inventory, and images for this product.</p>
                        <button 
                            onClick={() => {
                                setEditingVariant(null);
                                setIsModalOpen(true);
                            }}
                            className="inline-flex items-center gap-2 bg-brand-50 text-brand-600 hover:bg-brand-100 px-6 py-3 rounded-xl font-semibold transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Add Your First Variant
                        </button>
                    </div>
                ) : (
                    <React.Fragment>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-brand-50/50 border-b border-brand-100">
                                        <th className="px-6 py-3.5 text-[11px] font-extrabold text-brand-700 uppercase tracking-widest w-24">Image</th>
                                        <th className="px-6 py-3.5 text-[11px] font-extrabold text-brand-700 uppercase tracking-widest">Variant Info</th>
                                        <th className="px-6 py-3.5 text-[11px] font-extrabold text-brand-700 uppercase tracking-widest">Attributes</th>
                                        <th className="px-6 py-3.5 text-[11px] font-extrabold text-brand-700 uppercase tracking-widest">Price</th>
                                        <th className="px-6 py-3.5 text-[11px] font-extrabold text-brand-700 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {variants.map(v => (
                                        <tr key={v.id} className="hover:bg-gray-50/50 transition-colors group bg-white">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {v.image_url ? (
                                                    <img src={v.image_url} alt={v.sku} className="w-14 h-14 object-cover rounded-xl border border-gray-100 shadow-sm" />
                                                ) : (
                                                    <div className="w-14 h-14 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center justify-center text-gray-400 shadow-sm">
                                                        <ImageIcon className="w-5 h-5 opacity-50" />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-extrabold text-gray-900 mb-1">{v.sku}</div>
                                                <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md ${
                                                    v.stock > 0 ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
                                                }`}>
                                                    {v.stock > 0 ? `${v.stock} IN STOCK` : 'OUT OF STOCK'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {v.variant_attributes?.length > 0 ? (
                                                        v.variant_attributes.map(a => (
                                                            <span key={a.id} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 border border-gray-200 text-gray-600 text-xs font-medium shadow-sm">
                                                                <span className="text-gray-400">{a.attribute_name}:</span> 
                                                                <span className="font-bold">{a.attribute_value}</span>
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-xs text-gray-400 italic">No attributes</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-base font-black text-brand-600">
                                                    ${parseFloat(v.price).toFixed(2)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button 
                                                        onClick={() => handleEditClick(v)} 
                                                        className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors border border-transparent hover:border-brand-100"
                                                        title="Edit variant"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(v.id)} 
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                                        title="Delete variant"
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
                                Showing <span className="font-bold text-gray-900">{variants.length}</span> variants
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
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all max-h-[90vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 sticky top-0 z-10">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                {editingVariant ? <Edit2 className="w-5 h-5 text-brand-500" /> : <Plus className="w-5 h-5 text-brand-500" />}
                                {editingVariant ? 'Edit Variant' : 'Create New Variant'}
                            </h3>
                            <button 
                                onClick={() => setIsModalOpen(false)} 
                                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Tag className="w-3.5 h-3.5"/> SKU</label>
                                <input 
                                    className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium shadow-sm" 
                                    placeholder="e.g. TSHIRT-RED-XL" 
                                    value={form.sku} 
                                    onChange={e => setForm({ ...form, sku: e.target.value })} 
                                    required 
                                    autoFocus
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Banknote className="w-3.5 h-3.5"/> Price</label>
                                    <input 
                                        type="number"
                                        className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium shadow-sm" 
                                        placeholder="0.00" 
                                        value={form.price} 
                                        onChange={e => setForm({ ...form, price: e.target.value })} 
                                        required 
                                        min="0" step="0.01"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Box className="w-3.5 h-3.5"/> Stock</label>
                                    <input 
                                        type="number"
                                        className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium shadow-sm" 
                                        placeholder="0" 
                                        value={form.stock} 
                                        onChange={e => setForm({ ...form, stock: e.target.value })} 
                                        required 
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50/50 border border-gray-100 rounded-2xl space-y-4">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5"><Tags className="w-3.5 h-3.5"/> Optional Attributes</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <input 
                                        className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-sm" 
                                        placeholder="Name (e.g. Size)" 
                                        value={attrForm.name} 
                                        onChange={e => setAttrForm({ ...attrForm, name: e.target.value })} 
                                    />
                                    <input 
                                        className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-sm" 
                                        placeholder="Value (e.g. XL)" 
                                        value={attrForm.value} 
                                        onChange={e => setAttrForm({ ...attrForm, value: e.target.value })} 
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1.5"><ImageIcon className="w-3.5 h-3.5"/> Product Image {editingVariant && '(Leave blank to keep current)'}</label>
                                <input 
                                    type="file"
                                    accept="image/*"
                                    className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-3 py-2.5 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 transition-all cursor-pointer shadow-sm"
                                    onChange={e => setForm({ ...form, image: e.target.files[0] })} 
                                />
                            </div>

                            <div className="pt-2 flex gap-3">
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-bold py-3 px-4 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="flex-1 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-sm shadow-brand-500/30 flex justify-center items-center"
                                >
                                    {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (editingVariant ? 'Update Variant' : 'Add Variant')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default ProductVariants;
