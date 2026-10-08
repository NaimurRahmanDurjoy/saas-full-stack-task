<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Package;
use App\Models\Store;
use App\Models\Order;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class Phase10AdminManagementTest extends TestCase
{
    use RefreshDatabase;

    private $admin;
    private $owner;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = \App\Models\Admin::create(['name' => 'Admin', 'email' => 'admin@admin.com', 'password' => bcrypt('password')]);
        $this->owner = User::factory()->create(['role' => 'customer']);
    }

    public function test_admin_can_manage_packages()
    {
        $this->actingAs($this->admin);

        $response = $this->postJson('/api/admin/packages', [
            'name' => 'Pro Plan',
            'price' => 100,
            'store_limit' => 5,
            'status' => 'active'
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('packages', ['name' => 'Pro Plan']);

        $package = Package::first();
        $this->patchJson("/api/admin/packages/{$package->id}/status", ['status' => 'inactive'])->assertStatus(200);
        $this->assertDatabaseHas('packages', ['status' => 'inactive']);
    }

    public function test_admin_can_list_and_toggle_stores()
    {
        $store = Store::create([
            'name' => 'Demo',
            'slug' => 'demo',
            'user_id' => $this->owner->id,
            'status' => 'active'
        ]);

        $this->actingAs($this->admin)
            ->getJson('/api/admin/stores')
            ->assertStatus(200)
            ->assertJsonCount(1);

        $this->patchJson("/api/admin/stores/{$store->id}/status", ['status' => 'inactive'])
            ->assertStatus(200);

        $this->assertDatabaseHas('stores', ['id' => $store->id, 'status' => 'inactive']);
    }

    public function test_owner_cannot_access_admin_endpoints()
    {
        $this->actingAs($this->owner)
            ->getJson('/api/admin/stores')
            ->assertStatus(403);
    }

    public function test_owner_can_only_view_own_store_orders()
    {
        $store = Store::create(['name' => 'Store 1', 'slug' => 'st1', 'user_id' => $this->owner->id]);
        $order = Order::create([
            'store_id' => $store->id, 
            'user_id' => null,
            'total_amount' => 100,
            'customer_name' => 'John',
            'customer_email' => 'john@test.com',
            'customer_phone' => '1234',
            'shipping_address' => '123 Street'
        ]);

        $otherOwner = User::factory()->create(['role' => 'customer']);
        $otherStore = Store::create(['name' => 'Store 2', 'slug' => 'st2', 'user_id' => $otherOwner->id]);

        $this->actingAs($this->owner)
            ->getJson("/api/stores/{$store->id}/orders")
            ->assertStatus(200)
            ->assertJsonCount(1);

        $this->actingAs($this->owner)
            ->getJson("/api/stores/{$otherStore->id}/orders")
            ->assertStatus(404);
    }
}
