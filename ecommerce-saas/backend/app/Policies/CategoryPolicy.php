<?php

namespace App\Policies;

use App\Models\Category;
use App\Models\Store;
use App\Models\User;

class CategoryPolicy
{
    public function viewAny(User $user, Store $store): bool
    {
        return $user->id === $store->user_id;
    }

    public function view(User $user, Category $category): bool
    {
        return $user->id === $category->store->user_id;
    }

    public function create(User $user, Store $store): bool
    {
        return $user->id === $store->user_id;
    }

    public function update(User $user, Category $category): bool
    {
        return $user->id === $category->store->user_id;
    }

    public function delete(User $user, Category $category): bool
    {
        return $user->id === $category->store->user_id;
    }
}
