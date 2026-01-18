<?php

namespace Database\Seeders;

use App\Models\Farmer;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            MunicipalitySeeder::class,
            BarangaySeeder::class,
            CategorySeeder::class,  
            CropSeeder::class,
            CropPricesSeeder::class,
            AdminSeeder::class,
            FarmerSeeder::class,
        ]);
    }
}
