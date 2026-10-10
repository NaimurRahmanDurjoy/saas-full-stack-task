<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use App\Models\Order;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SalesReportController extends Controller
{
    public function adminReport()
    {
        return response()->json([
            'total_sales' => Order::sum('total_amount'),
            'total_orders' => Order::count()
        ]);
    }

    public function ownerReport(Request $request, Store $store)
    {
        if ($store->user_id !== Auth::id()) abort(403);
        $ordersQuery = Order::where('store_id', $store->id);
        
        if ($request->has('start_date') && $request->start_date) {
            $ordersQuery->whereDate('created_at', '>=', $request->start_date);
        }
        if ($request->has('end_date') && $request->end_date) {
            $ordersQuery->whereDate('created_at', '<=', $request->end_date);
        }

        $orders = $ordersQuery->with(['orderItems.productVariant.product', 'payments.paymentChannel'])->latest()->get();

        return response()->json([
            'total_sales' => $orders->sum('total_amount'),
            'total_orders' => $orders->count(),
            'orders' => $orders
        ]);
    }
}
