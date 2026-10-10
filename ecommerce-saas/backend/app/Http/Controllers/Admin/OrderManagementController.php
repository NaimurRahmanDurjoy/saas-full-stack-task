<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use App\Models\Order;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderManagementController extends Controller
{
    // ADMIN Scopes
    public function adminIndex()
    {
        return response()->json(Order::with(['store', 'orderItems.productVariant.product'])->latest()->get());
    }

    public function adminShow(Order $order)
    {
        return response()->json($order->load(['store', 'orderItems.productVariant.product', 'payments.paymentChannel']));
    }

    // STORE OWNER Scopes
    public function ownerIndex(Store $store)
    {
        if ($store->user_id !== Auth::id()) abort(403);
        return response()->json(Order::where('store_id', $store->id)->with(['orderItems.productVariant.product', 'payments.paymentChannel'])->latest()->get());
    }

    public function ownerShow(Store $store, Order $order)
    {
        if ($store->user_id !== Auth::id() || $order->store_id !== $store->id) abort(403);
        return response()->json($order->load(['orderItems.productVariant.product', 'payments.paymentChannel']));
    }
    public function ownerUpdateStatus(Request $request, Store $store, Order $order)
    {
        if ($store->user_id !== Auth::id() || $order->store_id !== $store->id) abort(403);
        
        $request->validate([
            'status' => 'required|in:pending,processing,completed,cancelled'
        ]);

        $order->update(['status' => $request->status]);

        // Also update payment status if completed (optional, but good practice)
        if ($request->status === 'completed') {
            $order->payments()->update(['status' => 'verified']);
        }

        return response()->json(['message' => 'Order status updated successfully', 'order' => $order]);
    }
}
