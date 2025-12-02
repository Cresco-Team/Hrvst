<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
    
    $sharedData = [
        ...parent::share($request),
        'auth' => [
            'user' => $user ? [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'isAdmin' => $user->isAdmin,
                'isApproved' => $user->isApproved,
                'farmer' => $user->farmer ? $user->farmer->load(['municipality', 'barangay', 'crops']) : null,
            ] : null,
        ],
    ];

    // If user is admin, add pending farmers
    if ($user && $user->isAdmin) {
        $sharedData['pendingFarmers'] = \App\Models\Farmer::with(['user', 'municipality', 'barangay', 'crops'])
            ->whereHas('user', function($q) {
                $q->where('isApproved', false);
            })
            ->get();
    }

    // If user is an approved farmer, add all crops for selection
    if ($user && !$user->isAdmin && $user->isApproved && $user->farmer) {
        $sharedData['allCrops'] = \App\Models\Crop::with('category')->get();
    }

    return $sharedData;
    }
}
