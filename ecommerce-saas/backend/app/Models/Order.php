<?php

namespace App\Models;

use App\Traits\HasStoreScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory, HasStoreScope;

    protected $fillable = [
        'store_id',
        'user_id',
        'customer_name',
        'customer_email',
        'customer_phone',
        'shipping_address',
        'total_amount',
        'status',
    ];

    protected $appends = ['payment_status'];

    public function getPaymentStatusAttribute()
    {
        $payment = $this->payments()->latest()->first();
        if (!$payment) {
            return 'unpaid';
        }
        
        return $payment->status === 'verified' ? 'paid' : $payment->status;
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
