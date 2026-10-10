import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

const PackageSelection = () => {
    const { storeId } = useParams();
    const navigate = useNavigate();
    const [packages, setPackages] = useState([]);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [channels, setChannels] = useState([]);
    const [paymentForm, setPaymentForm] = useState({ channel: '', transactionId: '', accountNumber: '' });
    const [step, setStep] = useState(1); // 1 = Select Package, 2 = Submit Payment
    const [subscriptionId, setSubscriptionId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.get('/api/packages').then(res => setPackages(res.data)).catch(console.error);
        api.get('/api/storefront/global/payment-channels').then(res => {
            setChannels(res.data);
            if (res.data.length > 0) setPaymentForm(prev => ({ ...prev, channel: res.data[0].id }));
        }).catch(console.error);
        
        // Check for existing pending subscription
        api.get(`/api/stores/${storeId}`).then(res => {
            const pendingSub = res.data.subscriptions?.find(s => s.status === 'pending');
            if (pendingSub) {
                setSubscriptionId(pendingSub.id);
                setSelectedPackage(pendingSub.package);
                setStep(2);
                toast.success('Found a pending subscription. Please complete the payment.');
            }
        }).catch(console.error);
    }, [storeId]);

    const handleCreateSubscription = async () => {
        if (!selectedPackage) return setError('Please select a package');
        setLoading(true);
        setError(null);
        try {
            const res = await api.post(`/api/stores/${storeId}/subscriptions`, { package_id: selectedPackage.id });
            setSubscriptionId(res.data.subscription.id);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Error creating subscription');
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await api.post(`/api/subscriptions/${subscriptionId}/payments`, {
                payment_channel_id: paymentForm.channel,
                amount: selectedPackage.price,
                transaction_id: paymentForm.transactionId,
                account_number: paymentForm.accountNumber
            });
            toast.success('Payment submitted! Awaiting Admin verification.');
            navigate('/admin');
        } catch (err) {
            setError(err.response?.data?.errors?.transaction_id?.[0] || 'Error submitting payment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout
            title="SaaS Subscription Setup"
            description="Select a computing package and submit payment for your store."
        >
            <div className="max-w-4xl mx-auto space-y-8">
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-2xl font-medium border border-red-100 flex items-center gap-3">
                        <span className="w-6 h-6 flex items-center justify-center bg-red-100 rounded-full font-bold">!</span>
                        {error}
                    </div>
                )}

                {step === 1 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-gray-900">Select a Computing Package</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {packages.map(pkg => (
                                <div
                                    key={pkg.id}
                                    onClick={() => setSelectedPackage(pkg)}
                                    className={`relative p-8 rounded-3xl border-2 transition-all cursor-pointer overflow-hidden ${
                                        selectedPackage?.id === pkg.id 
                                            ? 'border-brand-500 bg-brand-50/30 shadow-md' 
                                            : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
                                    }`}
                                >
                                    {selectedPackage?.id === pkg.id && (
                                        <div className="absolute top-4 right-4 w-6 h-6 bg-brand-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                            ✓
                                        </div>
                                    )}
                                    <h3 className="text-2xl font-black text-gray-900 mb-2">{pkg.name}</h3>
                                    <p className="text-sm font-medium text-gray-500 mb-6">{pkg.description}</p>
                                    <div className="flex items-end gap-1">
                                        <span className="text-4xl font-black text-gray-900">৳{pkg.price}</span>
                                        <span className="text-sm font-bold text-gray-400 mb-1">/{pkg.billing_period?.replace('_', ' ')}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end pt-4">
                            <button
                                onClick={handleCreateSubscription}
                                disabled={loading || !selectedPackage}
                                className="px-8 py-4 bg-brand-600 text-white font-bold rounded-2xl hover:bg-brand-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                            >
                                {loading ? 'Processing...' : 'Continue to Payment'}
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm max-w-2xl mx-auto">
                        <h2 className="text-2xl font-black text-gray-900 mb-2">Submit Payment</h2>
                        <p className="text-gray-500 font-medium mb-8">Amount Due: <strong className="text-gray-900 text-xl">৳{selectedPackage?.price}</strong></p>

                        <form onSubmit={handlePaymentSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Payment Method</label>
                                <select
                                    value={paymentForm.channel}
                                    onChange={e => setPaymentForm({ ...paymentForm, channel: e.target.value })}
                                    className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none appearance-none font-medium text-gray-900 bg-gray-50 focus:bg-white transition"
                                    required
                                >
                                    {channels.map(ch => <option key={ch.id} value={ch.id}>{ch.name}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Sender Account Number</label>
                                <input
                                    required
                                    value={paymentForm.accountNumber}
                                    onChange={e => setPaymentForm({ ...paymentForm, accountNumber: e.target.value })}
                                    className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none font-medium text-gray-900 bg-gray-50 focus:bg-white transition"
                                    placeholder="e.g. 01712345678"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Transaction ID / Code</label>
                                <input
                                    required
                                    value={paymentForm.transactionId}
                                    onChange={e => setPaymentForm({ ...paymentForm, transactionId: e.target.value })}
                                    className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none font-medium text-gray-900 bg-gray-50 focus:bg-white transition"
                                    placeholder="Enter your transaction code"
                                />
                            </div>

                            <button type="submit" disabled={loading} className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition shadow-lg disabled:opacity-50 mt-4">
                                {loading ? 'Submitting...' : 'Submit Payment'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default PackageSelection;
