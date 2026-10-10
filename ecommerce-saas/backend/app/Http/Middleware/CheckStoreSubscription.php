<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Store;
use App\Models\Subscription;

class CheckStoreSubscription
{
    public function handle(Request $request, Closure $next)
    {
        $store = null;

        // Extract store from route parameters
        if ($request->route('store')) {
            $storeIdentifier = $request->route('store');
            if ($storeIdentifier instanceof Store) {
                $store = $storeIdentifier;
            } else {
                $store = Store::find($storeIdentifier);
            }
        } elseif ($request->route('store_slug')) {
            $store = Store::where('slug', $request->route('store_slug'))->first();
        } elseif ($request->route('storeId')) {
            $store = Store::find($request->route('storeId'));
        }

        if ($store) {
            $hasActiveSubscription = Subscription::where('store_id', $store->id)
                ->where('status', 'active')
                ->where(function ($query) {
                    $query->whereNull('ends_at')->orWhere('ends_at', '>=', now());
                })
                ->exists();

            if (!$hasActiveSubscription) {
                return response()->json([
                    'message' => 'Store subscription has expired or is inactive. Please renew your package.'
                ], 402); // 402 Payment Required
            }
        }

        return $next($request);
    }
}
