<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;

use App\Models\Package;

class PackageController extends Controller
{
    public function index()
    {
        return response()->json(Package::where('status', 'active')->get());
    }
}
