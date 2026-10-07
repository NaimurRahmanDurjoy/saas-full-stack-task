<?php

namespace App\Http\Controllers;

use App\Models\Package;

class PackageController extends Controller
{
    public function index()
    {
        return response()->json(Package::where('status', 'active')->get());
    }
}
