<?php

namespace App\Http\Controllers\Management;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class ManagementMerchantController extends Controller
{
    public function index()
    {
        $merchants = User::has('stores')
            ->withCount('stores')
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($merchants);
    }
}
