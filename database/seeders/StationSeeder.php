<?php

namespace Database\Seeders;

use App\Models\Station;
use Illuminate\Database\Seeder;

class StationSeeder extends Seeder
{
    public function run(): void
    {
        $stations = [
            [
                'name' => 'Stasiun Yogyakarta',
                'code' => 'YK',
                'address' => 'Jl. Pasar Kembang, Sosromenduran, Gedong Tengen, Yogyakarta',
                'is_active' => true,
            ],
            [
                'name' => 'Stasiun Lempuyangan',
                'code' => 'LPN',
                'address' => 'Jl. Lempuyangan No.1, Bausasran, Danurejan, Yogyakarta',
                'is_active' => true,
            ],
            [
                'name' => 'Stasiun Sentolo',
                'code' => 'STL',
                'address' => 'Sentolo, Kulon Progo, Yogyakarta',
                'is_active' => true,
            ],
            [
                'name' => 'Stasiun Wates',
                'code' => 'WT',
                'address' => 'Wates, Kulon Progo, Yogyakarta',
                'is_active' => true,
            ],
        ];

        foreach ($stations as $station) {
            Station::create($station);
        }
    }
}
