<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminRole = Role::firstOrCreate([
            'name' => 'admin'
        ]);

        $user = User::FirstOrCreate([
            'email' => 'admin@email.com'
        ], [
            'name' => 'Admin User',
            'password' => Hash::make('password'),
            'isApproved' => true,
            'phone_number' => '09303997215'
        ]);

        $user->roles()->syncWithoutDetaching([$adminRole->id]);
    }
}
