<?php

namespace App\Services\Dealer;

use App\Repositories\PlantingRepository;
use Illuminate\Support\Collection;

class MarketplaceService
{
    public function __construct(
        protected PlantingRepository $plantingRepo
    ) {}

    public function searchPlantings(array $filters): Collection
    {
        $query = $this->plantingRepo->getActivePlantingsQuery();

        if (isset($filters['crop_id']) && $filters['crop_id'] !== '' && $filters['crop_id'] !== 'all') {
            $query = $this->plantingRepo->filterByCrop($query, (int)$filters['crop_id']);
        }

        if (isset($filters['municipality_id']) && $filters['municipality_id'] !== '' && $filters['municipality_id'] !== 'all') {
            $query = $this->plantingRepo->filterByMunicipality($query, (int)$filters['municipality_id']);
        }

        $query = $this->plantingRepo->filterByHarvestDateRange(
            $query,
            $filters['harvest_from'] ?? null,
            $filters['harvest_to'] ?? null
        );

        return $this->plantingRepo->getOrderedResults($query);
    }

    public function calculateStats(Collection $plantings): array
    {
        return [
            'total_farmers' => $plantings->pluck('farmer.id')->unique()->count(),
            'total_yield_kg' => $plantings->sum('yield_kg'),
            'avg_days_to_harvest' => $plantings->count() > 0 
                ? $plantings->filter(fn($p) => $p->days_until_harvest !== null)->avg('days_until_harvest') 
                : null,
            'active_plantings' => $plantings->count(),
        ];
    }
}