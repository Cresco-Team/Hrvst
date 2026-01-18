<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        Log::info('Login attempt starter');

        $request->authenticate();
        Log::info('Authentication passed');

        $request->session()->regenerate();
        Log::info('Session regenerated');
        Log::info('Session ID after regenerate', ['session_id' => session()->getId()]);
        Log::info('Session data', ['data' => session()->all()]);

        $user = Auth::user();
        Log::info('User retrieved', ['id' => $user->id, 'isAdmin' => $user->isAdmin]);

        if (!$user->isAdmin && !$user->isApproved) {
            
            return redirect()->route('login');
        }

        if ($user->hasRole('admin')) {
            Log::info('Redirecting to Admin Dashboard');
            return redirect()->route('admin.dashboard');
        };
        if (!$user->isApproved) {
            return redirect()->route('pending');
        };
        return redirect()->intended(route('crops.index'));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
