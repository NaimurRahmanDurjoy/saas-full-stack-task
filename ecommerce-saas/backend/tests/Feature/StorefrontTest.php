<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StorefrontTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_can_view_active_store()
    {
        $owner = User::factory()->create();
        $store = Store::create(['user_id' => $owner->id, 'name' => 'Demo', 'slug' => 'demo', 'status' => 'active']);

        $response = $this->getJson("/api/storefront/demo");
        $response->assertStatus(200)->assertJsonFragment(['name' => 'Demo']);
    }

    public function test_inactive_store_returns_404()
    {
        $owner = User::factory()->create();
        $store = Store::create(['user_id' => $owner->id, 'name' => 'Dead', 'slug' => 'dead', 'status' => 'inactive']);

        $response = $this->getJson("/api/storefront/dead");
        $response->assertStatus(404);
    }

    public function test_inactive_product_is_hidden()
    {
        $owner = User::factory()->create();
        $store = Store::create(['user_id' => $owner->id, 'name' => 'Demo', 'slug' => 'demo', 'status' => 'active']);
        $cat = Category::create(['store_id' => $store->id, 'name' => 'Cat', 'slug' => 'cat', 'status' => 'active']);
        $prod = Product::create(['store_id' => $store->id, 'category_id' => $cat->id, 'name' => 'Hide', 'slug' => 'hide', 'status' => 'inactive']);

        $response = $this->getJson("/api/storefront/demo/products");
        $response->assertStatus(200)->assertJsonMissing(['slug' => 'hide']);
    }

    public function test_store_a_cannot_expose_store_b_products()
    {
        $owner1 = User::factory()->create();
        $store1 = Store::create(['user_id' => $owner1->id, 'name' => 'Store 1', 'slug' => 's1', 'status' => 'active']);
        $cat1 = Category::create(['store_id' => $store1->id, 'name' => 'Cat1', 'slug' => 'c1', 'status' => 'active']);
        $prod1 = Product::create(['store_id' => $store1->id, 'category_id' => $cat1->id, 'name' => 'Prod 1', 'slug' => 'p1', 'status' => 'active']);

        $owner2 = User::factory()->create();
        $store2 = Store::create(['user_id' => $owner2->id, 'name' => 'Store 2', 'slug' => 's2', 'status' => 'active']);
        $cat2 = Category::create(['store_id' => $store2->id, 'name' => 'Cat2', 'slug' => 'c2', 'status' => 'active']);
        $prod2 = Product::create(['store_id' => $store2->id, 'category_id' => $cat2->id, 'name' => 'Prod 2', 'slug' => 'p2', 'status' => 'active']);

        // Request Store 1 products, ensure Prod 2 is completely missing natively natively natively intelligently securely.
        $response = $this->getJson("/api/storefront/s1/products");
        $response->assertStatus(200)
                 ->assertJsonCount(1)
                 ->assertJsonFragment(['slug' => 'p1'])
                 ->assertJsonMissing(['slug' => 'p2']);

        // Check explicit URL manipulation isolation natively checking 404s properly correctly correctly!
        $responseManipulated = $this->getJson("/api/storefront/s1/products/p2");
        $responseManipulated->assertStatus(404);
    }

    public function test_category_filter_respects_store_isolation()
    {
        $owner = User::factory()->create();
        $store1 = Store::create(['user_id' => $owner->id, 'name' => 'Store 1', 'slug' => 's1', 'status' => 'active']);
        $store2 = Store::create(['user_id' => $owner->id, 'name' => 'Store 2', 'slug' => 's2', 'status' => 'active']);
        
        $cat1 = Category::create(['store_id' => $store1->id, 'name' => 'Match', 'slug' => 'cat-slug', 'status' => 'active']);
        $cat2 = Category::create(['store_id' => $store2->id, 'name' => 'Sneaky', 'slug' => 'cat-slug', 'status' => 'active']);

        Product::create(['store_id' => $store1->id, 'category_id' => $cat1->id, 'name' => 'Prod 1', 'slug' => 'p1', 'status' => 'active']);
        Product::create(['store_id' => $store2->id, 'category_id' => $cat2->id, 'name' => 'Prod 2', 'slug' => 'p2', 'status' => 'active']);

        // Querying Store 1 with "cat-slug" must NOT return products from Store 2's category which shares the exact same slug natively!
        $response = $this->getJson("/api/storefront/s1/products?category=cat-slug");
        $response->assertStatus(200)
                 ->assertJsonCount(1)
                 ->assertJsonFragment(['slug' => 'p1'])
                 ->assertJsonMissing(['slug' => 'p2']);
    }

    public function test_product_details_excludes_inactive_variants()
    {
        $owner = User::factory()->create();
        $store = Store::create(['user_id' => $owner->id, 'name' => 'Store 1', 'slug' => 's1', 'status' => 'active']);
        $cat = Category::create(['store_id' => $store->id, 'name' => 'Cat1', 'slug' => 'c1', 'status' => 'active']);
        $prod = Product::create(['store_id' => $store->id, 'category_id' => $cat->id, 'name' => 'P', 'slug' => 'p', 'status' => 'active']);
        
        ProductVariant::create(['store_id' => $store->id, 'product_id' => $prod->id, 'sku' => 'Active-VK', 'price' => 10, 'status' => 'active']);
        ProductVariant::create(['store_id' => $store->id, 'product_id' => $prod->id, 'sku' => 'Dead-VQ', 'price' => 20, 'status' => 'inactive']);

        $response = $this->getJson("/api/storefront/s1/products/p");
        
        $response->assertStatus(200)
                 ->assertJsonFragment(['sku' => 'Active-VK'])
                 ->assertJsonMissing(['sku' => 'Dead-VQ']);
    }
}
