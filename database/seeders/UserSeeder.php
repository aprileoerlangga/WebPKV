<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Super Admin
        User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@stasiun.com',
            'password' => Hash::make('password123'),
            'role' => 'super_admin',
            'is_active' => true,
        ]);

        // Admin Stasiun Yogyakarta
        User::create([
            'name' => 'Admin Stasiun Yogyakarta',
            'email' => 'admin.yogyakarta@stasiun.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        // Admin Stasiun Lempuyangan
        User::create([
            'name' => 'Admin Stasiun Lempuyangan',
            'email' => 'admin.lempuyangan@stasiun.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'is_active' => true,
        ]);
    }
}
