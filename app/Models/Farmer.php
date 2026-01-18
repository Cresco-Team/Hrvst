<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Farmer extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'municipality_id',
        'barangay_id',
        'latitude',
        'longitude',
        'farm_image_path'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function municipality(): BelongsTo
    {
        return $this->belongsTo(Municipality::class);
    }

    public function barangay(): BelongsTo
    {
        return $this->belongsTo(Barangay::class);
    }

    /* 
        Use scope method to only include approved farmers
        When calling the scope, you omit the 'scope' prefix
        scopeApproved will be 'approved'
    */
    public function scopeApproved(Builder $query): Builder
    {
        return $query->whereHas('user', function ($q) {
            $q->where('isApproved', 1);
        });
    }

    public function scopePending(Builder $query) : Builder
    {
        return $query->whereHas('user', function ($q) {
            $q->where('isApproved', 0);
        });
    }

    public function crops()
    {
        return $this->belongsToMany(Crop::class, 'farmer_crop')
                    ->using(FarmerCrop::class)
                    ->withPivot(['yield_kg', 'date_planted', 'date_harvested'])
                    ->withTimestamps();
    }
}
