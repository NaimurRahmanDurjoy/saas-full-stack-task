<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Nullable user_id accommodating implicit Guest Checkout isolation effectively natively
            $table->unsignedBigInteger('user_id')->nullable()->change();
            
            // Guest checkout customer constraints appropriately scoped inherently properly explicitly natively stably
            $table->string('customer_name')->after('user_id');
            $table->string('customer_email')->after('customer_name');
            $table->string('customer_phone')->nullable()->after('customer_email');
            $table->text('shipping_address')->after('customer_phone');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['customer_name', 'customer_email', 'customer_phone', 'shipping_address']);
            $table->unsignedBigInteger('user_id')->nullable(false)->change();
        });
    }
};
