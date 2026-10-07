<?php

namespace App\Policies;

use App\Models\ProductVariant;
use App\Models\Product;
use App\Models\User;

class ProductVariantPolicy
{
    public function viewAny(User $user, Product $product): bool
    {
        return $user->id === $product->store->user_id;
    }

    public function view(User $user, ProductVariant $productVariant): bool
    {
        return $user->id === $productVariant->store->user_id;
    }

    public function create(User $user, Product $product): bool
    {
        return $user->id === $product->store->user_id;
    }

    public function update(User $user, ProductVariant $productVariant): bool
    {
        return $user->id === $productVariant->store->user_id;
    }

    public function delete(User $user, ProductVariant $productVariant): bool
    {
        return $user->id === $productVariant->store->user_id;
    }
}
