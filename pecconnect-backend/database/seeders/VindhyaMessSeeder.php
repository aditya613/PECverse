<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Mess;
use App\Models\MessMenu;

class VindhyaMessSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $mess = Mess::where('name', 'like', '%Vindhya%')->first() 
            ?? Mess::firstOrCreate(['name' => 'Vindhya Hostel']);

        // Delete existing menus for this mess to ensure fresh, clean data
        MessMenu::where('mess_id', $mess->id)->delete();

        $menus = [
            1 => [ // Monday
                'Breakfast' => 'Aloo Sandwich',
                'Lunch' => 'Rajma, Boondi Raita, Rice',
                'Snacks' => 'Samosa, Tea',
                'Dinner' => 'Chilli Paneer / Paneer Bhurji, Dal',
                'Sweet Dish' => 'Gulab Jamun',
            ],
            2 => [ // Tuesday
                'Breakfast' => 'Aloo Parantha',
                'Lunch' => 'White Chana, Rice, Dahi',
                'Snacks' => 'Spring Roll, Ice Tea',
                'Dinner' => 'Veg Pulao, Plain Dahi, Roti, Chana Dal',
                'Sweet Dish' => 'Fruit Custard',
            ],
            3 => [ // Wednesday
                'Breakfast' => 'Poha',
                'Lunch' => 'Matar Paneer, Raita',
                'Snacks' => 'Bhelpuri / Channa Chat, Coffee',
                'Dinner' => 'Mix Veg, Dal',
                'Sweet Dish' => 'Ice Cream (Chocolate)',
            ],
            4 => [ // Thursday
                'Breakfast' => 'Paneer Parantha',
                'Lunch' => 'Dal Makhani, Plain Rice, Dahi',
                'Snacks' => 'Maggi / Noodles, Jal Jeera',
                'Dinner' => 'Bhindi / Dry Channa, Malka Dal',
                'Sweet Dish' => 'Rasmalai',
            ],
            5 => [ // Friday
                'Breakfast' => 'Aloo-Pyaz Parantha',
                'Lunch' => 'Black Chana-Poori, Rice, Dahi',
                'Snacks' => 'Mix Pakode, Roohafza',
                'Dinner' => 'Malai Kofta, Moong Masri Dal',
                'Sweet Dish' => 'Rasgulla',
            ],
            6 => [ // Saturday
                'Breakfast' => 'Besan Pyaaz Ajwain Parantha',
                'Lunch' => 'Kadhi, Aloo-Jeera Rice',
                'Snacks' => 'Off',
                'Dinner' => 'Arbi, Dal',
                'Sweet Dish' => 'Brownie / Boondi Laddu',
            ],
            7 => [ // Sunday
                'Breakfast' => 'Namkeen Seviyan',
                'Lunch' => 'Chole Bhature / Pav Bhaji, Dahi, Rice',
                'Snacks' => 'Off',
                'Dinner' => 'Aloo Nutri, Mix Dal',
                'Sweet Dish' => 'Chocolate (Munch) / (Dairy Milk)',
            ],
        ];

        foreach ($menus as $dayOfWeek => $meals) {
            $itemsString = '';
            foreach ($meals as $mealType => $foodItems) {
                $itemsString .= "{$mealType}: {$foodItems}\n\n";
            }

            MessMenu::updateOrCreate(
                [
                    'mess_id' => $mess->id,
                    'day_of_week' => $dayOfWeek,
                ],
                [
                    'items' => trim($itemsString),
                ]
            );
        }
    }
}
