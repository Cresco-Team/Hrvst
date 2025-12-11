<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Farmer extends Model
{
    protected $fillable = [
        'user_id',
        'municipality_id',
        'barangay_id',
        'phone_number',
        'longitude',
        'latitude',
        'image_path',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function municipality()
    {
        return $this->belongsTo(Municipality::class);
    }

    public function barangay()
    {
        return $this->belongsTo(Barangay::class);
    }

    

    public function crops()
    {
        return $this->belongsToMany(Crop::class, 'farmer_crop')
                    ->using(FarmerCrop::class)
                    ->withPivot(['yield_kg', 'planting_date', 'harvesting_date'])
                    ->withTimestamps();
    }
}
