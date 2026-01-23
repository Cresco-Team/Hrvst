<?php

namespace App\Http\Controllers\Dealer;

use App\Http\Controllers\Controller;
use App\Models\Crop;
use App\Models\Farmer;
use App\Models\FarmerCrop;
use App\Models\Municipality;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DealerMarketplaceController extends Controller
{
    public function index(Request $request)
    {
        // Get all crops for search dropdown
        $crops = Crop::with('category')
            ->orderBy('name')
            ->get(['id', 'name', 'category_id'])
            ->map(fn($crop) => [
                'id' => $crop->id,
                'name' => $crop->name,
                'category' => $crop->category->name,
            ]);

        // Get municipalities for location filter
        $municipalities = Municipality::orderBy('name')
            ->get(['id', 'name']);

        // Get filters from request
        $filters = $request->only(['crop_id', 'municipality_id', 'harvest_from', 'harvest_to']);

        // Build query for active plantings
        $plantingsQuery = FarmerCrop::with([
                'farmer.user:id,name,phone_number',
                'farmer.municipality:id,name',
                'farmer.barangay:id,name',
                'crop:id,name,image_path,category_id',
                'crop.category:id,name',
            ])
            ->where('status', 'active')
            ->whereHas('farmer.user', function ($q) {
                $q->where('isApproved', true);
            });

        // Apply crop filter
        if ($request->filled('crop_id') && $request->crop_id !== '' && $request->crop_id !== 'all') {
            $plantingsQuery->where('crop_id', $request->crop_id);
        }

        // Apply municipality filter
        if ($request->filled('municipality_id') && $request->municipality_id !== '' && $request->municipality_id !== 'all') {
            $plantingsQuery->whereHas('farmer', function ($q) use ($request) {
                $q->where('municipality_id', $request->municipality_id);
            });
        }

        // Apply harvest date range filter
        if ($request->filled('harvest_from')) {
            $plantingsQuery->where('expected_harvest_date', '>=', $request->harvest_from);
        }

        if ($request->filled('harvest_to')) {
            $plantingsQuery->where('expected_harvest_date', '<=', $request->harvest_to);
        }
        // Get results with aggregation
        $plantings = $plantingsQuery
            ->orderBy('expected_harvest_date')
            ->get()
            ->map(function ($planting) {
                return [
                    'id' => $planting->plant_id,
                    'farmer' => [
                        'id' => $planting->farmer->id,
                        'name' => $planting->farmer->user->name,
                        'phone' => $planting->farmer->user->phone_number,
                        'municipality' => $planting->farmer->municipality->name,
                        'barangay' => $planting->farmer->barangay->name,
                        'location' => [
                            'lat' => $planting->farmer->latitude,
                            'lng' => $planting->farmer->longitude,
                        ],
                    ],
                    'crop' => [
                        'id' => $planting->crop->id,
                        'name' => $planting->crop->name,
                        'category' => $planting->crop->category->name,
                        'image' => $planting->crop->image_path,
                    ],
                    'date_planted' => $planting->date_planted->format('M d, Y'),
                    'expected_harvest_date' => $planting->expected_harvest_date?->format('M d, Y'),
                    'days_until_harvest' => $planting->days_until_harvest,
                    'yield_kg' => $planting->yield_kg,
                    'status_badge' => $planting->status_badge,
                ];
            });

        // Calculate stats
        $stats = [
            'total_farmers' => $plantings->pluck('farmer.id')->unique()->count(),
            'total_yield_kg' => $plantings->sum('yield_kg'),
            'avg_days_to_harvest' => $plantings->count() > 0 
                ? $plantings->filter(fn($p) => $p['days_until_harvest'] !== null)->avg('days_until_harvest') 
                : null,
            'active_plantings' => $plantings->count(),
        ];

        return Inertia::render('dealer-profile/marketplace/index', [
            'crops' => $crops,
            'municipalities' => $municipalities,
            'plantings' => $plantings,
            'filters' => $filters,
            'stats' => $stats,
        ]);
    }

    /**
     * Get detailed farmer info for modal/detail view
     */
    public function showFarmer($farmerId)
    {
        $farmer = Farmer::with([
            'user:id,name,email,phone_number',
            'municipality:id,name',
            'barangay:id,name',
            'plantings' => function ($q) {
                $q->where('status', 'active')
                    ->with('crop.category');
            }
        ])
        ->findOrFail($farmerId);

        return response()->json([
            'id' => $farmer->id,
            'name' => $farmer->user->name,
            'email' => $farmer->user->email,
            'phone' => $farmer->user->phone_number,
            'location' => [
                'municipality' => $farmer->municipality->name,
                'barangay' => $farmer->barangay->name,
                'coordinates' => [
                    'lat' => $farmer->latitude,
                    'lng' => $farmer->longitude,
                ],
            ],
            'active_crops' => $farmer->plantings->map(fn($p) => [
                'crop_name' => $p->crop->name,
                'category' => $p->crop->category->name,
                'date_planted' => $p->date_planted->format('M d, Y'),
                'expected_harvest' => $p->expected_harvest_date?->format('M d, Y'),
                'yield_kg' => $p->yield_kg,
            ]),
        ]);
    }
}
