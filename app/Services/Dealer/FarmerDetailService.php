<?php

namespace App\Services\Dealer;

use App\Repositories\FarmerRepository;
use App\Repositories\PlantingRepository;

class FarmerDetailService
{
    public function __construct(
        protected FarmerRepository $farmerRepo,
        protected PlantingRepository $plantingRepo
    ) {}

    public function getFarmerWithActiveCrops(int $farmerId): array
    {
        $farmer = $this->farmerRepo->findById($farmerId);

        if (!$farmer || !$farmer->user->isApproved) {
            abort(404, 'Farmer not found or not approved');
        }

        $activePlantings = $this->plantingRepo->getActivePlantingsByFarmer($farmerId);

        return [
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
            'active_crops' => $activePlantings->map(fn($p) => [
                'crop_name' => $p->crop->name,
                'category' => $p->crop->category->name,
                'date_planted' => $p->date_planted->format('M d, Y'),
                'expected_harvest' => $p->expected_harvest_date?->format('M d, Y'),
                'yield_kg' => $p->yield_kg,
            ])->toArray(),
        ];
    }
}