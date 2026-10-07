<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VariantTest extends TestCase
{
    use RefreshDatabase;

    public function test_owner_can_create_variant_with_attributes()
    {
        $owner = User::factory()->create(['role' => 'store_owner']);
        $store = Store::create(['user_id' => $owner->id, 'name' => 'Store', 'slug' => 'st1']);
        $cat = Category::create(['store_id' => $store->id, 'name' => 'Tech', 'slug' => 'tech']);
        $prod = Product::create(['store_id' => $store->id, 'category_id' => $cat->id, 'name' => 'Laptop', 'slug' => 'lap']);

        $response = $this->actingAs($owner)->postJson("/api/products/{$prod->id}/variants", [
            'sku' => 'LAP-123',
            'price' => 1000.50,
            'stock' => 10,
            'attributes' => [
                'Color' => 'Black',
                'Memory' => '16GB'
            ]
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('product_variants', ['store_id' => $store->id, 'product_id' => $prod->id, 'sku' => 'LAP-123']);
        $variantId = $response->json('variant.id');
        $this->assertDatabaseHas('variant_attributes', ['product_variant_id' => $variantId, 'attribute_name' => 'Color', 'attribute_value' => 'Black']);
    }

    public function test_sku_enforces_store_isolation_uniqueness()
    {
        $ownerA = User::factory()->create(['role' => 'store_owner']);
        $storeA = Store::create(['user_id' => $ownerA->id, 'name' => 'Store A', 'slug' => 'stA']);
        $catA = Category::create(['store_id' => $storeA->id, 'name' => 'Tech', 'slug' => 'tech']);
        $prodA = Product::create(['store_id' => $storeA->id, 'category_id' => $catA->id, 'name' => 'LA', 'slug' => 'la']);
        ProductVariant::create(['store_id' => $storeA->id, 'product_id' => $prodA->id, 'sku' => 'VAR-1', 'price' => 10, 'stock' => 1]);

        // Attempt duplicate internally
        $response1 = $this->actingAs($ownerA)->postJson("/api/products/{$prodA->id}/variants", [
            'sku' => 'VAR-1',
            'price' => 12,
            'stock' => 1,
        ]);
        $response1->assertStatus(422)->assertJsonValidationErrors('sku');

        // Store B uses same SKU
        $ownerB = User::factory()->create(['role' => 'store_owner']);
        $storeB = Store::create(['user_id' => $ownerB->id, 'name' => 'B', 'slug' => 'b']);
        $catB = Category::create(['store_id' => $storeB->id, 'name' => 'T', 'slug' => 't']);
        $prodB = Product::create(['store_id' => $storeB->id, 'category_id' => $catB->id, 'name' => 'LB', 'slug' => 'lb']);
        
        $response2 = $this->actingAs($ownerB)->postJson("/api/products/{$prodB->id}/variants", [
            'sku' => 'VAR-1',
            'price' => 14,
            'stock' => 1,
        ]);
        $response2->assertStatus(201); // Allowed!
    }

    public function test_owner_cannot_modify_another_store_variant()
    {
        $ownerA = User::factory()->create(['role' => 'store_owner']);
        $storeA = Store::create(['user_id' => $ownerA->id, 'name' => 'Store A', 'slug' => 'stA']);
        $catA = Category::create(['store_id' => $storeA->id, 'name' => 'Tech', 'slug' => 'tech']);
        $prodA = Product::create(['store_id' => $storeA->id, 'category_id' => $catA->id, 'name' => 'La', 'slug' => 'lap']);
        $varA = ProductVariant::create(['store_id' => $storeA->id, 'product_id' => $prodA->id, 'sku' => 'LAP-123', 'price' => 10, 'stock' => 1]);

        $ownerB = User::factory()->create(['role' => 'store_owner']);

        $response = $this->actingAs($ownerB)->putJson("/api/products/{$prodA->id}/variants/{$varA->id}", [
            'price' => 5000,
        ]);

        $response->assertStatus(403);
    }
}
