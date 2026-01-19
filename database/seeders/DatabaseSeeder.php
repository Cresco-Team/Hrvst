<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
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
            DealerSeeder::class,
        ]);
    }
}
