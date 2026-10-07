<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    public function test_owner_can_create_product()
    {
        $owner = User::factory()->create(['role' => 'store_owner']);
        $store = Store::create(['user_id' => $owner->id, 'name' => 'Store', 'slug' => 'st1']);
        $cat = Category::create(['store_id' => $store->id, 'name' => 'Tech', 'slug' => 'tech']);

        $response = $this->actingAs($owner)->postJson("/api/stores/{$store->id}/products", [
            'category_id' => $cat->id,
            'name' => 'Laptop',
            'slug' => 'laptop',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('products', ['store_id' => $store->id, 'category_id' => $cat->id]);
    }

    public function test_reject_cross_store_category_assignment()
    {
        $ownerA = User::factory()->create(['role' => 'store_owner']);
        $storeA = Store::create(['user_id' => $ownerA->id, 'name' => 'Store A', 'slug' => 'stA']);
        $catA = Category::create(['store_id' => $storeA->id, 'name' => 'Tech', 'slug' => 'tech']);

        $ownerB = User::factory()->create(['role' => 'store_owner']);
        $storeB = Store::create(['user_id' => $ownerB->id, 'name' => 'Store B', 'slug' => 'stB']);

        $response = $this->actingAs($ownerB)->postJson("/api/stores/{$storeB->id}/products", [
            'category_id' => $catA->id, // Attempt to steal Store A's category
            'name' => 'Laptop',
            'slug' => 'laptop',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors('category_id');
    }

    public function test_owner_cannot_modify_another_store_product()
    {
        $ownerA = User::factory()->create(['role' => 'store_owner']);
        $storeA = Store::create(['user_id' => $ownerA->id, 'name' => 'Store A', 'slug' => 'stA']);
        $catA = Category::create(['store_id' => $storeA->id, 'name' => 'Tech', 'slug' => 'tech']);
        $prodA = Product::create(['store_id' => $storeA->id, 'category_id' => $catA->id, 'name' => 'Laptop', 'slug' => 'lap']);

        $ownerB = User::factory()->create(['role' => 'store_owner']);

        $response = $this->actingAs($ownerB)->putJson("/api/stores/{$storeA->id}/products/{$prodA->id}", [
            'name' => 'Hacked',
        ]);

        $response->assertStatus(403);
    }
}
