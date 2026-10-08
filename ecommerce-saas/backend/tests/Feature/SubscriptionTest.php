<?php

namespace Tests\Feature;

use App\Models\Package;
use App\Models\PaymentChannel;
use App\Models\Store;
use App\Models\Subscription;
use App\Models\SubscriptionPayment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SubscriptionTest extends TestCase
{
    use RefreshDatabase;

    public function test_owner_can_select_package_and_create_subscription()
    {
        $owner = User::factory()->create();
        $store = Store::create(['user_id' => $owner->id, 'name' => 'Store', 'slug' => 's1', 'status' => 'active']);
        $package = Package::create(['name' => 'Basic', 'slug' => 'basic', 'price' => 50, 'status' => 'active']);

        $response = $this->actingAs($owner)->postJson("/api/stores/{$store->id}/subscriptions", [
            'package_id' => $package->id
        ]);

        $response->assertStatus(201)
                 ->assertJsonFragment(['status' => 'pending']);
    }

    public function test_owner_can_submit_subscription_payment()
    {
        $owner = User::factory()->create();
        $store = Store::create(['user_id' => $owner->id, 'name' => 'Store', 'slug' => 's1']);
        $package = Package::create(['name' => 'Basic', 'slug' => 'basic', 'price' => 50, 'status' => 'active']);
        $subscription = Subscription::create(['store_id' => $store->id, 'package_id' => $package->id, 'status' => 'pending']);
        $channel = PaymentChannel::create(['name' => 'Bank', 'type' => 'manual', 'status' => 'active']);

        $response = $this->actingAs($owner)->postJson("/api/subscriptions/{$subscription->id}/payments", [
            'payment_channel_id' => $channel->id,
            'amount' => 50,
            'transaction_id' => 'SUB-TXN-123',
            'account_number' => '01712345678'
        ]);

        $response->assertStatus(201)
                 ->assertJsonFragment(['transaction_id' => 'SUB-TXN-123']);
                 
        $this->assertDatabaseHas('subscription_payments', [
            'transaction_id' => 'SUB-TXN-123',
            'account_number' => '01712345678'
        ]);
    }

    public function test_store_with_active_subscription_cannot_create_another()
    {
        $owner = User::factory()->create();
        $store = Store::create(['user_id' => $owner->id, 'name' => 'Store', 'slug' => 's1']);
        $package = Package::create(['name' => 'Basic', 'slug' => 'basic', 'price' => 50, 'status' => 'active']);
        Subscription::create(['store_id' => $store->id, 'package_id' => $package->id, 'status' => 'active']);

        $response = $this->actingAs($owner)->postJson("/api/stores/{$store->id}/subscriptions", [
            'package_id' => $package->id
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors(['store']);
    }

    public function test_store_with_pending_subscription_cannot_create_another()
    {
        $owner = User::factory()->create();
        $store = Store::create(['user_id' => $owner->id, 'name' => 'Store', 'slug' => 's1']);
        $package = Package::create(['name' => 'Basic', 'slug' => 'basic', 'price' => 50, 'status' => 'active']);
        Subscription::create(['store_id' => $store->id, 'package_id' => $package->id, 'status' => 'pending']);

        $response = $this->actingAs($owner)->postJson("/api/stores/{$store->id}/subscriptions", [
            'package_id' => $package->id
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors(['store']);
    }

    public function test_admin_can_verify_subscription_payment()
    {
        $admin = \App\Models\Admin::create(['name' => 'Admin', 'email' => 'admin@admin.com', 'password' => bcrypt('password')]);
        $store = Store::create(['user_id' => User::factory()->create()->id, 'name' => 'Store', 'slug' => 's1']);
        $package = Package::create(['name' => 'Basic', 'slug' => 'basic', 'price' => 50, 'status' => 'active', 'billing_period' => 'monthly']);
        $subscription = Subscription::create(['store_id' => $store->id, 'package_id' => $package->id, 'status' => 'pending']);
        $channel = PaymentChannel::create(['name' => 'Bank', 'type' => 'manual', 'status' => 'active']);
        
        $payment = SubscriptionPayment::create([
            'subscription_id' => $subscription->id,
            'payment_channel_id' => $channel->id,
            'amount' => 50,
            'transaction_id' => 'TXN-1',
            'account_number' => '12345',
            'status' => 'pending'
        ]);

        $response = $this->actingAs($admin)->postJson("/api/admin/subscription-payments/{$payment->id}/verify", [
            'status' => 'verified'
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('subscriptions', [
            'id' => $subscription->id,
            'status' => 'active'
        ]);
        $this->assertDatabaseHas('subscription_payments', [
            'id' => $payment->id,
            'status' => 'verified',
            'verified_by' => $admin->id
        ]);
    }

    public function test_non_admin_cannot_access_verification_endpoints()
    {
        $user = User::factory()->create(['role' => 'customer']);
        
        $response = $this->actingAs($user)->getJson('/api/admin/subscription-payments');
        $response->assertStatus(403);
    }
}
