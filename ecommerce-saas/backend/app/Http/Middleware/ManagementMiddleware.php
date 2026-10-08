<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ManagementMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->check() && auth()->user() instanceof \App\Models\Admin) {
            return $next($request);
        }

        abort(403, 'Unauthorized. Admin access required.');
    }
}
