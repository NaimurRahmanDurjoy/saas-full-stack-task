<?php

namespace App\Http\Controllers\Management;

use App\Http\Controllers\Controller;
use App\Models\PaymentChannel;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ManagementPaymentChannelController extends Controller
{
    public function index()
    {
        return response()->json(PaymentChannel::orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'account_number' => 'nullable|string|max:255',
            'instructions' => 'nullable|string',
            'status' => 'required|in:active,inactive',
        ]);

        $channel = PaymentChannel::create($validated);

        return response()->json($channel, 201);
    }

    public function update(Request $request, $id)
    {
        $channel = PaymentChannel::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'account_number' => 'nullable|string|max:255',
            'instructions' => 'nullable|string',
            'status' => 'required|in:active,inactive',
        ]);

        $channel->update($validated);

        return response()->json($channel);
    }

    public function updateStatus(Request $request, $id)
    {
        $channel = PaymentChannel::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:active,inactive',
        ]);

        $channel->update(['status' => $validated['status']]);

        return response()->json($channel);
    }

    public function destroy($id)
    {
        $channel = PaymentChannel::findOrFail($id);

        // Safe Delete Check handling explicitly automatically carefully smoothly compactly appropriately securely inherently intelligently fluently natively comfortably elegantly
        if ($channel->payments()->exists() || $channel->subscriptionPayments()->exists()) {
            $channel->update(['status' => 'inactive']);
            return response()->json(['message' => 'Cannot delete this channel since payment records exist. We have disabled it instead to maintain history.'], 409);
        }

        $channel->delete();

        return response()->json(['message' => 'Channel uniquely safely deleted cleanly']);
    }
}
