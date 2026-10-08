import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { Plus, Trash2, ArrowLeft, Image as ImageIcon, Box, DollarSign, Tag, Tags } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductVariants = () => {
    const { storeId, productId } = useParams();
    const navigate = useNavigate();
    const [variants, setVariants] = useState([]);
    const [form, setForm] = useState({ sku: '', price: '', stock: '', image: null });
    const [attrForm, setAttrForm] = useState({ name: '', value: '' });
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        api.get(`/api/products/${productId}/variants`)
            .then(res => setVariants(res.data))
            .catch(err => toast.error('Failed to load variants'))
            .finally(() => setInitialLoading(false));
    }, [productId]);

    const handleCreate = async (e) => {
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

            const res = await api.post(`/api/products/${productId}/variants`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setVariants([...variants, res.data.variant]);
            setForm({ sku: '', price: '', stock: '', image: null });
            setAttrForm({ name: '', value: '' });
            toast.success('Variant created successfully');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error creating variant');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (variantId) => {
        if (!window.confirm("Delete this variant?")) return;
        try {
            await api.delete(`/api/products/${productId}/variants/${variantId}`);
            setVariants(variants.filter(v => v.id !== variantId));
            toast.success('Variant deleted');
        } catch (err) {
            toast.error('Failed to delete variant');
        }
    };

    return (
        <AdminLayout
            title="Product Variants"
            description="Manage prices, inventory, and images for product variations."
        >
            <div className="mb-6">
                <Link to={`/admin/${storeId}/products`} className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Products
                </Link>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="xl:col-span-1">
                    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm sticky top-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600">
                                <Plus className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Add Variant</h3>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Tag className="w-3.5 h-3.5"/> SKU</label>
                                <input 
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium" 
                                    placeholder="e.g. TSHIRT-RED-XL" 
                                    value={form.sku} 
                                    onChange={e => setForm({ ...form, sku: e.target.value })} 
                                    required 
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5"/> Price</label>
                                    <input 
                                        type="number"
                                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium" 
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
                                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium" 
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
                                        className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" 
                                        placeholder="Name (e.g. Size)" 
                                        value={attrForm.name} 
                                        onChange={e => setAttrForm({ ...attrForm, name: e.target.value })} 
                                    />
                                    <input 
                                        className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" 
                                        placeholder="Value (e.g. XL)" 
                                        value={attrForm.value} 
                                        onChange={e => setAttrForm({ ...attrForm, value: e.target.value })} 
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1.5"><ImageIcon className="w-3.5 h-3.5"/> Product Image</label>
                                <input 
                                    type="file"
                                    accept="image/*"
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3 py-2.5 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 transition-all cursor-pointer"
                                    onChange={e => setForm({ ...form, image: e.target.files[0] })} 
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-xl transition-colors mt-4"
                            >
                                {loading ? 'Saving...' : 'Add Variant'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div className="xl:col-span-2">
                    <div className="bg-white border border-gray-100 shadow-sm rounded-3xl overflow-hidden">
                        <div className="p-5 border-b border-gray-50 flex items-center justify-between">
                            <h2 className="text-lg font-extrabold text-gray-900">Current Variations</h2>
                            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-bold">
                                {variants.length} Variants
                            </span>
                        </div>
                        
                        {initialLoading ? (
                            <div className="p-12 text-center">
                                <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full mx-auto"></div>
                            </div>
                        ) : variants.length === 0 ? (
                            <div className="p-12 text-center">
                                <Box className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                                <h3 className="text-lg font-bold text-gray-900 mb-1">No Variants</h3>
                                <p className="text-sm text-gray-500">Add your first variant to set pricing and inventory.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {variants.map(v => (
                                    <div key={v.id} className="p-5 flex flex-col sm:flex-row gap-5 hover:bg-gray-50/50 transition">
                                        {/* Image */}
                                        <div className="shrink-0">
                                            {v.image_url ? (
                                                <img src={v.image_url} alt={v.sku} className="w-24 h-24 object-cover rounded-2xl border border-gray-100 shadow-sm" />
                                            ) : (
                                                <div className="w-24 h-24 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-gray-400">
                                                    <ImageIcon className="w-6 h-6 mb-1 opacity-50" />
                                                    <span className="text-[10px] font-bold uppercase tracking-wider">No Img</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-start justify-between gap-4 mb-1">
                                                    <h3 className="text-base font-extrabold text-gray-900 truncate">{v.sku}</h3>
                                                    <span className={`shrink-0 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg ${
                                                        v.stock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                                    }`}>
                                                        {v.stock > 0 ? `${v.stock} in stock` : 'Out of stock'}
                                                    </span>
                                                </div>
                                                <div className="text-xl font-black text-brand-600 mb-3">
                                                    ${parseFloat(v.price).toFixed(2)}
                                                </div>
                                                
                                                {/* Attributes */}
                                                <div className="flex flex-wrap gap-2">
                                                    {v.variant_attributes?.length > 0 ? (
                                                        v.variant_attributes.map(a => (
                                                            <span key={a.id} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium">
                                                                <span className="text-gray-400">{a.attribute_name}:</span> 
                                                                <span className="font-bold">{a.attribute_value}</span>
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-xs text-gray-400 italic">No attributes defined</span>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="mt-4 flex justify-end">
                                                <button 
                                                    onClick={() => handleDelete(v.id)} 
                                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" /> Delete
                                                </button>
                                            </div>
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

export default ProductVariants;
