<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class StoreController extends Controller
{
    public function index(Request $request)
    {
        // Only queries stores accessible to the authenticated user.
        $stores = Store::with(['subscriptions.subscriptionPayments', 'subscriptions.package'])->where('user_id', $request->user()->id)->get();
        return response()->json($stores);
    }

    public function store(Request $request)
    {
        Gate::authorize('create', Store::class);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:stores,slug'],
            'description' => ['nullable', 'string'],
        ]);

        $store = Store::create([
            'user_id' => $request->user()->id, // Derived exclusively from auth
            'name' => $validated['name'],
            'slug' => $validated['slug'],
            'description' => $validated['description'] ?? null,
            'status' => 'active',
        ]);

        return response()->json([
            'message' => 'Store created successfully',
            'store' => $store,
        ], 201);
    }

    public function show(Store $store)
    {
        Gate::authorize('view', $store);
        $store->load(['subscriptions.package']);
        return response()->json($store);
    }

    public function update(Request $request, Store $store)
    {
        Gate::authorize('update', $store);

        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => ['sometimes', 'required', 'string', 'max:255', "unique:stores,slug,{$store->id}"],
            'description' => ['nullable', 'string'],
            'status' => ['sometimes', 'required', 'in:active,inactive'],
        ]);

        $store->update($validated);

        return response()->json([
            'message' => 'Store updated successfully',
            'store' => $store,
        ]);
    }

    public function destroy(Store $store)
    {
        Gate::authorize('delete', $store);

        $store->delete();

        return response()->json([
            'message' => 'Store deleted successfully'
        ], 204);
    }
}
