<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use App\Models\Category;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class CategoryController extends Controller
{
    public function index(Store $store)
    {
        Gate::authorize('viewAny', [Category::class, $store]);
        return response()->json($store->categories);
    }

    public function store(Request $request, Store $store)
    {
        Gate::authorize('create', [Category::class, $store]);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:categories,slug,NULL,id,store_id,' . $store->id],
            'description' => ['nullable', 'string'],
            'status' => ['sometimes', 'in:active,inactive'],
        ]);

        $category = $store->categories()->create($validated);

        return response()->json(['message' => 'Category created', 'category' => $category], 201);
    }

    public function show(Store $store, Category $category)
    {
        Gate::authorize('view', $category);
        if ($category->store_id !== $store->id) abort(404);
        
        return response()->json($category);
    }

    public function update(Request $request, Store $store, Category $category)
    {
        Gate::authorize('update', $category);
        if ($category->store_id !== $store->id) abort(404);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'slug' => ['sometimes', 'string', 'max:255', 'unique:categories,slug,' . $category->id . ',id,store_id,' . $store->id],
            'description' => ['nullable', 'string'],
            'status' => ['sometimes', 'in:active,inactive'],
        ]);

        $category->update($validated);

        return response()->json(['message' => 'Category updated', 'category' => $category]);
    }

    public function destroy(Store $store, Category $category)
    {
        Gate::authorize('delete', $category);
        if ($category->store_id !== $store->id) abort(404);

        $category->delete();
        return response()->json(['message' => 'Category deleted'], 204);
    }
}
