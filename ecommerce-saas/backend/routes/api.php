<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\StorefrontController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\PaymentController;

Route::get('/storefront/{store_slug}', [StorefrontController::class, 'showStore']);
Route::get('/storefront/{store_slug}/categories', [StorefrontController::class, 'categories']);
Route::get('/storefront/{store_slug}/products', [StorefrontController::class, 'products']);
Route::get('/storefront/{store_slug}/products/{product_slug}', [StorefrontController::class, 'productDetails']);

Route::post('/storefront/{store_slug}/checkout', [CheckoutController::class, 'process']);
Route::get('/storefront/{store_slug}/payment-channels', [PaymentController::class, 'channels']);
Route::post('/storefront/{store_slug}/orders/{order_id}/payments', [PaymentController::class, 'submitPayment']);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum', \App\Http\Middleware\AdminMiddleware::class])->group(function () {
    Route::get('/admin/subscription-payments', [\App\Http\Controllers\Admin\AdminPaymentVerificationController::class, 'index']);
    Route::post('/admin/subscription-payments/{paymentId}/verify', [\App\Http\Controllers\Admin\AdminPaymentVerificationController::class, 'verify']);

    // Payment Channel Management mapping
    Route::get('/admin/payment-channels', [\App\Http\Controllers\Admin\AdminPaymentChannelController::class, 'index']);
    Route::post('/admin/payment-channels', [\App\Http\Controllers\Admin\AdminPaymentChannelController::class, 'store']);
    Route::put('/admin/payment-channels/{id}', [\App\Http\Controllers\Admin\AdminPaymentChannelController::class, 'update']);
    Route::patch('/admin/payment-channels/{id}/status', [\App\Http\Controllers\Admin\AdminPaymentChannelController::class, 'updateStatus']);
    Route::delete('/admin/payment-channels/{id}', [\App\Http\Controllers\Admin\AdminPaymentChannelController::class, 'destroy']);

    // Phase 10B: Admin Packages & Stores
    Route::apiResource('admin/packages', \App\Http\Controllers\Admin\AdminPackageController::class);
    Route::patch('/admin/packages/{package}/status', [\App\Http\Controllers\Admin\AdminPackageController::class, 'updateStatus']);
    
    Route::get('/admin/stores', [\App\Http\Controllers\Admin\AdminStoreController::class, 'index']);
    Route::get('/admin/stores/{store}', [\App\Http\Controllers\Admin\AdminStoreController::class, 'show']);
    Route::patch('/admin/stores/{store}/status', [\App\Http\Controllers\Admin\AdminStoreController::class, 'updateStatus']);

    // Phase 10B: Admin Order & Sales Management
    Route::get('/admin/orders', [\App\Http\Controllers\OrderManagementController::class, 'adminIndex']);
    Route::get('/admin/orders/{order}', [\App\Http\Controllers\OrderManagementController::class, 'adminShow']);
    Route::get('/admin/sales-report', [\App\Http\Controllers\SalesReportController::class, 'adminReport']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [\App\Http\Controllers\AuthController::class, 'logout']);
    Route::get('/user', [\App\Http\Controllers\AuthController::class, 'user']);
    
    Route::get('/packages', [\App\Http\Controllers\PackageController::class, 'index']);
    
    Route::post('/stores/{storeId}/subscriptions', [\App\Http\Controllers\SubscriptionController::class, 'create']);
    Route::post('/subscriptions/{subscriptionId}/payments', [\App\Http\Controllers\SubscriptionController::class, 'submitPayment']);
    
    Route::apiResource('stores', \App\Http\Controllers\StoreController::class);
    Route::apiResource('stores.categories', \App\Http\Controllers\CategoryController::class);
    Route::apiResource('stores.products', \App\Http\Controllers\ProductController::class);
    Route::apiResource('products.variants', \App\Http\Controllers\ProductVariantController::class);

    // Phase 10B: Owner Order & Sales Management
    Route::get('/stores/{storeId}/orders', [\App\Http\Controllers\OrderManagementController::class, 'ownerIndex']);
    Route::get('/stores/{storeId}/orders/{orderId}', [\App\Http\Controllers\OrderManagementController::class, 'ownerShow']);
    Route::get('/stores/{storeId}/sales-report', [\App\Http\Controllers\SalesReportController::class, 'ownerReport']);
});
