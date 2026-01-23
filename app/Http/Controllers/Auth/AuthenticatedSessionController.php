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
    public function create(): Response
    {
        return Inertia::render('auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    public function store(LoginRequest $request): RedirectResponse
    {
        Log::info('Login attempt started');

        $request->authenticate();
        Log::info('Authentication passed');

        $request->session()->regenerate();
        Log::info('Session regenerated');
        Log::info('Session ID after regenerate', ['session_id' => session()->getId()]);
        Log::info('Session data', ['data' => session()->all()]);

        /** @var \App\Models\User $user */
        $user = Auth::user();
        Log::info('User retrieved', ['id' => $user->id]);

        if (!$user->isApproved) {
            return redirect()->intended(route('home'))
                ->with('info', 'pending account');
        }

        if ($user->hasRole('admin')) {
            Log::info('Redirecting to Admin Dashboard');
            return redirect()->intended(route('admin.dashboard'))
                ->with('info', 'Welcome, admin');
        }

        Log::info('Redirecting to Home Page');
        return redirect()->intended(route('farmers.index'))
            ->with('success', "Welcome {$user->name}");
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();
        Log::info('Session destroyed');

        return redirect()->intended(route('home'))
            ->with('success', 'Logged out');
    }
}
