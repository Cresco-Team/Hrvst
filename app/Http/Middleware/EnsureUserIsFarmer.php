<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsFarmer
{
    public function handle(Request $request, Closure $next): Response
    {
        Log::info('Farmer middleware check', [
            'has_user' => $request->user() !== null,
            'session_id' => session()->getId(),
            'auth_check' => Auth::check(),
        ]);

        $user = $request->user();

        if (!$user || !$user->hasRole('farmer')) {
            abort(403, 'Unauthorized. Accessible by farmers only.');
        }

        return $next($request);
    }
}
