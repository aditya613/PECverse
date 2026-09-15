<?php

namespace Database\Seeders;

use App\Models\Venue;
use App\Models\VenueOccupancy;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class VenueOccupancySeeder extends Seeder
{
    public function run(): void
    {
        $venuesPath = database_path('seeders/data/venues.json');
        $occupancyPath = database_path('seeders/data/venue_occupancy.json');

        if (!file_exists($venuesPath) || !file_exists($occupancyPath)) {
            $this->command->error("Venue seed data JSON files missing!");
            return;
        }

        $venuesMeta = json_decode(file_get_contents($venuesPath), true);
        $rawOccupancy = json_decode(file_get_contents($occupancyPath), true);

        // 1. Seed Venues
        $venueMap = [];
        foreach ($venuesMeta as $meta) {
            $venue = Venue::updateOrCreate(
                ['code' => $meta['code']],
                [
                    'name' => $meta['name'],
                    'type' => $meta['type'],
                    'floor' => $meta['floor'],
                    'capacity' => $meta['capacity'],
                ]
            );
            $venueMap[$meta['code']] = $venue->id;
        }

        // 2. Clear previous occupancies safely
        Schema::disableForeignKeyConstraints();
        DB::table('venue_occupancies')->truncate();
        Schema::enableForeignKeyConstraints();

        // 3. Batch insert occupancies
        $insertData = [];
        $now = now();
        foreach ($rawOccupancy as $item) {
            if (!isset($venueMap[$item['venue_code']])) continue;
            $insertData[] = [
                'venue_id' => $venueMap[$item['venue_code']],
                'day_of_week' => $item['day_of_week'],
                'slot_index' => $item['slot_index'],
                'time_label' => $item['time_label'],
                'start_time' => $item['start_time'],
                'end_time' => $item['end_time'],
                'is_occupied' => $item['is_occupied'] ? 1 : 0,
                'occupied_by' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        foreach (array_chunk($insertData, 100) as $chunk) {
            DB::table('venue_occupancies')->insert($chunk);
        }

        $this->command->info("Seeded " . count($venueMap) . " venues and " . count($insertData) . " occupancy records.");
    }
}
