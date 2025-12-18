<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Crop;

class CropSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $crops = [
            ['category_id' => 1, 'name' => 'Carrot', 'low_price' => 40, 'high_price' => 80, 'harvest_weeks' => 10],
            ['category_id' => 1, 'name' => 'Cabbage', 'low_price' => 30, 'high_price' => 60, 'harvest_weeks' => 12],
            ['category_id' => 2, 'name' => 'Banana', 'low_price' => 50, 'high_price' => 100, 'harvest_weeks' => 52],
        ];

        foreach ($crops as $crop) {
            Crop::FirstOrCreate(
                ['category_id' => $crop['category_id'], 'name' => $crop['name']],
                $crop
            );
        }

    }
}
