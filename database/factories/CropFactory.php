<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Category;

class CropFactory extends Factory
{
    public function definition(): array
    {
        return [
            'category_id' => Category::factory(),
            'name'        => fake()->unique()->word(),
            'image_path'  => '/crops' . fake()->word() . '.jpg',
            'crop_weeks' => fake()->numberBetween(4, 20),
            
        ];
    }
}
