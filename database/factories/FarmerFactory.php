<?php

namespace Database\Factories;

use App\Models\Barangay;
use App\Models\Municipality;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Farmer>
 */
class FarmerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $municipality = Municipality::inRandomOrder()->first();
        $barangay = Barangay::where('municipality_id', $municipality->id)
                            ->inRandomOrder()
                            ->first();

        return [
            'id' => fake()->unique()->numberBetween(1, 1000),
            'user_id'         => User::factory(),
            'municipality_id' => $municipality->id,
            'barangay_id'     => $barangay->id,
            'latitude'  => $this->faker->randomFloat(6, 16.18, 16.72),
            'longitude' => $this->faker->randomFloat(6, 120.41, 120.93),
            'farm_image_path' => fake()->imageUrl(200, 200, 'farm', true),
        ];
    }
}
