<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;

use App\Models\Store;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class StorefrontController extends Controller
{
    /**
     * Helper to eagerly fetch active store from slug.
     */
    protected function getActiveStore($slug)
    {
        return Store::where('slug', $slug)->where('status', 'active')->firstOrFail();
    }

    public function showStore($store_slug)
    {
        $store = $this->getActiveStore($store_slug);
        
        // Hide sensitive backend information from public endpoint
        return response()->json([
            'id' => $store->id, // Generally exposed safely for client IDs.
            'name' => $store->name,
            'description' => $store->description,
            'slug' => $store->slug,
        ]);
    }

    public function categories($store_slug)
    {
        $store = $this->getActiveStore($store_slug);

        $categories = Category::where('store_id', $store->id)
            ->where('status', 'active')
            ->select(['id', 'name', 'slug', 'description'])
            ->get();

        return response()->json($categories);
    }

    public function products(Request $request, $store_slug)
    {
        $store = $this->getActiveStore($store_slug);

        $query = Product::where('store_id', $store->id)
            ->where('status', 'active')
            ->with(['category:id,name,slug']); // Minimal category structure

        if ($request->has('category')) {
            $catSlug = $request->input('category');
            $query->whereHas('category', function ($q) use ($store, $catSlug) {
                // Ensure filtered category slug natively limits precisely within same store cleanly natively globally
                $q->where('store_id', $store->id)
                  ->where('slug', $catSlug)
                  ->where('status', 'active');
            });
        }

        $products = $query->select(['id', 'category_id', 'name', 'slug', 'description'])
            ->paginate(15);

        return response()->json($products);
    }

    public function productDetails($store_slug, $product_slug)
    {
        $store = $this->getActiveStore($store_slug);

        $product = Product::where('store_id', $store->id)
            ->where('slug', $product_slug)
            ->where('status', 'active')
            ->with([
                'category:id,name,slug',
                'productVariants' => function ($q) use ($store) {
                    $q->where('store_id', $store->id)
                       ->where('status', 'active')
                       ->select(['id', 'product_id', 'sku', 'price', 'image_url', 'stock'])
                       ->with('variantAttributes:id,product_variant_id,attribute_name,attribute_value');
                }
            ])
            ->select(['id', 'category_id', 'name', 'slug', 'description'])
            ->firstOrFail();

        return response()->json($product);
    }
}
