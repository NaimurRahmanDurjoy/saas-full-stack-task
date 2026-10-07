<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\HasStoreScope;

class Category extends Model
{
    use HasStoreScope;
    protected $fillable = [
        'store_id',
        'name',
        'slug',
        'description',
        'status',
    ];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
