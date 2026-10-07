<?php

namespace Tests\Feature;

use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StoreIsolationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Clear cached permissions if any
        $this->artisan('cache:clear');
    }

    public function test_store_owner_can_create_store()
    {
        $user = User::factory()->create(['role' => 'store_owner']);
        $this->actingAs($user);

        $response = $this->postJson('/api/stores', [
            'name' => 'My New Store',
            'slug' => 'my-new-store',
            'description' => 'Great store',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('stores', [
            'user_id' => $user->id,
            'slug' => 'my-new-store',
        ]);
    }

    public function test_store_owner_lists_only_own_stores()
    {
        $ownerA = User::factory()->create(['role' => 'store_owner']);
        $ownerB = User::factory()->create(['role' => 'store_owner']);

        // Directly insert passing validation easily using Eloquent
        Store::create(['user_id' => $ownerA->id, 'name' => 'Store A1', 'slug' => 'store-a1']);
        Store::create(['user_id' => $ownerA->id, 'name' => 'Store A2', 'slug' => 'store-a2']);
        Store::create(['user_id' => $ownerB->id, 'name' => 'Store B1', 'slug' => 'store-b1']);

        $this->actingAs($ownerA);

        $response = $this->getJson('/api/stores');
        
        $response->assertStatus(200)
                 ->assertJsonCount(2)
                 ->assertJsonFragment(['slug' => 'store-a1'])
                 ->assertJsonFragment(['slug' => 'store-a2'])
                 ->assertJsonMissing(['slug' => 'store-b1']);
    }

    public function test_store_owner_can_view_own_store()
    {
        $ownerA = User::factory()->create(['role' => 'store_owner']);
        $storeA = Store::create(['user_id' => $ownerA->id, 'name' => 'Store A1', 'slug' => 'store-a1']);

        $this->actingAs($ownerA);

        $response = $this->getJson("/api/stores/{$storeA->id}");
        $response->assertStatus(200)->assertJsonFragment(['slug' => 'store-a1']);
    }

    public function test_store_owner_can_update_own_store()
    {
        $ownerA = User::factory()->create(['role' => 'store_owner']);
        $storeA = Store::create(['user_id' => $ownerA->id, 'name' => 'Store A1', 'slug' => 'store-a1']);

        $this->actingAs($ownerA);

        $response = $this->putJson("/api/stores/{$storeA->id}", [
            'name' => 'Updated Name'
        ]);
        
        $response->assertStatus(200);
        $this->assertDatabaseHas('stores', ['id' => $storeA->id, 'name' => 'Updated Name']);
    }

    public function test_store_owner_cannot_access_another_store()
    {
        $ownerA = User::factory()->create(['role' => 'store_owner']);
        $ownerB = User::factory()->create(['role' => 'store_owner']);
        
        $storeB = Store::create(['user_id' => $ownerB->id, 'name' => 'Store B1', 'slug' => 'store-b1']);

        $this->actingAs($ownerA);

        $response = $this->getJson("/api/stores/{$storeB->id}");
        $response->assertStatus(403); // Forbidden
    }

    public function test_store_owner_cannot_update_another_store()
    {
        $ownerA = User::factory()->create(['role' => 'store_owner']);
        $ownerB = User::factory()->create(['role' => 'store_owner']);
        
        $storeB = Store::create(['user_id' => $ownerB->id, 'name' => 'Store B1', 'slug' => 'store-b1']);

        $this->actingAs($ownerA);

        $response = $this->putJson("/api/stores/{$storeB->id}", [
            'name' => 'Hacked Name'
        ]);
        
        $response->assertStatus(403);
        $this->assertDatabaseHas('stores', ['id' => $storeB->id, 'name' => 'Store B1']);
    }

    public function test_store_owner_cannot_delete_another_store()
    {
        $ownerA = User::factory()->create(['role' => 'store_owner']);
        $ownerB = User::factory()->create(['role' => 'store_owner']);
        
        $storeB = Store::create(['user_id' => $ownerB->id, 'name' => 'Store B1', 'slug' => 'store-b1']);

        $this->actingAs($ownerA);

        $response = $this->deleteJson("/api/stores/{$storeB->id}");
        
        $response->assertStatus(403);
        $this->assertDatabaseHas('stores', ['id' => $storeB->id]);
    }
}
