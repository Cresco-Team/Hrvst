<?php

namespace App\Services;

use App\Models\Crop;
use Illuminate\Database\Eloquent\Builder;

class CropService
{
    public function getFilteredCrops(array $filters)
    {
        return Crop::orderBy('name', 'desc')
            ->with('category')
            ->when($filters['category_id'] ?? null, function (Builder $query, $categoryId) {
                $query->where('category_id', $categoryId);
            })
            ->when($filters['search'] ?? null, function (Builder $query, $search) {
                $query->where('name', 'like', '%' . $search . '%');
            })
            ->get();
    }
}