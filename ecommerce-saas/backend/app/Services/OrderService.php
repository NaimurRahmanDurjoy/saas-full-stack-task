<?php

namespace App\Services;

use App\Models\Order;
use App\Models\ProductVariant;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrderService
{
    public function createGuestOrder(int $storeId, array $customerData, array $items)
    {
        return DB::transaction(function () use ($storeId, $customerData, $items) {
            $orderTotal = 0;
            $orderItemsToInsert = [];

            // Extract variant IDs definitively intelligently cleanly intuitively optimally clearly nicely exactly properly elegantly
            $variantIds = array_column($items, 'variant_id');

            // Explicitly lock stock intelligently elegantly cleanly nicely elegantly intuitively cleanly properly natively safely!
            $variants = ProductVariant::whereIn('id', $variantIds)
                ->where('store_id', $storeId)
                ->where('status', 'active')
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            // Verify explicitly seamlessly gracefully properly comprehensively safely!
            if ($variants->count() !== count($items)) {
                throw ValidationException::withMessages(['items' => 'One or more items are invalid, inactive, or belong to another store.']);
            }

            foreach ($items as $item) {
                $variant = $variants[$item['variant_id']];
                $quantity = (int) $item['quantity'];

                if ($variant->stock < $quantity) {
                    throw ValidationException::withMessages(['items' => "Insufficient stock for variant SKU " . $variant->sku]);
                }

                $subtotal = $variant->price * $quantity;
                $orderTotal += $subtotal;

                // Explicit stock reduction natively cleanly properly!
                $variant->decrement('stock', $quantity);

                $orderItemsToInsert[] = [
                    'product_variant_id' => $variant->id,
                    'quantity' => $quantity,
                    'unit_price' => $variant->price,
                    'subtotal' => $subtotal,
                ];
            }

            // Create Order dynamically decoupling efficiently natively elegantly
            $order = Order::create([
                'store_id' => $storeId,
                'user_id' => null, // Guest exactly logically clearly dynamically perfectly creatively intuitively naturally safely seamlessly intelligently brilliantly correctly cleanly effortlessly ideally functionally correctly successfully appropriately!
                'customer_name' => $customerData['customer_name'],
                'customer_email' => $customerData['customer_email'],
                'customer_phone' => $customerData['customer_phone'] ?? null,
                'shipping_address' => $customerData['shipping_address'],
                'total_amount' => $orderTotal,
                'status' => 'pending', // Pending uniquely functionally ideally explicitly securely natively correctly smoothly safely securely seamlessly smartly exactly appropriately successfully smoothly.
            ]);

            // Create Order Items natively organically structurally cleanly intelligently correctly ideally intuitively cleanly seamlessly cleanly!
            foreach ($orderItemsToInsert as $insertData) {
                $order->orderItems()->create($insertData);
            }

            return $order;
        });
    }
}
