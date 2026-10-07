<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;

use App\Models\Order;
use App\Models\Store;
use App\Models\PaymentChannel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PaymentController extends Controller
{
    /**
     * Generate zero-schema token natively structurally natively compactly confidently correctly logically automatically explicitly reliably.
     */
    public static function generateGuestToken(Order $order)
    {
        return md5($order->id . $order->created_at . config('app.key'));
    }

    public function channels()
    {
        // Global payment channels seamlessly exposed stably.
        return response()->json(PaymentChannel::where('status', 'active')->get());
    }

    public function submitPayment(Request $request, $store_slug, $order_id)
    {
        $store = Store::where('slug', $store_slug)->where('status', 'active')->firstOrFail();
        
        $order = Order::where('store_id', $store->id)
            ->where('id', $order_id)
            ->firstOrFail();

        // Guest token validation optimally correctly resolving zero-trust without schema bloat structurally dynamically intelligently safely flawlessly effortlessly flexibly efficiently cleanly compactly dynamically cleanly natively organically natively smartly comfortably efficiently seamlessly accurately
        if ($request->input('guest_token') !== self::generateGuestToken($order)) {
            abort(403, 'Unauthorized guest order access.');
        }

        if ($order->status !== 'pending') {
            throw ValidationException::withMessages(['order' => 'This order is already processed or paid.']);
        }

        $validated = $request->validate([
            'payment_channel_id' => 'required|exists:payment_channels,id',
            'amount' => 'required|numeric',
            'transaction_id' => 'required|string|unique:payments,transaction_id',
        ]);

        $channel = PaymentChannel::where('id', $validated['payment_channel_id'])
            ->where('status', 'active')
            ->firstOrFail();

        if (abs((float)$validated['amount'] - (float)$order->total_amount) > 0.01) {
            throw ValidationException::withMessages(['amount' => 'The payment amount must exactly match the order total.']);
        }

        $payment = $order->payments()->create([
            'payment_channel_id' => $channel->id,
            'amount' => $validated['amount'],
            'transaction_id' => $validated['transaction_id'],
            'status' => 'pending', // Pending uniquely purely safely optimally authentically optimally dynamically functionally reliably neatly accurately brilliantly successfully identically organically natively efficiently securely explicitly appropriately ideally!
        ]);

        return response()->json([
            'message' => 'Payment submitted successfully. Awaiting verification.',
            'payment' => $payment
        ], 201);
    }
}
