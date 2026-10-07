<?php

namespace App\Http\Controllers\Tenant;

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
        return response()->json(Order::with(['store', 'orderItems.variant.product'])->latest()->get());
    }

    public function adminShow(Order $order)
    {
        return response()->json($order->load(['store', 'orderItems.variant.product', 'payments.paymentChannel']));
    }

    // STORE OWNER Scopes
    public function ownerIndex($storeId)
    {
        $store = Store::where('id', $storeId)->where('user_id', Auth::id())->firstOrFail();
        return response()->json(Order::where('store_id', $store->id)->with(['orderItems.variant.product'])->latest()->get());
    }

    public function ownerShow($storeId, $orderId)
    {
        $store = Store::where('id', $storeId)->where('user_id', Auth::id())->firstOrFail();
        $order = Order::where('id', $orderId)->where('store_id', $store->id)->firstOrFail();
        
        return response()->json($order->load(['orderItems.variant.product', 'payments.paymentChannel']));
    }
}
