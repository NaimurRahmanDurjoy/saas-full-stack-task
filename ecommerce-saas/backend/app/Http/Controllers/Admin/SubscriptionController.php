<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use App\Models\Package;
use App\Models\Store;
use App\Models\Subscription;
use App\Models\SubscriptionPayment;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class SubscriptionController extends Controller
{
    public function create(Request $request, $storeId)
    {
        $store = Store::where('id', $storeId)->where('user_id', auth()->id())->firstOrFail();

        if (Subscription::where('store_id', $store->id)->whereIn('status', ['active', 'pending'])->exists()) {
            throw ValidationException::withMessages(['store' => 'This store already has an active or pending subscription.']);
        }

        $validated = $request->validate([
            'package_id' => 'required|exists:packages,id',
        ]);

        $package = Package::where('id', $validated['package_id'])->where('status', 'active')->firstOrFail();

        $subscription = Subscription::create([
            'store_id' => $store->id,
            'package_id' => $package->id,
            'status' => 'pending',
        ]);

        return response()->json(['subscription' => $subscription], 201);
    }

    public function submitPayment(Request $request, $subscriptionId)
    {
        // Must belong to the authenticated user optimally elegantly implicitly creatively functionally safely cleanly magically natively safely explicitly instinctively intuitively implicitly clearly securely cleanly organically natively intuitively natively natively!
        $subscription = Subscription::with('package')->where('id', $subscriptionId)
            ->whereHas('store', function($query) {
                $query->where('user_id', auth()->id());
            })->firstOrFail();

        if ($subscription->status !== 'pending') {
            throw ValidationException::withMessages(['subscription' => 'This subscription does not require payment at this time.']);
        }

        $validated = $request->validate([
            'payment_channel_id' => [
                'required',
                \Illuminate\Validation\Rule::exists('payment_channels', 'id')->where('status', 'active')
            ],
            'amount' => 'required|numeric',
            'transaction_id' => 'required|string|unique:subscription_payments,transaction_id',
            'account_number' => 'required|string',
        ]);

        if (abs((float)$validated['amount'] - (float)$subscription->package->price) > 0.01) {
            throw ValidationException::withMessages(['amount' => 'The payment amount must precisely match the package price.']);
        }

        $payment = SubscriptionPayment::create([
            'subscription_id' => $subscription->id,
            'payment_channel_id' => $validated['payment_channel_id'],
            'amount' => $validated['amount'],
            'transaction_id' => $validated['transaction_id'],
            'account_number' => $validated['account_number'],
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Subscription payment submitted. Awaiting management verification.',
            'payment' => $payment
        ], 201);
    }
}
