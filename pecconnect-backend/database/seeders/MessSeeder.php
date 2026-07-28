<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MessSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $messes = ['Shivalik Hostel', 'Kurukshetra (KC)', 'Vindhya Hostel', 'Aravali Hostel', 'Kalpana Chawla'];
        
        \App\Models\MessMenu::truncate(); // Clear old menus

        foreach ($messes as $messName) {
            $mess = \App\Models\Mess::firstOrCreate(['name' => $messName]);

            // Add sample menu for Monday (day 1)
            \App\Models\MessMenu::create([
                'mess_id' => $mess->id,
                'day_of_week' => 1,
                'items' => "Breakfast: Aloo Paratha, Curd, Tea, Bread Butter\nLunch: Rajma, Rice, Roti, Salad, Lassi\nSnacks: Samosa, Tea\nDinner: Dal Makhani, Mix Veg, Roti, Rice, Gulab Jamun",
            ]);
        }
    }
}
