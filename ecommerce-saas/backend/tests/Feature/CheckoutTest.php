<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CheckoutTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_checkout()
    {
        $this->withoutExceptionHandling(); // Expose root cause accurately identically

        $owner = User::factory()->create();
        $store = Store::create(['user_id' => $owner->id, 'name' => 'Store', 'slug' => 's1', 'status' => 'active']);
        $cat = Category::create(['store_id' => $store->id, 'name' => 'Cat', 'slug' => 'c1', 'status' => 'active']);
        $prod = Product::create(['store_id' => $store->id, 'category_id' => $cat->id, 'name' => 'Prod', 'slug' => 'p1', 'status' => 'active']);
        $variant = ProductVariant::create(['store_id' => $store->id, 'product_id' => $prod->id, 'sku' => 'V1', 'price' => 100, 'stock' => 5, 'status' => 'active']);

        $payload = array(
            'customer_name' => 'John',
            'customer_email' => 'john@test.com',
            'shipping_address' => '123 Test St',
            'items' => array(
                array(
                    'variant_id' => $variant->id,
                    'quantity' => 2,
                    'price' => 10,
                    'subtotal' => 20
                )
            )
        );

        $response = $this->postJson("/api/storefront/s1/checkout", $payload);

        $response->assertStatus(201);
        $response->assertJsonFragment(array('total_amount' => 200));
    }
}
