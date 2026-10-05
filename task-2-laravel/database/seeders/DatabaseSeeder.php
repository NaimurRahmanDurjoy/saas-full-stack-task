<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Product;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
        
        User::factory(4)->create();

        Product::create([
            'name' => 'Laptop',
            'description' => 'A powerful laptop.',
            'price' => 1200.00,
            'stock' => 10,
        ]);
        
        Product::create([
            'name' => 'Mouse',
            'description' => 'A wireless mouse.',
            'price' => 25.50,
            'stock' => 50,
        ]);
        
        Product::create([
            'name' => 'Keyboard',
            'description' => 'A mechanical keyboard.',
            'price' => 85.00,
            'stock' => 30,
        ]);
    }
}
