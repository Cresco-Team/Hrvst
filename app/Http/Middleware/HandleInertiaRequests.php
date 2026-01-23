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
                'image_path' => $user->image_path,
            ] : null,
        ],
    ];

    // If user is admin, add pending farmers
    if ($user && $user->hasRole('admin')) {
        $sharedData['pendingFarmers'] = Farmer::with(['user', 'municipality', 'barangay', 'crops'])
            ->whereHas('user', function($q) {
                $q->where('isApproved', false);
            })
            ->get();
    }

    return $sharedData;
    }
}
