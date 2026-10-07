<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->index('slug');
            $table->index('status');
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->index('slug');
            $table->index('status');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->index('slug');
            $table->index('status');
        });

        Schema::table('product_variants', function (Blueprint $table) {
            $table->index('sku');
            $table->index('status');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->index('status');
            $table->index('created_at');
        });

        Schema::table('subscriptions', function (Blueprint $table) {
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->dropIndex(['slug']);
            $table->dropIndex(['status']);
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->dropIndex(['slug']);
            $table->dropIndex(['status']);
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex(['slug']);
            $table->dropIndex(['status']);
        });

        Schema::table('product_variants', function (Blueprint $table) {
            $table->dropIndex(['sku']);
            $table->dropIndex(['status']);
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['created_at']);
        });

        Schema::table('subscriptions', function (Blueprint $table) {
            $table->dropIndex(['status']);
        });
    }
};
