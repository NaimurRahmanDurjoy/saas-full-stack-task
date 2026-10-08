<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;

class ManagementAuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (\Illuminate\Support\Facades\Auth::guard('admin')->attempt($credentials)) {
            if ($request->hasSession()) {
                $request->session()->regenerate();
            }
            
            $admin = \Illuminate\Support\Facades\Auth::guard('admin')->user();
            return response()->json([
                'user' => array_merge($admin->toArray(), ['type' => 'admin'])
            ]);
        }

        return response()->json(['message' => 'Invalid admin credentials'], 401);
    }

    public function me(Request $request)
    {
        // Sanctum automatically resolves the tokenable model (Admin or User)
        $user = $request->user();
        $type = $user instanceof Admin ? 'admin' : 'tenant';
        
        return response()->json(array_merge($user->toArray(), ['type' => $type]));
    }

    public function logout(Request $request)
    {
        \Illuminate\Support\Facades\Auth::guard('admin')->logout();
        if ($request->hasSession()) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }
        
        return response()->json(['message' => 'Logged out successfully']);
    }
}
