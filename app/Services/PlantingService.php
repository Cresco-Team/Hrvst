<?php

namespace App\Services;

use App\Queries\FarmerPlantingQuery;
use Illuminate\Support\Collection;

class PlantingService
{
    public function __construct(
        protected FarmerPlantingQuery $query
    ) {}

    public function getForFarmer(int $farmerId): Collection
    {
        return $this->query->forFarmer($farmerId);
    }

    public function stats(Collection $plantings): array
    {
        return [
            'active' => $plantings->where('status', 'active')->count(),
            'harvested_this_month' => $plantings
                ->where('status', 'harvested')
                ->filter(fn ($p) => $p->date_harvested?->isCurrentMonth())
                ->count(),
        ];
    }
}
