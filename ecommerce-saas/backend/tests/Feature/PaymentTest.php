<?php

namespace Tests\Feature;

use App\Http\Controllers\Storefront\PaymentController;
use App\Models\Category;
use App\Models\Order;
use App\Models\PaymentChannel;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PaymentTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_submit_payment_with_token()
    {
        $owner = User::factory()->create();
        $store = Store::create(['user_id' => $owner->id, 'name' => 'Store', 'slug' => 's1', 'status' => 'active']);
        $channel = PaymentChannel::create(['name' => 'Bank', 'type' => 'manual', 'status' => 'active']);
        
        $order = Order::create([
            'store_id' => $store->id, 
            'customer_name' => 'John', 
            'customer_email' => 'j@j.com', 
            'shipping_address' => '123',
            'total_amount' => 500,
            'status' => 'pending'
        ]);

        $token = PaymentController::generateGuestToken($order);

        $payload = [
            'guest_token' => $token,
            'payment_channel_id' => $channel->id,
            'amount' => 500,
            'transaction_id' => 'TXN-12345'
        ];

        $response = $this->postJson("/api/storefront/s1/orders/{$order->id}/payments", $payload);
        
        $response->assertStatus(201)
                 ->assertJsonFragment(['transaction_id' => 'TXN-12345', 'status' => 'pending']);
        
        // Assert duplicate block dynamically
        $response2 = $this->postJson("/api/storefront/s1/orders/{$order->id}/payments", $payload);
        $response2->assertStatus(422) // Unique transaction ID validation elegantly blocks implicitly gracefully natively!
                  ->assertJsonValidationErrors('transaction_id');
    }

    public function test_payment_fails_with_invalid_token()
    {
        $owner = User::factory()->create();
        $store = Store::create(['user_id' => $owner->id, 'name' => 'Store', 'slug' => 's1', 'status' => 'active']);
        $order = Order::create([
            'store_id' => $store->id, 
            'customer_name' => 'John', 
            'customer_email' => 'j@j.com', 
            'shipping_address' => '123',
            'total_amount' => 500,
        ]);
        $channel = PaymentChannel::create(['name' => 'Bank', 'type' => 'manual', 'status' => 'active']);

        $payload = [
            'guest_token' => 'invalid-hack-token',
            'payment_channel_id' => $channel->id,
            'amount' => 500,
            'transaction_id' => 'TXN-000'
        ];

        $response = $this->postJson("/api/storefront/s1/orders/{$order->id}/payments", $payload);
        $response->assertStatus(403);
    }
}
