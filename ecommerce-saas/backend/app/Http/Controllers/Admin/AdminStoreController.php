<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Store;
use Illuminate\Http\Request;

class AdminStoreController extends Controller
{
    public function index()
    {
        // View all stores
        return response()->json(Store::with('user')->get());
    }

    public function show(Store $store)
    {
        return response()->json($store->load('user'));
    }

    public function updateStatus(Request $request, Store $store)
    {
        $validated = $request->validate([
            'status' => 'required|in:active,inactive'
        ]);

        $store->update($validated);
        return response()->json($store);
    }
}
