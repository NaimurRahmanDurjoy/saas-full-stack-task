<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Namespaces
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\AdminAuthController;
use App\Http\Controllers\Storefront\StorefrontController;
use App\Http\Controllers\Storefront\CheckoutController;
use App\Http\Controllers\Storefront\PaymentController;
use App\Http\Controllers\Tenant\StoreController;
use App\Http\Controllers\Tenant\CategoryController;
use App\Http\Controllers\Tenant\ProductController;
use App\Http\Controllers\Tenant\ProductVariantController;
use App\Http\Controllers\Tenant\SubscriptionController;
use App\Http\Controllers\Tenant\PackageController;
use App\Http\Controllers\Tenant\OrderManagementController;
use App\Http\Controllers\Tenant\SalesReportController;
use App\Http\Controllers\Admin\AdminPaymentVerificationController;
use App\Http\Controllers\Admin\AdminPaymentChannelController;
use App\Http\Controllers\Admin\AdminPackageController;
use App\Http\Controllers\Admin\AdminStoreController;
use App\Http\Middleware\AdminMiddleware;

// Storefront (Public)
Route::get('/storefront/{store_slug}', [StorefrontController::class, 'showStore']);
Route::get('/storefront/{store_slug}/categories', [StorefrontController::class, 'categories']);
Route::get('/storefront/{store_slug}/products', [StorefrontController::class, 'products']);
Route::get('/storefront/{store_slug}/products/{product_slug}', [StorefrontController::class, 'productDetails']);

Route::post('/storefront/{store_slug}/checkout', [CheckoutController::class, 'process']);
Route::get('/storefront/{store_slug}/payment-channels', [PaymentController::class, 'channels']);
Route::post('/storefront/{store_slug}/orders/{order_id}/payments', [PaymentController::class, 'submitPayment']);

// Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/admin/login', [AdminAuthController::class, 'login']);

// Admin Protected Routes
Route::middleware(['auth:sanctum', AdminMiddleware::class])->group(function () {
    Route::post('/admin/logout', [AdminAuthController::class, 'logout']);
    Route::get('/admin/user', [AdminAuthController::class, 'me']);
    
    Route::get('/admin/subscription-payments', [AdminPaymentVerificationController::class, 'index']);
    Route::post('/admin/subscription-payments/{paymentId}/verify', [AdminPaymentVerificationController::class, 'verify']);

    // Payment Channel Management
    Route::get('/admin/payment-channels', [AdminPaymentChannelController::class, 'index']);
    Route::post('/admin/payment-channels', [AdminPaymentChannelController::class, 'store']);
    Route::put('/admin/payment-channels/{id}', [AdminPaymentChannelController::class, 'update']);
    Route::patch('/admin/payment-channels/{id}/status', [AdminPaymentChannelController::class, 'updateStatus']);
    Route::delete('/admin/payment-channels/{id}', [AdminPaymentChannelController::class, 'destroy']);

    // Packages & Stores
    Route::apiResource('admin/packages', AdminPackageController::class);
    Route::patch('/admin/packages/{package}/status', [AdminPackageController::class, 'updateStatus']);
    
    Route::get('/admin/stores', [AdminStoreController::class, 'index']);
    Route::get('/admin/stores/{store}', [AdminStoreController::class, 'show']);
    Route::patch('/admin/stores/{store}/status', [AdminStoreController::class, 'updateStatus']);

    // Admin Order & Sales Management (Handled currently via OrderManagementController in Tenant folder for code reuse)
    Route::get('/admin/orders', [OrderManagementController::class, 'adminIndex']);
    Route::get('/admin/orders/{order}', [OrderManagementController::class, 'adminShow']);
    Route::get('/admin/sales-report', [SalesReportController::class, 'adminReport']);
});

// Tenant Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    Route::get('/packages', [PackageController::class, 'index']);
    
    Route::post('/stores/{storeId}/subscriptions', [SubscriptionController::class, 'create']);
    Route::post('/subscriptions/{subscriptionId}/payments', [SubscriptionController::class, 'submitPayment']);
    
    Route::apiResource('stores', StoreController::class);
    Route::apiResource('stores.categories', CategoryController::class);
    Route::apiResource('stores.products', ProductController::class);
    Route::apiResource('products.variants', ProductVariantController::class);

    // Owner Order & Sales Management
    Route::get('/stores/{storeId}/orders', [OrderManagementController::class, 'ownerIndex']);
    Route::get('/stores/{storeId}/orders/{orderId}', [OrderManagementController::class, 'ownerShow']);
    Route::get('/stores/{storeId}/sales-report', [SalesReportController::class, 'ownerReport']);
});
