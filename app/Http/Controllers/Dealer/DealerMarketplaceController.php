<?php

namespace App\Http\Controllers\Dealer;

use App\Http\Controllers\Controller;
use App\Http\Resources\Dealer\MarketplacePlantingResource;
use App\Models\Crop;
use App\Models\Farmer;
use App\Models\FarmerCrop;
use App\Models\Municipality;
use App\Services\Dealer\FarmerDetailService;
use App\Services\Dealer\MarketplaceService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DealerMarketplaceController extends Controller
{
    public function __construct(
        protected MarketplaceService $marketplaceService,
        protected FarmerDetailService $farmerDetailService,
    )
    {}

    public function index(Request $request): Response
    {
        $filters = $request->only(['crop_id', 'municipality_id', 'harvest_from', 'harvest_to']);

        $plantings = $this->marketplaceService->searchPlantings($filters);
        $stats = $this->marketplaceService->calculateStats($plantings);

        return Inertia::render('dealer-profile/marketplace/index', [
            'crops' => Crop::with('category:id,name')
                ->orderBy('name')
                ->get(['id', 'name', 'category_id'])
                ->map(fn($crop) => [
                    'id' => $crop->id,
                    'name' => $crop->name,
                    'category' => $crop->category->name,
                ]),
            'municipalities' => Municipality::orderBy('name')->get(['id', 'name']),
            'plantings' => MarketplacePlantingResource::collection($plantings),
            'filters' => $filters,
            'stats' => $stats,
        ]);
    }

    /**
     * Get detailed farmer info for modal/detail view
     */
    public function showFarmer(int $farmerId)
    {
        $farmerData = $this->farmerDetailService->getFarmerWithActiveCrops($farmerId);

        return response()->json($farmerData);
    }
}
