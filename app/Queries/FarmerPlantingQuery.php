<?php

namespace App\Queries;

use App\Models\FarmerCrop;

class FarmerPlantingQuery
{
    public function forFarmer(int $farmerId)
    {
        return FarmerCrop::where('farmer_id', $farmerId)
            ->with('crop.category')
            ->orderByRaw("
                CASE status
                    WHEN 'active' THEN 1
                    WHEN 'harvested' THEN 2
                    WHEN 'expired' THEN 3
                END
            ")
            ->orderBy('date_planted', 'desc')
            ->get();
    }
}