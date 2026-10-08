<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Namespaces
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\ManagementAuthController;
use App\Http\Controllers\Storefront\StorefrontController;
use App\Http\Controllers\Storefront\CheckoutController;
use App\Http\Controllers\Storefront\PaymentController;
use App\Http\Controllers\Admin\StoreController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ProductVariantController;
use App\Http\Controllers\Admin\SubscriptionController;
use App\Http\Controllers\Admin\PackageController;
use App\Http\Controllers\Admin\OrderManagementController;
use App\Http\Controllers\Admin\SalesReportController;
use App\Http\Controllers\Management\ManagementPaymentVerificationController;
use App\Http\Controllers\Management\ManagementPaymentChannelController;
use App\Http\Controllers\Management\ManagementPackageController;
use App\Http\Controllers\Management\ManagementStoreController;
use App\Http\Middleware\ManagementMiddleware;

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
Route::post('/admin/login', [ManagementAuthController::class, 'login']);

// Admin Protected Routes
Route::middleware(['auth:sanctum', ManagementMiddleware::class])->group(function () {
    Route::post('/admin/logout', [ManagementAuthController::class, 'logout']);
    Route::get('/admin/user', [ManagementAuthController::class, 'me']);
    
    Route::get('/admin/subscription-payments', [ManagementPaymentVerificationController::class, 'index']);
    Route::post('/admin/subscription-payments/{paymentId}/verify', [ManagementPaymentVerificationController::class, 'verify']);

    // Payment Channel Management
    Route::get('/admin/payment-channels', [ManagementPaymentChannelController::class, 'index']);
    Route::post('/admin/payment-channels', [ManagementPaymentChannelController::class, 'store']);
    Route::put('/admin/payment-channels/{id}', [ManagementPaymentChannelController::class, 'update']);
    Route::patch('/admin/payment-channels/{id}/status', [ManagementPaymentChannelController::class, 'updateStatus']);
    Route::delete('/admin/payment-channels/{id}', [ManagementPaymentChannelController::class, 'destroy']);

    // Packages & Stores
    Route::apiResource('admin/packages', ManagementPackageController::class);
    Route::patch('/admin/packages/{package}/status', [ManagementPackageController::class, 'updateStatus']);
    
    Route::get('/admin/stores', [ManagementStoreController::class, 'index']);
    Route::get('/admin/stores/{store}', [ManagementStoreController::class, 'show']);
    Route::patch('/admin/stores/{store}/status', [ManagementStoreController::class, 'updateStatus']);

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
