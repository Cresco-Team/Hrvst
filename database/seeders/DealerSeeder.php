<?php

namespace Database\Seeders;

use App\Models\Dealer;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DealerSeeder extends Seeder
{
    public function run(): void
    {
        $dealerRole = Role::firstOrCreate([
            'name' => 'dealer'
        ]);

        $user = User::firstOrCreate([
            'email' => 'dealer@hrvst.com',
            'phone_number' => '364435545'
        ], [
            'name' => 'Dealer Joe',
            'password' => Hash::make('password'),
            'isApproved' => true,
        ]);

        $user->roles()->syncWithoutDetaching([$dealerRole->id]);
    }
}
