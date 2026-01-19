<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsDealer
{
    public function handle(Request $request, Closure $next): Response
    {
        Log::info('Dealer middleware check', [
            'has_user' => $request->user() !== null,
            'session_id' => session()->getId(),
            'auth_check' => Auth::check(),
        ]);

        $user = $request->user();

        if (!$user || !$user->hasRole('dealer') ) {
            abort(403, 'Access denied. Dealers only area.');
        }

        return $next($request);
    }
}
