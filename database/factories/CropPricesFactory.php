<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CropPricesFactory extends Factory
{
    public function definition(): array
    {
        $min = fake()->randomFloat(2, 20, 50);
        $max = fake()->randomFloat(2, $min + 5, 90);

        return [
            'price_min' => $min,
            'price_max' => $max,
            'recorded_at' => now()
        ];
    }
}
