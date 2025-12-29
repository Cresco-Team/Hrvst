<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use App\Models\Crop;

class CropSeeder extends Seeder
{
    public function run(): void
    {
        $categories = Category::all();

        Crop::factory(50)
            ->recycle($categories)
            ->create();
    }
}
