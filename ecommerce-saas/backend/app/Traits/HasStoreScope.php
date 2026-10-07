<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;

trait HasStoreScope
{
    /**
     * Scope a query to only include models of a given store.
     */
    public function scopeForStore(Builder $query, $storeId): void
    {
        $query->where('store_id', $storeId);
    }
}
