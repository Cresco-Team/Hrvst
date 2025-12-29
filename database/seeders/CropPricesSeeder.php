<?php

namespace Database\Seeders;

use App\Models\Crop;
use App\Models\CropPrice;
use Illuminate\Database\Seeder;

class CropPricesSeeder extends Seeder
{
    public function run(): void
    {
        $crops = Crop::all();
        $weeks = 16;
        $start = now()->startOfWeek()->subWeeks($weeks);

        $rows = [];

        foreach (Crop::pluck('id') as $cropID) {
            for ($i = 0; $i < $weeks; $i++) {
                $min = fake()->randomFloat(2, 20, 50);

                $rows[] = [
                    'crop_id'     => $cropID,
                    'price_min'   => $min,
                    'price_max'   => fake()->randomFloat(2, $min + 5, 90),
                    'recorded_at' => $start->copy()->addWeeks($i),
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ];

                CropPrice::upsert(
                    $rows,
                    [
                        'crop_id',
                        'recorded_at',
                    ],
                    [
                        'price_min',
                        'price_max',
                        'updated_at',
                    ]
                );
            }
        }
    }
}
