<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;

use App\Models\Store;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class CheckoutController extends Controller
{
    protected $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    public function process(Request $request, $store_slug)
    {
        $store = Store::where('slug', $store_slug)->where('status', 'active')->firstOrFail();

        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'nullable|string|max:20',
            'shipping_address' => 'required|string',
            'items' => 'required|array|min:1',
            'items.*.variant_id' => 'required|integer|exists:product_variants,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        try {
            $order = $this->orderService->createGuestOrder(
                $store->id,
                [
                    'customer_name' => $validated['customer_name'],
                    'customer_email' => $validated['customer_email'],
                    'customer_phone' => $validated['customer_phone'] ?? null,
                    'shipping_address' => $validated['shipping_address'],
                ],
                $validated['items']
            );

            $order->load(['orderItems.productVariant.product']);

            $guestToken = \App\Http\Controllers\Storefront\PaymentController::generateGuestToken($order);
            
            return response()->json([
                'message' => 'Order created successfully',
                'order' => $order,
                'guest_token' => $guestToken
            ], 201);
            
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $e->errors()
            ], 422);
        }
    }
}
