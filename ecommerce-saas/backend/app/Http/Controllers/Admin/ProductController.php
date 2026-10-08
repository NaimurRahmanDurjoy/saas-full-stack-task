<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use App\Models\Product;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ProductController extends Controller
{
    public function index(Store $store)
    {
        Gate::authorize('viewAny', [Product::class, $store]);
        return response()->json($store->products()->with(['category', 'productVariants.variantAttributes'])->latest()->get());
    }

    public function store(Request $request, Store $store)
    {
        Gate::authorize('create', [Product::class, $store]);

        $validated = $request->validate([
            'category_id' => [
                'required', 
                'exists:categories,id',
                // Explicitly valid if the selected category actually belongs exclusively to THIS store!
                function ($attribute, $value, $fail) use ($store) {
                    $categoryStoreId = \App\Models\Category::where('id', $value)->value('store_id');
                    if ($categoryStoreId !== $store->id) {
                        $fail('The selected category does not belong to your store.');
                    }
                }
            ],
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:products,slug,NULL,id,store_id,' . $store->id],
            'description' => ['nullable', 'string'],
            'status' => ['sometimes', 'in:active,inactive'],
        ]);

        $product = $store->products()->create($validated);

        return response()->json(['message' => 'Product created', 'product' => $product->load('category')], 201);
    }

    public function show(Store $store, Product $product)
    {
        Gate::authorize('view', $product);
        if ($product->store_id !== $store->id) abort(404);
        
        return response()->json($product->load(['category', 'productVariants.variantAttributes']));
    }

    public function update(Request $request, Store $store, Product $product)
    {
        Gate::authorize('update', $product);
        if ($product->store_id !== $store->id) abort(404);

        $validated = $request->validate([
            'category_id' => [
                'sometimes', 
                'exists:categories,id',
                function ($attribute, $value, $fail) use ($store) {
                    $categoryStoreId = \App\Models\Category::where('id', $value)->value('store_id');
                    if ($categoryStoreId !== $store->id) {
                        $fail('The selected category does not belong to your store.');
                    }
                }
            ],
            'name' => ['sometimes', 'string', 'max:255'],
            'slug' => ['sometimes', 'string', 'max:255', 'unique:products,slug,' . $product->id . ',id,store_id,' . $store->id],
            'description' => ['nullable', 'string'],
            'status' => ['sometimes', 'in:active,inactive'],
        ]);

        $product->update($validated);

        return response()->json(['message' => 'Product updated', 'product' => $product->load('category')]);
    }

    public function destroy(Store $store, Product $product)
    {
        Gate::authorize('delete', $product);
        if ($product->store_id !== $store->id) abort(404);

        $product->delete();
        return response()->json(['message' => 'Product deleted'], 204);
    }
}
