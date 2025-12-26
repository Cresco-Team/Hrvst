<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Crop extends Model
{
    /* Mass Assignment Protection */
    protected $fillable = [
        'category_id',
        'name',
        'image_path',
        'crop_weeks',
    ];
    /* Converts a database column value into a specific PHP data type */
    protected $casts = [
        'crop_weeks' => 'integer',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function prices()
    {
        return $this->hasMany(CropPrice::class);
    }

    public function latestPrice()
    {
        return $this->hasOne(CropPrice::class)->latest('recorded_at');
    }

    public function farmers()
    {
        return $this->belongsToMany(Farmer::class, 'farmer_crop')
            ->using(FarmerCrop::class)
            ->withPivot(['yield_kg', 'date_planted', 'date_harvested'])
            ->withTimestamps();
    }

    /**
     * Get the average price for this crop
     */
    public function getAveragePriceAttribute(): float
    {
        return ($this->price_min + $this->price_max) / 2;
    }

    /**
     * Get the price range as a formatted string
     */
    public function getPriceRangeAttribute(): string
    {
        return "₱{$this->price_min} - ₱{$this->price_max}";
    }
}
