<?php

namespace App\Http\Middleware;

use App\Models\Crop;
use App\Models\Farmer;
use Inertia\Middleware;
use Illuminate\Http\Request;

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
                'isApproved' => $user->isApproved,
                'roles' => $user->roles->pluck('name'),
            ] : null,
        ],
    ];

    // If user is admin, add pending farmers
    if ($user && $user->isAdmin) {
        $sharedData['pendingFarmers'] = Farmer::with(['user', 'municipality', 'barangay', 'crops'])
            ->whereHas('user', function($q) {
                $q->where('isApproved', false);
            })
            ->get();
    }

    // If user is an approved farmer, add all crops for selection
    if ($user && !$user->isAdmin && $user->farmer) {
        $sharedData['allCrops'] = Crop::with('category')->get();
    }

    return $sharedData;
    }
}
