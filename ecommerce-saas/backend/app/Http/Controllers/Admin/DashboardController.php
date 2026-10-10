<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\Category;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function getDashboardData(Store $store)
    {
        if ($store->user_id !== Auth::id()) abort(403);

        $totalSales = Order::where('store_id', $store->id)->sum('total_amount');
        $totalOrders = Order::where('store_id', $store->id)->count();
        $totalProducts = Product::where('store_id', $store->id)->count();
        $totalCategories = Category::where('store_id', $store->id)->count();

        $recentOrders = Order::where('store_id', $store->id)
            ->latest()
            ->take(5)
            ->get();

        return response()->json([
            'total_sales' => $totalSales,
            'total_orders' => $totalOrders,
            'total_products' => $totalProducts,
            'total_categories' => $totalCategories,
            'recent_orders' => $recentOrders
        ]);
    }
}
