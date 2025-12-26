<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CropPrice extends Model
{
    /** @use HasFactory<\Database\Factories\CropPricesFactory> */
    use HasFactory;

    protected $fillable = [
        'crop_id',
        'price_min',
        'price_max',
        'recorded_at',
    ];

    protected $casts = [
        'recorded_at' => 'date',
        'price_min' => 'decimal:2',
        'price_max' => 'decimal:2',
    ];

    public function crop()
    {
        return $this->belongsTo(Crop::class);
    }
}
