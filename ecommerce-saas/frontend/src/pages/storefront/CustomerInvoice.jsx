import React, { useEffect } from 'react';
import { useLocation, Navigate, useParams } from 'react-router-dom';

export default function CustomerInvoice() {
    const location = useLocation();
    const { storeSlug } = useParams();
    const order = location.state?.order;

    useEffect(() => {
        if (order) {
            // Slight delay to ensure images/fonts load before print dialog
            setTimeout(() => {
                window.print();
            }, 500);
        }
    }, [order]);

    if (!order) {
        return <Navigate to={`/${storeSlug}/track-order`} replace />;
    }

    return (
        <div className="invoice-paper bg-white text-black min-h-screen p-8 max-w-4xl mx-auto font-sans">
            <div className="flex justify-between items-start border-b border-gray-200 pb-8 mb-8">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-2">INVOICE</h1>
                    <p className="text-gray-500 font-bold">Order #{order.id.toString().padStart(5, '0')}</p>
                    <p className="text-gray-500 text-sm mt-1">Date: {new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-black text-gray-900 uppercase tracking-tight">{storeSlug}</div>
                </div>
            </div>

            <div className="flex justify-between mb-12">
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Billed To</h3>
                    <p className="font-bold text-gray-900 text-lg">{order.customer_name}</p>
                    <p className="text-gray-600 mt-1">{order.customer_email}</p>
                    <p className="text-gray-600">{order.customer_phone}</p>
                    <p className="text-gray-600 mt-2 max-w-xs">{order.shipping_address}</p>
                </div>
                <div className="text-right">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Payment Status</h3>
                    <p className="font-bold text-gray-900 uppercase text-lg">{order.status}</p>
                    {order.payments?.length > 0 && (
                        <div className="mt-2 text-gray-600 text-sm">
                            <p className="font-medium">Via: {order.payments[0].paymentChannel?.name}</p>
                            <p className="font-mono text-xs mt-1">TrxID: {order.payments[0].transaction_id}</p>
                        </div>
                    )}
                </div>
            </div>

            <table className="w-full text-left mb-12 border-collapse">
                <thead>
                    <tr className="border-b-2 border-gray-900">
                        <th className="py-3 text-sm font-bold text-gray-900 uppercase">Item Description</th>
                        <th className="py-3 text-sm font-bold text-gray-900 uppercase text-center">Qty</th>
                        <th className="py-3 text-sm font-bold text-gray-900 uppercase text-right">Price</th>
                        <th className="py-3 text-sm font-bold text-gray-900 uppercase text-right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {order.orderItems?.map(item => (
                        <tr key={item.id} className="border-b border-gray-200">
                            <td className="py-4">
                                <p className="font-bold text-gray-900">{item.productVariant?.product?.name}</p>
                                <p className="text-xs text-gray-500 mt-1">SKU: {item.productVariant?.sku}</p>
                            </td>
                            <td className="py-4 text-center text-gray-900 font-medium">{item.quantity}</td>
                            <td className="py-4 text-right text-gray-900 font-medium">৳{item.unit_price}</td>
                            <td className="py-4 text-right text-gray-900 font-bold">৳{(item.unit_price * item.quantity).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-end">
                <div className="w-72">
                    <div className="flex justify-between py-4 border-b-2 border-gray-900">
                        <span className="font-bold text-gray-900 uppercase text-sm">Total Amount</span>
                        <span className="font-black text-2xl text-gray-900">৳{Number(order.total_amount).toFixed(2)}</span>
                    </div>
                </div>
            </div>
            
            <div className="mt-24 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">
                Thank you for shopping with us!
            </div>
        </div>
    );
}
