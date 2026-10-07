<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Package;
use App\Models\Payment;
use App\Models\PaymentChannel;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Store;
use App\Models\Subscription;
use App\Models\User;
use App\Models\VariantAttribute;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin User
        $management = \App\Models\Admin::create([
            'name' => 'Management Admin',
            'email' => 'management@example.com',
            'password' => Hash::make('password'),
            'role' => 'super_admin',
        ]);

        $owner = User::create([
            'name' => 'Store Owner',
            'email' => 'owner@example.com',
            'password' => Hash::make('password'),
            'role' => 'store_owner',
        ]);

        $customer = User::create([
            'name' => 'Customer User',
            'email' => 'customer@example.com',
            'password' => Hash::make('password'),
            'role' => 'customer',
        ]);

        // Packages
        $basicPkg = Package::create([
            'name' => 'Basic Package',
            'slug' => 'basic-package',
            'description' => 'Great for small stores',
            'price' => 29.99,
            'billing_period' => 'monthly',
        ]);

        $proPkg = Package::create([
            'name' => 'Pro Package',
            'slug' => 'pro-package',
            'description' => 'For growing businesses',
            'price' => 79.99,
            'billing_period' => 'monthly',
        ]);

        // Stores
        $store = Store::create([
            'user_id' => $owner->id,
            'name' => 'Awesome Store',
            'slug' => 'awesome-store',
            'description' => 'The best store ever',
        ]);

        // Subscriptions
        Subscription::create([
            'store_id' => $store->id,
            'package_id' => $basicPkg->id,
            'status' => 'active',
            'starts_at' => Carbon::now(),
            'ends_at' => Carbon::now()->addMonth(),
        ]);

        // Categories
        $category1 = Category::create([
            'store_id' => $store->id,
            'name' => 'Electronics',
            'slug' => 'electronics',
        ]);
        
        $category2 = Category::create([
            'store_id' => $store->id,
            'name' => 'Clothing',
            'slug' => 'clothing',
        ]);

        // Products
        $product = Product::create([
            'store_id' => $store->id,
            'category_id' => $category1->id,
            'name' => 'Awesome Laptop',
            'slug' => 'awesome-laptop',
            'description' => 'High performance laptop',
        ]);

        $product2 = Product::create([
            'store_id' => $store->id,
            'category_id' => $category2->id,
            'name' => 'Cool T-Shirt',
            'slug' => 'cool-tshirt',
        ]);

        // Variants
        $variant1 = ProductVariant::create([
            'store_id' => $store->id,
            'product_id' => $product->id,
            'sku' => 'LAP-001',
            'price' => 1200.00,
            'stock' => 50,
        ]);

        $variant2 = ProductVariant::create([
            'store_id' => $store->id,
            'product_id' => $product->id,
            'sku' => 'LAP-002',
            'price' => 1500.00,
            'stock' => 20,
        ]);

        // Attributes
        VariantAttribute::create([
            'product_variant_id' => $variant1->id,
            'attribute_name' => 'RAM',
            'attribute_value' => '16GB',
        ]);

        VariantAttribute::create([
            'product_variant_id' => $variant2->id,
            'attribute_name' => 'RAM',
            'attribute_value' => '32GB',
        ]);

        // Payment Channel
        $channel = PaymentChannel::create([
            'name' => 'Bank Transfer',
            'type' => 'manual',
            'account_number' => '123-456-789',
            'instructions' => 'Please transfer to this account.',
        ]);

        // Order
        $order = Order::create([
            'store_id' => $store->id,
            'user_id' => $customer->id,
            'customer_name' => 'John Doe',
            'customer_email' => 'john@example.com',
            'customer_phone' => '1234567890',
            'shipping_address' => '123 Fake Street, NY',
            'total_amount' => 2700.00,
            'status' => 'pending',
        ]);

        // Order Items
        OrderItem::create([
            'order_id' => $order->id,
            'product_variant_id' => $variant1->id,
            'quantity' => 1,
            'unit_price' => 1200.00,
            'subtotal' => 1200.00,
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'product_variant_id' => $variant2->id,
            'quantity' => 1,
            'unit_price' => 1500.00,
            'subtotal' => 1500.00,
        ]);

        // Payment
        Payment::create([
            'order_id' => $order->id,
            'payment_channel_id' => $channel->id,
            'amount' => 2700.00,
            'account_number' => '987-654-321',
            'transaction_id' => 'TXN-ABC-123',
            'status' => 'pending',
        ]);
    }
}
