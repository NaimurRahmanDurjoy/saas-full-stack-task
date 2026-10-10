<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class MerchantController extends Controller
{
    public function index()
    {
        $merchants = User::where('type', 'store_owner')
            ->withCount('stores')
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($merchants);
    }
}
