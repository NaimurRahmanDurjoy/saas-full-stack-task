<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\HasStoreScope;

class ProductVariant extends Model
{
    use HasStoreScope;
    protected $fillable = [
        'store_id',
        'product_id',
        'sku',
        'price',
        'image_url',
        'stock',
        'status',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function variantAttributes()
    {
        return $this->hasMany(VariantAttribute::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
