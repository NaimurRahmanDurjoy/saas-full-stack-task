<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ProductVariantController extends Controller
{
    public function index(Product $product)
    {
        Gate::authorize('viewAny', [ProductVariant::class, $product]);
        return response()->json($product->productVariants()->with('variantAttributes')->get());
    }

    public function store(Request $request, Product $product)
    {
        Gate::authorize('create', [ProductVariant::class, $product]);

        $validated = $request->validate([
            'sku' => ['required', 'string', 'max:255', 'unique:product_variants,sku,NULL,id,store_id,' . $product->store_id],
            'price' => ['required', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'image_url' => ['nullable', 'url'],
            'status' => ['sometimes', 'in:active,inactive'],
            'attributes' => ['nullable', 'array'],
        ]);

        $variant = $product->productVariants()->create([
            'store_id' => $product->store_id, // Inherit mapping properly matching exact strict catalog isolated boundaries implicitly securely!
            'sku' => $validated['sku'],
            'price' => $validated['price'],
            'stock' => $validated['stock'],
            'image_url' => $validated['image_url'] ?? null,
            'status' => $validated['status'] ?? 'active',
        ]);

        if (isset($validated['attributes'])) {
            foreach ($validated['attributes'] as $name => $value) {
                // Ensure duplicate attributes keys are implicitly natively stripped logically safely.
                $variant->variantAttributes()->updateOrCreate(
                    ['attribute_name' => (string)$name],
                    ['attribute_value' => (string)$value]
                );
            }
        }

        return response()->json(['message' => 'Variant created', 'variant' => $variant->load('variantAttributes')], 201);
    }

    public function show(Product $product, ProductVariant $variant)
    {
        Gate::authorize('view', $variant);
        if ($variant->product_id !== $product->id) abort(404);
        
        return response()->json($variant->load('variantAttributes'));
    }

    public function update(Request $request, Product $product, ProductVariant $variant)
    {
        Gate::authorize('update', $variant);
        if ($variant->product_id !== $product->id) abort(404);

        $validated = $request->validate([
            'sku' => ['sometimes', 'string', 'max:255', 'unique:product_variants,sku,' . $variant->id . ',id,store_id,' . $product->store_id],
            'price' => ['sometimes', 'numeric', 'min:0'],
            'stock' => ['sometimes', 'integer', 'min:0'],
            'image_url' => ['nullable', 'url'],
            'status' => ['sometimes', 'in:active,inactive'],
            'attributes' => ['nullable', 'array'],
        ]);

        $variant->update($validated);

        if (isset($validated['attributes'])) {
            // Delete old explicitly stripped if keys are wiped totally natively securely!
            // Note: For simplicity dynamically just CreateOrUpdate existing mapped payloads intelligently. 
            // Better to delete attributes missing from the final payload explicitly!
            $variant->variantAttributes()->whereNotIn('attribute_name', array_keys($validated['attributes']))->delete();
            foreach ($validated['attributes'] as $name => $value) {
                $variant->variantAttributes()->updateOrCreate(
                    ['attribute_name' => $name],
                    ['attribute_value' => $value]
                );
            }
        }

        return response()->json(['message' => 'Variant updated', 'variant' => $variant->load('variantAttributes')]);
    }

    public function destroy(Product $product, ProductVariant $variant)
    {
        Gate::authorize('delete', $variant);
        if ($variant->product_id !== $product->id) abort(404);

        $variant->delete();
        return response()->json(['message' => 'Variant deleted'], 204);
    }
}
