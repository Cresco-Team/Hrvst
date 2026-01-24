<?php

namespace App\Repositories;

use App\Models\FarmerCrop;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class PlantingRepository
{
    public function getActivePlantingsQuery(): Builder
    {
        return FarmerCrop::with([
            'farmer.user:id,name,phone_number',
            'farmer.municipality:id,name',
            'farmer.barangay:id,name',
            'crop:id,name,image_path,category_id',
            'crop.category:id,name',
        ])
        ->where('status', 'active')
        ->whereHas('farmer.user', fn($q) => $q->where('isApproved', true));
    }

    public function filterByCrop(Builder $query, int $cropId): Builder
    {
        return $query->where('crop_id', $cropId);
    }

    public function filterByMunicipality(Builder $query, int $municipalityId): Builder
    {
        return $query->whereHas('farmer', fn($q) => $q->where('municipality_id', $municipalityId));
    }

    public function filterByHarvestDateRange(Builder $query, ?string $from, ?string $to): Builder
    {
        if ($from) {
            $query->where('expected_harvest_date', '>=', $from);
        }
        
        if ($to) {
            $query->where('expected_harvest_date', '<=', $to);
        }

        return $query;
    }

    public function getOrderedResults(Builder $query): Collection
    {
        return $query->orderBy('expected_harvest_date')->get();
    }

    public function getActivePlantingsByFarmer(int $farmerId): Collection
    {
        return FarmerCrop::with('crop.category')
            ->where('farmer_id', $farmerId)
            ->where('status', 'active')
            ->orderBy('expected_harvest_date')
            ->get();
    }
}