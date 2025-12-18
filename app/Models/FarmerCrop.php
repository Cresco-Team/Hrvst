<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Carbon\Carbon;

class FarmerCrop extends Pivot
{
    protected $table = 'farmer_crop';

    protected $primaryKey = 'plant_id';

    protected $fillable = [
        'farmer_id',
        'crop_id',
        'yield_kg',
        'planting_date',
        'harvesting_date',
        'planted_at',
        'status'
    ];

    protected $casts = [
        'planting_date' => 'date',
        'harvesting_date' => 'date',
        'planted_at' => 'datetime',
    ];
    
    public function farmer(): BelongsTo
    {
        return $this->belongsTo(Farmer::class, 'farmer_id', 'farmer_id');
    }

    public function crop(): BelongsTo
    {
        return $this->belongsTo(Crop::class, 'crop_id', 'crop_id');
    }

    /**
     * Check if this crop planting has expired based on planted_at + harvest_weeks
     */
    public function isExpired(): bool
    {
        if (!$this->planted_at || !$this->crop) {
            return false;
        }

        $harvestDate = Carbon::parse($this->planted_at)->addWeeks($this->crop->harvest_weeks);
        return Carbon::now()->isAfter($harvestDate);
    }

    /**
     * Get the expected harvest date
     */
    public function getExpectedHarvestDateAttribute(): ?Carbon
    {
        if (!$this->planted_at || !$this->crop) {
            return null;
        }

        return Carbon::parse($this->planted_at)->addWeeks($this->crop->harvest_weeks);
    }

    /**
     * Scope to get only active crops (not expired or harvested)
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope to get only non-expired crops
     */
    public function scopeNotExpired($query)
    {
        return $query->where(function ($q) {
            $q->where('status', '!=', 'expired')
              ->where('status', '!=', 'harvested');
        });
    }

    /**
     * Update status based on expiration
     */
    public function updateStatusIfExpired(): bool
    {
        if ($this->status === 'active' && $this->isExpired()) {
            $this->status = 'expired';
            $this->save();
            return true;
        }
        return false;
    }

    /**
     * Boot method to automatically check expiration
     */
    protected static function booted()
    {
        static::retrieved(function ($farmerCrop) {
            $farmerCrop->updateStatusIfExpired();
        });
    }
}
