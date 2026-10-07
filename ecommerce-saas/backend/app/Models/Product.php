<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\HasStoreScope;

class Product extends Model
{
    use HasStoreScope;
    protected $fillable = [
        'store_id',
        'category_id',
        'name',
        'slug',
        'description',
        'status',
    ];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function productVariants()
    {
        return $this->hasMany(ProductVariant::class);
    }
}
