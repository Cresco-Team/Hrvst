<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Crop extends Model
{
    protected $fillable = [
        'category_id', 
        'name', 
        'low_price', 
        'high_price', 
        'harvest_weeks',
        'image_path'
    ];

    protected $casts = [
        'low_price' => 'decimal:2',
        'high_price' => 'decimal:2',
        'harvest_weeks' => 'integer',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function farmers()
    {
        return $this->belongsToMany(Farmer::class, 'farmer_crop')
            ->using(FarmerCrop::class)
            ->withPivot(['yield_kg', 'planting_date', 'harvesting_date', 'planted_at', 'status'])
            ->withTimestamps();
    }

    /**
     * Get the average price for this crop
     */
    public function getAveragePriceAttribute(): float
    {
        return ($this->low_price + $this->high_price) / 2;
    }

    /**
     * Get the price range as a formatted string
     */
    public function getPriceRangeAttribute(): string
    {
        return "₱{$this->low_price} - ₱{$this->high_price}";
    }
}
