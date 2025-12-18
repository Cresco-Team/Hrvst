<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Category;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Crop>
 */
class CropFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $lowPrice = fake()->randomFloat(2, 10, 400);
        $highPrice = $lowPrice + fake()->randomFloat(2, 10, 100);

        return [
            'category_id' => Category::inRandomOrder()->first()?->id ?? Category::factory(),
            'name'        => fake()->word(),
            'low_price'   => $lowPrice,
            'high_price'  => $highPrice,
            'harvest_weeks' => fake()->numberBetween(4, 20),
            'image_path'  => fake()->imageUrl(200, 200, 'plants', true),
        ];
    }
}
