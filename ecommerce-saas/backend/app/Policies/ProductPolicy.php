<?php

namespace App\Policies;

use App\Models\Product;
use App\Models\Store;
use App\Models\User;

class ProductPolicy
{
    public function viewAny(User $user, Store $store): bool
    {
        return $user->id === $store->user_id;
    }

    public function view(User $user, Product $product): bool
    {
        return $user->id === $product->store->user_id;
    }

    public function create(User $user, Store $store): bool
    {
        return $user->id === $store->user_id;
    }

    public function update(User $user, Product $product): bool
    {
        return $user->id === $product->store->user_id;
    }

    public function delete(User $user, Product $product): bool
    {
        return $user->id === $product->store->user_id;
    }
}
