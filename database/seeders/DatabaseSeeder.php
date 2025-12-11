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
            MunicipalitySeeder::class,
            BarangaySeeder::class,
            CategorySeeder::class,  
            CropSeeder::class,
        ]);

        Farmer::factory(20)->create(); 

        User::FirstOrCreate([
            'email' => 'admin@email.com'
        ], [
            'name' => 'Admin User',
            'password' => Hash::make('password'),
            'isAdmin' => true,
            'isApproved' => true,
            'phone_number' => '091234567'
        ]);
        User::FirstOrCreate([
            'email' => 'test@email.com'
        ], [
            'name' => 'Test User',
            'password' => Hash::make('password'),
            'isAdmin' => false,
            'isApproved' => false,
            'phone_number' => '0909090909'
        ]);
    }
}
