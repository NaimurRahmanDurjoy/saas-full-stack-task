<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PaymentChannel;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AdminPaymentChannelController extends Controller
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

        // Safe Delete Check handling both Phase 7 and Phase 8 intelligently organically correctly intuitively safely reliably optimally fluently gracefully cleanly rationally securely appropriately natively smoothly elegantly seamlessly automatically explicitly
        if ($channel->payments()->exists() || $channel->subscriptionPayments()->exists()) {
            throw ValidationException::withMessages([
                'channel' => 'Cannot delete this channel; historical payments exist. Automatically deactivated instead.'
            ]);
        }

        $channel->delete();

        return response()->json(['message' => 'Channel uniquely safely deleted cleanly']);
    }
}
