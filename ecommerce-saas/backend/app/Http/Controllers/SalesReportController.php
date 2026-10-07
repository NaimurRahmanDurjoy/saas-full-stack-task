<?php

namespace App\Http\Controllers;

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

    public function ownerReport($storeId)
    {
        $store = Store::where('id', $storeId)->where('user_id', Auth::id())->firstOrFail();
        $ordersQuery = Order::where('store_id', $store->id);
        return response()->json([
            'total_sales' => $ordersQuery->sum('total_amount'),
            'total_orders' => $ordersQuery->count()
        ]);
    }
}
