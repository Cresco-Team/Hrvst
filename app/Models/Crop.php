<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Crop extends Model
{
    use HasFactory;

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

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function prices(): HasMany
    {
        return $this->hasMany(CropPrice::class);
    }

    public function latestPrice(): HasOne
    {
        return $this->hasOne(CropPrice::class)->latest('recorded_at');
    }

    public function farmers(): BelongsToMany
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
