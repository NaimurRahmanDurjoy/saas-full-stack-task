<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_owner_can_create_category()
    {
        $owner = User::factory()->create(['role' => 'store_owner']);
        $store = Store::create(['user_id' => $owner->id, 'name' => 'Store', 'slug' => 'st1']);

        $response = $this->actingAs($owner)->postJson("/api/stores/{$store->id}/categories", [
            'name' => 'Tech',
            'slug' => 'tech',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('categories', ['store_id' => $store->id, 'slug' => 'tech']);
    }

    public function test_same_slug_allowed_different_stores()
    {
        $ownerA = User::factory()->create(['role' => 'store_owner']);
        $storeA = Store::create(['user_id' => $ownerA->id, 'name' => 'Store A', 'slug' => 'stA']);
        Category::create(['store_id' => $storeA->id, 'name' => 'Tech', 'slug' => 'tech']);

        $ownerB = User::factory()->create(['role' => 'store_owner']);
        $storeB = Store::create(['user_id' => $ownerB->id, 'name' => 'Store B', 'slug' => 'stB']);

        $response = $this->actingAs($ownerB)->postJson("/api/stores/{$storeB->id}/categories", [
            'name' => 'Tech',
            'slug' => 'tech',
        ]);

        $response->assertStatus(201); // Created perfectly isolated natively!
    }

    public function test_duplicate_slug_rejected_same_store()
    {
        $ownerA = User::factory()->create(['role' => 'store_owner']);
        $storeA = Store::create(['user_id' => $ownerA->id, 'name' => 'Store A', 'slug' => 'stA']);
        Category::create(['store_id' => $storeA->id, 'name' => 'Tech', 'slug' => 'tech']);

        $response = $this->actingAs($ownerA)->postJson("/api/stores/{$storeA->id}/categories", [
            'name' => 'Tech Clone',
            'slug' => 'tech',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors('slug');
    }

    public function test_owner_cannot_modify_another_store_category()
    {
        $ownerA = User::factory()->create(['role' => 'store_owner']);
        $storeA = Store::create(['user_id' => $ownerA->id, 'name' => 'Store A', 'slug' => 'stA']);
        $catA = Category::create(['store_id' => $storeA->id, 'name' => 'Tech', 'slug' => 'tech']);

        $ownerB = User::factory()->create(['role' => 'store_owner']);

        $response = $this->actingAs($ownerB)->putJson("/api/stores/{$storeA->id}/categories/{$catA->id}", [
            'name' => 'Hacked',
        ]);

        $response->assertStatus(403);
    }
}
