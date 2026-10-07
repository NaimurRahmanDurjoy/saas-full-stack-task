<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Package;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AdminPackageController extends Controller
{
    public function index()
    {
        return response()->json(Package::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'store_limit' => 'nullable|integer|min:1',
            'status' => 'required|in:active,inactive'
        ]);
        
        $validated['slug'] = \Illuminate\Support\Str::slug($validated['name']);

        $package = Package::create($validated);
        return response()->json($package, 201);
    }

    public function show(Package $package)
    {
        return response()->json($package);
    }

    public function update(Request $request, Package $package)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'store_limit' => 'nullable|integer|min:1',
            'status' => 'required|in:active,inactive'
        ]);

        $package->update($validated);
        return response()->json($package);
    }

    public function updateStatus(Request $request, Package $package)
    {
        $validated = $request->validate([
            'status' => 'required|in:active,inactive'
        ]);

        $package->update($validated);
        return response()->json($package);
    }

    public function destroy(Package $package)
    {
        if ($package->subscriptions()->exists()) {
            throw ValidationException::withMessages([
                'package' => 'Cannot delete package with existing subscriptions. Deactivate instead.'
            ]);
        }

        $package->delete();
        return response()->json(null, 204);
    }
}
