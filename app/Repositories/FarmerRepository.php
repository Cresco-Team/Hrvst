<?php

namespace App\Repositories;

use App\Models\Farmer;
use Illuminate\Database\Eloquent\Collection;

class FarmerRepository
{
    public function findById(int $id): ?Farmer
    {
        return Farmer::with([
            'user:id,name,email,phone_number',
            'municipality:id,name',
            'barangay:id,name'
        ])->find($id);
    }

    public function getapprovedWithActivePlantings(): Collection
    {
        return Farmer::with([
            'user:id,name,phone_number',
            'municipality:id,name',
            'barangay:id,name',
        ])
        ->whereHas('user', fn($q) => $q->where('isApproved', true))
        ->has('plantings')
        ->get();
    }

    public function getByMunicipality(int $municipalityId): Collection
    {
        return Farmer::with([
            'user:id,name,phone_number',
            'municipality:id,name',
            'barangay:id,name',
        ])
        ->where('municipality_id', $municipalityId)
        ->whereHas('user', fn($q) => $q->where('isApproved', true))
        ->get();
    }
}