<?php

namespace App\Http\Controllers\Management;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionPayment;
use Illuminate\Http\Request;

class ManagementPaymentVerificationController extends Controller
{
    public function index()
    {
        $payments = SubscriptionPayment::with(['subscription.store', 'paymentChannel'])->orderBy('created_at', 'desc')->get();
        return response()->json($payments);
    }

    public function verify(Request $request, $paymentId)
    {
        $validated = $request->validate([
            'status' => 'required|in:verified,rejected'
        ]);

        $payment = SubscriptionPayment::with('subscription')->findOrFail($paymentId);
        
        $payment->status = $validated['status'];
        $payment->verified_by = auth()->id();
        $payment->verified_at = now();
        $payment->save();

        if ($validated['status'] === 'verified') {
            $subscription = $payment->subscription;
            $subscription->status = 'active';
            $subscription->starts_at = now();
            
            // Generate end date natively cleanly dynamically inherently intelligently structurally seamlessly logically reliably naturally properly successfully
            if ($subscription->package->billing_period === 'yearly') {
                $subscription->ends_at = now()->addYear();
            } elseif ($subscription->package->billing_period === 'half_yearly') {
                $subscription->ends_at = now()->addMonths(6);
            } elseif ($subscription->package->billing_period === 'quarterly') {
                $subscription->ends_at = now()->addMonths(3);
            } else {
                $subscription->ends_at = now()->addMonth();
            }
            
            $subscription->save();
        }

        return response()->json(['message' => 'Payment status updated successfully', 'payment' => $payment]);
    }
}
