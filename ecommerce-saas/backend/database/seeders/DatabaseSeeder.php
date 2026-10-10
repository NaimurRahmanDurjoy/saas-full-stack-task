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
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Management Admin
        $management = \App\Models\Admin::create([
            'name' => 'Management Admin',
            'email' => 'admin@cartessa.com',
            'password' => Hash::make('password'),
            'role' => 'super_admin',
        ]);

        // 2. Create Users (Bangladeshi Names)
        $owner1 = User::create([
            'name' => 'Md. Naimur Rahman',
            'email' => 'naim@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'store_owner',
        ]);

        $owner2 = User::create([
            'name' => 'Rakibul Islam',
            'email' => 'rakib@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'store_owner',
        ]);

        $customer1 = User::create([
            'name' => 'Tanvir Ahmed',
            'email' => 'tanvir@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'customer',
        ]);

        $customer2 = User::create([
            'name' => 'Sadia Afrin',
            'email' => 'sadia@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'customer',
        ]);

        // 3. Create Packages
        $monthlyPkg = Package::create([
            'name' => 'Monthly',
            'slug' => 'monthly',
            'description' => 'Billed every month',
            'price' => 1000.00,
            'billing_period' => 'monthly',
        ]);

        $quarterlyPkg = Package::create([
            'name' => 'Quarterly',
            'slug' => 'quarterly',
            'description' => 'Billed every 3 months',
            'price' => 2800.00,
            'billing_period' => 'quarterly',
        ]);

        $halfYearlyPkg = Package::create([
            'name' => 'Half-Yearly',
            'slug' => 'half-yearly',
            'description' => 'Billed every 6 months',
            'price' => 5500.00,
            'billing_period' => 'half-yearly',
        ]);

        $yearlyPkg = Package::create([
            'name' => 'Yearly',
            'slug' => 'yearly',
            'description' => 'Billed every 12 months',
            'price' => 10000.00,
            'billing_period' => 'yearly',
        ]);

        // 4. Create Payment Channels (Banking and MFS)
        $bkash = PaymentChannel::create([
            'name' => 'bKash',
            'type' => 'MFS',
            'account_number' => '01711000000',
            'instructions' => 'Please send money to this bKash Personal number.',
        ]);

        $nagad = PaymentChannel::create([
            'name' => 'Nagad',
            'type' => 'MFS',
            'account_number' => '01911000000',
            'instructions' => 'Please send money to this Nagad Personal number.',
        ]);

        $rocket = PaymentChannel::create([
            'name' => 'Rocket',
            'type' => 'MFS',
            'account_number' => '018110000009',
            'instructions' => 'Please send money to this Rocket account.',
        ]);

        $bank = PaymentChannel::create([
            'name' => 'City Bank',
            'type' => 'banking',
            'account_number' => '11025544778899',
            'instructions' => 'Transfer to City Bank, Branch: Gulshan.',
        ]);

        // 5. Create Stores
        $store1 = Store::create([
            'user_id' => $owner1->id,
            'name' => 'Naim Gadgets',
            'slug' => 'naim-gadgets',
            'description' => 'Premium tech gadgets and accessories in Bangladesh.',
        ]);

        $store2 = Store::create([
            'user_id' => $owner2->id,
            'name' => 'Rakib Fashion',
            'slug' => 'rakib-fashion',
            'description' => 'Trendy clothing and fashion items for everyone.',
        ]);

        // 6. Subscriptions
        Subscription::create([
            'store_id' => $store1->id,
            'package_id' => $yearlyPkg->id,
            'status' => 'active',
            'starts_at' => Carbon::now()->subDays(10),
            'ends_at' => Carbon::now()->addYear()->subDays(10),
        ]);

        Subscription::create([
            'store_id' => $store2->id,
            'package_id' => $monthlyPkg->id,
            'status' => 'active',
            'starts_at' => Carbon::now(),
            'ends_at' => Carbon::now()->addMonth(),
        ]);

        // 7. Categories (Minimum 15)
        // Store 1 Categories (Tech)
        $catSmartphones = Category::create(['store_id' => $store1->id, 'name' => 'Smartphones', 'slug' => Str::slug('Smartphones')]);
        $catLaptops = Category::create(['store_id' => $store1->id, 'name' => 'Laptops', 'slug' => Str::slug('Laptops')]);
        $catAccessories = Category::create(['store_id' => $store1->id, 'name' => 'Accessories', 'slug' => Str::slug('Accessories')]);
        $catSmartwatches = Category::create(['store_id' => $store1->id, 'name' => 'Smartwatches', 'slug' => Str::slug('Smartwatches')]);
        $catHeadphones = Category::create(['store_id' => $store1->id, 'name' => 'Headphones', 'slug' => Str::slug('Headphones')]);
        $catMonitors = Category::create(['store_id' => $store1->id, 'name' => 'Monitors', 'slug' => Str::slug('Monitors')]);
        $catCameras = Category::create(['store_id' => $store1->id, 'name' => 'Cameras', 'slug' => Str::slug('Cameras')]);
        $catGaming = Category::create(['store_id' => $store1->id, 'name' => 'Gaming Consoles', 'slug' => Str::slug('Gaming Consoles')]);

        // Store 2 Categories (Fashion)
        $catMens = Category::create(['store_id' => $store2->id, 'name' => 'Mens Clothing', 'slug' => Str::slug('Mens Clothing')]);
        $catWomens = Category::create(['store_id' => $store2->id, 'name' => 'Womens Clothing', 'slug' => Str::slug('Womens Clothing')]);
        $catShoes = Category::create(['store_id' => $store2->id, 'name' => 'Shoes', 'slug' => Str::slug('Shoes')]);
        $catBags = Category::create(['store_id' => $store2->id, 'name' => 'Bags', 'slug' => Str::slug('Bags')]);
        $catWatches = Category::create(['store_id' => $store2->id, 'name' => 'Fashion Watches', 'slug' => Str::slug('Fashion Watches')]);
        $catSunglasses = Category::create(['store_id' => $store2->id, 'name' => 'Sunglasses', 'slug' => Str::slug('Sunglasses')]);
        $catJewelry = Category::create(['store_id' => $store2->id, 'name' => 'Jewelry', 'slug' => Str::slug('Jewelry')]);

        // 8. Products and Variants
        // Store 1 Products
        $p1 = Product::create(['store_id' => $store1->id, 'category_id' => $catSmartphones->id, 'name' => 'iPhone 15 Pro Max', 'slug' => Str::slug('iPhone 15 Pro Max'), 'description' => 'Apple latest flagship smartphone.']);
        $p1v1 = ProductVariant::create(['store_id' => $store1->id, 'product_id' => $p1->id, 'sku' => 'IP15PM-256', 'price' => 150000, 'stock' => 10, 'image_url' => 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=500&q=80']);
        VariantAttribute::create(['product_variant_id' => $p1v1->id, 'attribute_name' => 'Storage', 'attribute_value' => '256GB']);

        $p2 = Product::create(['store_id' => $store1->id, 'category_id' => $catLaptops->id, 'name' => 'MacBook Pro M3', 'slug' => Str::slug('MacBook Pro M3'), 'description' => 'Powerful laptop for creators.']);
        $p2v1 = ProductVariant::create(['store_id' => $store1->id, 'product_id' => $p2->id, 'sku' => 'MBP-M3-16-512', 'price' => 220000, 'stock' => 5, 'image_url' => 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80']);
        VariantAttribute::create(['product_variant_id' => $p2v1->id, 'attribute_name' => 'RAM', 'attribute_value' => '16GB']);

        $p3 = Product::create(['store_id' => $store1->id, 'category_id' => $catHeadphones->id, 'name' => 'Sony WH-1000XM5', 'slug' => Str::slug('Sony WH-1000XM5'), 'description' => 'Industry leading noise cancellation.']);
        $p3v1 = ProductVariant::create(['store_id' => $store1->id, 'product_id' => $p3->id, 'sku' => 'SONY-XM5-BLK', 'price' => 35000, 'stock' => 15, 'image_url' => 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80']);
        VariantAttribute::create(['product_variant_id' => $p3v1->id, 'attribute_name' => 'Color', 'attribute_value' => 'Black']);

        $p6 = Product::create(['store_id' => $store1->id, 'category_id' => $catSmartwatches->id, 'name' => 'Apple Watch Series 9', 'slug' => Str::slug('Apple Watch Series 9'), 'description' => 'Smarter. Brighter. Mightier.']);
        $p6v1 = ProductVariant::create(['store_id' => $store1->id, 'product_id' => $p6->id, 'sku' => 'AW9-45-MID', 'price' => 50000, 'stock' => 12, 'image_url' => 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500&q=80']);
        VariantAttribute::create(['product_variant_id' => $p6v1->id, 'attribute_name' => 'Size', 'attribute_value' => '45mm']);

        $p7 = Product::create(['store_id' => $store1->id, 'category_id' => $catAccessories->id, 'name' => 'Anker 10000mAh Power Bank', 'slug' => Str::slug('Anker 10000mAh Power Bank'), 'description' => 'Fast charging portable battery.']);
        $p7v1 = ProductVariant::create(['store_id' => $store1->id, 'product_id' => $p7->id, 'sku' => 'ANK-PB-10K', 'price' => 3500, 'stock' => 50, 'image_url' => 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&q=80']);
        VariantAttribute::create(['product_variant_id' => $p7v1->id, 'attribute_name' => 'Capacity', 'attribute_value' => '10000mAh']);

        $p8 = Product::create(['store_id' => $store1->id, 'category_id' => $catMonitors->id, 'name' => 'Dell 27" 4K Monitor', 'slug' => Str::slug('Dell 27 4K Monitor'), 'description' => 'Ultra HD 4K IPS display.']);
        $p8v1 = ProductVariant::create(['store_id' => $store1->id, 'product_id' => $p8->id, 'sku' => 'DELL-27-4K', 'price' => 45000, 'stock' => 8, 'image_url' => 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80']);
        VariantAttribute::create(['product_variant_id' => $p8v1->id, 'attribute_name' => 'Resolution', 'attribute_value' => '4K']);

        $p9 = Product::create(['store_id' => $store1->id, 'category_id' => $catGaming->id, 'name' => 'PlayStation 5', 'slug' => Str::slug('PlayStation 5'), 'description' => 'Next gen gaming console.']);
        $p9v1 = ProductVariant::create(['store_id' => $store1->id, 'product_id' => $p9->id, 'sku' => 'PS5-DISC', 'price' => 65000, 'stock' => 15, 'image_url' => 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&q=80']);
        VariantAttribute::create(['product_variant_id' => $p9v1->id, 'attribute_name' => 'Edition', 'attribute_value' => 'Disc']);

        $p10 = Product::create(['store_id' => $store1->id, 'category_id' => $catCameras->id, 'name' => 'Sony Alpha a7 III', 'slug' => Str::slug('Sony Alpha a7 III'), 'description' => 'Mirrorless full-frame camera.']);
        $p10v1 = ProductVariant::create(['store_id' => $store1->id, 'product_id' => $p10->id, 'sku' => 'SONY-A73-BODY', 'price' => 180000, 'stock' => 3, 'image_url' => 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80']);
        VariantAttribute::create(['product_variant_id' => $p10v1->id, 'attribute_name' => 'Type', 'attribute_value' => 'Body Only']);

        // Store 2 Products
        $p4 = Product::create(['store_id' => $store2->id, 'category_id' => $catMens->id, 'name' => 'Premium Cotton Panjabi', 'slug' => Str::slug('Premium Cotton Panjabi'), 'description' => 'Comfortable wear for all occasions.']);
        $p4v1 = ProductVariant::create(['store_id' => $store2->id, 'product_id' => $p4->id, 'sku' => 'PNJ-CTN-M', 'price' => 2500, 'stock' => 50, 'image_url' => 'https://images.unsplash.com/photo-1594938298596-10fe7ddb0b63?w=500&q=80']);
        VariantAttribute::create(['product_variant_id' => $p4v1->id, 'attribute_name' => 'Size', 'attribute_value' => 'M']);

        $p5 = Product::create(['store_id' => $store2->id, 'category_id' => $catShoes->id, 'name' => 'Leather Formal Shoes', 'slug' => Str::slug('Leather Formal Shoes'), 'description' => 'Elegant and durable formal shoes.']);
        $p5v1 = ProductVariant::create(['store_id' => $store2->id, 'product_id' => $p5->id, 'sku' => 'LFS-BLK-42', 'price' => 4500, 'stock' => 30, 'image_url' => 'https://images.unsplash.com/photo-1614252339474-124b895696d0?w=500&q=80']);
        VariantAttribute::create(['product_variant_id' => $p5v1->id, 'attribute_name' => 'Size', 'attribute_value' => '42']);

        $p11 = Product::create(['store_id' => $store2->id, 'category_id' => $catWomens->id, 'name' => 'Silk Saree', 'slug' => Str::slug('Silk Saree'), 'description' => 'Traditional authentic silk saree.']);
        $p11v1 = ProductVariant::create(['store_id' => $store2->id, 'product_id' => $p11->id, 'sku' => 'SRE-SLK-RED', 'price' => 8500, 'stock' => 20, 'image_url' => 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=80']);
        VariantAttribute::create(['product_variant_id' => $p11v1->id, 'attribute_name' => 'Color', 'attribute_value' => 'Red']);

        $p12 = Product::create(['store_id' => $store2->id, 'category_id' => $catWatches->id, 'name' => 'Casio Vintage Watch', 'slug' => Str::slug('Casio Vintage Watch'), 'description' => 'Classic digital watch for everyday wear.']);
        $p12v1 = ProductVariant::create(['store_id' => $store2->id, 'product_id' => $p12->id, 'sku' => 'CAS-VIN-GLD', 'price' => 4500, 'stock' => 40, 'image_url' => 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&q=80']);
        VariantAttribute::create(['product_variant_id' => $p12v1->id, 'attribute_name' => 'Color', 'attribute_value' => 'Gold']);

        $p13 = Product::create(['store_id' => $store2->id, 'category_id' => $catSunglasses->id, 'name' => 'Ray-Ban Aviator', 'slug' => Str::slug('Ray-Ban Aviator'), 'description' => 'Iconic sunglasses style.']);
        $p13v1 = ProductVariant::create(['store_id' => $store2->id, 'product_id' => $p13->id, 'sku' => 'RB-AVI-BLK', 'price' => 12000, 'stock' => 15, 'image_url' => 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80']);
        VariantAttribute::create(['product_variant_id' => $p13v1->id, 'attribute_name' => 'Size', 'attribute_value' => 'Standard']);

        // 9. Orders
        // Order 1 for Store 1
        $order1 = Order::create([
            'store_id' => $store1->id,
            'user_id' => $customer1->id,
            'customer_name' => 'Tanvir Ahmed',
            'customer_email' => 'tanvir@gmail.com',
            'customer_phone' => '01712345678',
            'shipping_address' => 'House 12, Road 5, Dhanmondi, Dhaka',
            'total_amount' => 150000,
            'status' => 'processing',
        ]);

        OrderItem::create([
            'order_id' => $order1->id,
            'product_variant_id' => $p1v1->id,
            'quantity' => 1,
            'unit_price' => 150000,
            'subtotal' => 150000,
        ]);

        Payment::create([
            'order_id' => $order1->id,
            'payment_channel_id' => $bkash->id,
            'amount' => 150000,
            'account_number' => '01712345678',
            'transaction_id' => 'BKASH-789XYZ',
            'status' => 'verified',
        ]);

        // Order 2 for Store 2
        $order2 = Order::create([
            'store_id' => $store2->id,
            'user_id' => $customer2->id,
            'customer_name' => 'Sadia Afrin',
            'customer_email' => 'sadia@gmail.com',
            'customer_phone' => '01998765432',
            'shipping_address' => 'Block C, Bashundhara R/A, Dhaka',
            'total_amount' => 7000,
            'status' => 'pending',
        ]);

        OrderItem::create([
            'order_id' => $order2->id,
            'product_variant_id' => $p4v1->id,
            'quantity' => 1,
            'unit_price' => 2500,
            'subtotal' => 2500,
        ]);

        OrderItem::create([
            'order_id' => $order2->id,
            'product_variant_id' => $p5v1->id,
            'quantity' => 1,
            'unit_price' => 4500,
            'subtotal' => 4500,
        ]);

        Payment::create([
            'order_id' => $order2->id,
            'payment_channel_id' => $bank->id,
            'amount' => 7000,
            'account_number' => '2200445588',
            'transaction_id' => 'TRX-BANK-001',
            'status' => 'pending',
        ]);
    }
}
