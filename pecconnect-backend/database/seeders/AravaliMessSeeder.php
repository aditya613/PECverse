<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Mess;
use App\Models\MessMenu;

class AravaliMessSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $mess = Mess::firstOrCreate(['name' => 'Aravali Hostel']);

        // Clear existing menus for this mess
        MessMenu::where('mess_id', $mess->id)->delete();

        $menus = [
            1 => [
                'Breakfast' => 'Bread Jam + Cornflakes, Boiled Egg (2pc) / Fruit (1pc), Milk (200ml) / Tea, Aloo Parantha + Butter/Curd',
                'Lunch' => 'Kadhi Pakoda + Aloo Jeera, Plain Rice, Chapati (With or Without Butter), Pickle + Salad',
                'Snacks' => 'Veg Cutlet (2 pc), Bread Jam, Tea, Goodday Biscuit (2 pc)',
                'Dinner' => 'Butter Chicken / Kadai Paneer, Masoor Sabut, Jeera Rice + Chapati + Salad, Gulab Jamun (2 pc)',
            ],
            2 => [
                'Breakfast' => 'Bread Jam + Sprouts, Boiled Egg (2pc) / Fruit (1pc), Milk (200ml) / Tea, Pao Bhaji + Butter',
                'Lunch' => 'Rajma + Palak Corn, Jeera Rice, Chapati (With or Without Butter), Boondi Raita (1 Bowl) + Pickle + Salad',
                'Snacks' => 'French Fries (1 Bowl), Bread Jam, Coffee, Monaco Biscuit (2 pc)',
                'Dinner' => 'Yellow Dal Tadka, White Chana Dry, Jeera Rice + Chapati + Salad, Jalebi',
            ],
            3 => [
                'Breakfast' => 'Bread Jam + Cornflakes, Boiled Egg (2pc) / Fruit (1pc), Milk (200ml) / Tea, Gobhi Parantha + Butter/Curd',
                'Lunch' => 'Matar Paneer + Aloo Soyabean Dry, Plain Rice, Chapati (With or Without Butter), Mix Raita (1 Bowl) + Pickle + Salad',
                'Snacks' => 'Golgappe (4 pc), Jaljeera OR Macroni, Coffee',
                'Dinner' => 'Urad Chilka + Chana Dal, Soya Chaap Masala, Jeera Rice + Chapati + Salad, Kheer',
            ],
            4 => [
                'Breakfast' => 'Bread Jam + Sprouts, Boiled Egg (2pc) / Fruit (1pc), Milk (200ml) / Tea, Paneer Parantha + Butter/Curd',
                'Lunch' => 'White Chana + Aloo Gobi / Seasonal Veg, Jeera Rice, Chapati (With or Without Butter), Jeera Raita (1 Bowl) + Pickle + Salad',
                'Snacks' => 'Aloo Tikki (1 pc), Bread Jam, Tea, Goodday Biscuit (2 pc)',
                'Dinner' => 'Dal Makhani, Mix Veg, Jeera Rice + Chapati + Salad, Moong Dal Halwa',
            ],
            5 => [
                'Breakfast' => 'Bread Jam + Cornflakes, Boiled Egg (2pc) / Fruit (1pc), Milk (200ml) / Tea, Mix Parantha + Butter/Curd',
                'Lunch' => 'Veg Kofta + Aloo Gajar Matar / Seasonal Veg, Jeera Rice, Chapati (With or Without Butter), Boondi Raita (1 Bowl) + Pickle + Salad',
                'Snacks' => 'Sweet Corn, Roohafza',
                'Dinner' => 'Chicken Curry / Paneer Butter Masala, Mix Dal, Chapati + Jeera Rice + Salad, Gulab Jamun (2 pc)',
            ],
            6 => [
                'Breakfast' => 'Bread Jam + Sprouts, Boiled Egg (2pc) / Fruit (1pc), Milk (200ml) / Tea, Aloo Pyaz Parantha + Butter/Curd',
                'Lunch' => 'Black Chana + Aloo Soyabean / Chilli Soyabean, Plain Rice, Chapati (With or Without Butter), Mix Raita (1 Bowl) + Pickle + Salad',
                'Snacks' => 'Bread Pakora OR Sandwich, Bread Jam, Tea / Coffee, Monaco Biscuit (2 pc)',
                'Dinner' => 'Rajma, Palak Corn, Jeera Rice + Chapati + Salad, Fruit Custard / Sooji Halwa',
            ],
            7 => [
                'Breakfast' => 'Bread Jam + Cornflakes, Omelette (1pc) / Fruit (1pc), Milk (200ml) / Tea, Idli OR Vada + Sambhar + Coconut Chutney',
                'Lunch' => 'Chole Bhature, Pickle + Green Chutney, Plain Rice, Curd (1 Bowl)',
                'Snacks' => 'Poha OR Veg Chowmein (1 Bowl), Neembu Pani',
                'Dinner' => 'Special Biryani, Arhar Dal, Chapati + Salad, Milk Sevaiyan',
            ],
        ];

        foreach ($menus as $dayOfWeek => $meals) {
            $itemsString = '';
            foreach ($meals as $mealType => $foodItems) {
                $itemsString .= "{$mealType}: {$foodItems}\n\n";
            }
            
            MessMenu::create([
                'mess_id' => $mess->id,
                'day_of_week' => $dayOfWeek,
                'items' => trim($itemsString),
            ]);
        }
    }
}
