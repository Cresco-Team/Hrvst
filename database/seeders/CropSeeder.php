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
        $items = [
            'Vegetables' => ['Carrot', 'Broccoli', 'Spinach', 'Lettuce', 'Cabbage'],
            'Fruits' => ['Apple', 'Banana', 'Orange', 'Grapes', 'Mango'],
            'Grains' => ['Wheat', 'Rice', 'Corn', 'Barley', 'Oats'],
            'Pulses' => ['Lentils', 'Chickpeas', 'Beans', 'Peas', 'Soybeans'],
            'Tubers' => ['Potato', 'Sweet Potato', 'Yam', 'Cassava', 'Taro'],
            'Beverages' => ['Coffee Beans', 'Cocoa', 'Sugarcane', 'Barley'],
        ];

        foreach($items as $categoryName => $crops) {
            $category = Category::firstOrCreate(['name' => $categoryName]);

            foreach($crops as $cropName) {
                Crop::create([
                    'category_id' => $category->id,
                    'name' => $cropName,
                    'price' => 0,
                    'image_path' => null,
                ]);
            }
        }

    }
}
