<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\CourseClass;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            PecCse1stYearSeeder::class,
            Pec1stYearRemainingBranchesSeeder::class,
            PecCse3rdSemSeeder::class,
            PecCseAi3rdSemSeeder::class,
            PecDs3rdSemSeeder::class,
            PecEce3rdSemSeeder::class,
            PecMech3rdSemSeeder::class,
            PecCivil3rdSemSeeder::class,
            PecVlsi3rdSemSeeder::class,
            PecAero3rdSemSeeder::class,
            PecCse5thSemSeeder::class,
            PecCseAi5thSemSeeder::class,
            PecDs5thSemSeeder::class,
            PecCse7thSemSeeder::class,
            PecCseAi7thSemSeeder::class,
            PecDs7thSemSeeder::class,
            MessSeeder::class,
            AravaliMessSeeder::class,
            VindhyaMessSeeder::class,
            PecClubsSeeder::class,
            PecSeniorAdviceSeeder::class,
            VenueOccupancySeeder::class,
            DatesheetSeeder::class,
        ]);

          }
}
