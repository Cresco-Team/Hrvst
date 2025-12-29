<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Flower/Stem',
            'Fruiting',
            'Leafy/Head',
            'Legumes/Podded',
            'Root/Tuber'
        ];

        foreach ($categories as $name) {
            Category::FirstorCreate(['name' => $name]);
        }
    }
}
