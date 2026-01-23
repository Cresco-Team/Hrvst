<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DealerProfileController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', User::class);

        $dealers = User::whereHas('roles', fn($q) => $q->where('name', 'dealer'))
        ->with('roles')
        ->get();
        return Inertia::render('dealer/index', [
            'dealers' => $dealers,
        ]);
    }

    public function show()
    {
        $user = Auth::user();
        $this->authorize('view', $user);

        return Inertia::render('dealer-profile/index', [
            'dealer' => $user
        ]);
    }
}
