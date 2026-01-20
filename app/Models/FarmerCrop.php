<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Prunable;

class FarmerCrop extends Pivot
{
    use Prunable;

    protected $table = 'farmer_crop';

    protected $primaryKey = 'plant_id';
    /* Mass Assignment Protection */
    protected $fillable = [
        'farmer_id',
        'crop_id',
        'yield_kg',
        'date_planted',
        'expected_harvest_date',
        'date_harvested',
        'status'
    ];
    /* Converts a database column value into a specific PHP data type */
    protected $casts = [
        'date_planted' => 'date',
        'expected_harvest_date' => 'date',
        'date_harvested' => 'date',
    ];
    
    public function farmer(): BelongsTo
    {
        return $this->belongsTo(Farmer::class, 'farmer_id', 'farmer_id');
    }

    public function crop(): BelongsTo
    {
        return $this->belongsTo(Crop::class, 'crop_id');
    }

    /**
     * Business Logic
     */

    /* Check if crop has passed expected harvest date without being harvested */
    public function isExpired(): bool
    {
        if ($this->status !== 'active' || !$this->expected_harvest_date) {
            return false;
        }

        return Carbon::now()->isAfter($this->expected_harvest_date); // return boolean
    }

    /* Mark as harvested with actual harvest date */
    public function markAsHarvested(?float $actualYield = null): void
    {
        $this->update([
            'status' => 'harvested',
            'date_harvested' => Carbon::now(),
            'yield_kg' => $actualYield ?? $this->yield_kg,
        ]);
    }

    /* Mark as expired (called by scheduled command) */
    public function markAsExpired(): void
    {
        if ($this->status === 'active' && $this->isExpired()) {
            $this->update(['status' => 'expired']);
        }
    }

    /**
     * Query Scopes
     */

     public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeHarvested($query)
    {
        return $query->where('status', 'harvested');
    }

    public function scopeExpired($query)
    {
        return $query->where('status', 'expired');
    }

    /**
     * Accessors
     */

     /* Get days remaining until expected harvest */
     public function getDaysUntilHarvestAttribute(): ?int
     {
         if (!$this->expected_harvest_date || $this->status !== 'active') {
             return null;
         }
 
         return Carbon::now()->diffInDays($this->expected_harvest_date, false);
     }

     /* Get human-readable status bafge */
     public function getStatusBadgeAttribute(): string
    {
        return match($this->status) {
            'active' => $this->isExpired() ? 'Overdue' : 'Growing',
            'harvested' => 'Harvested',
            'expired' => 'Expired',
            default => 'Unknown',
        };
    }

}
