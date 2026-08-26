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
            PecCse3rdSemSeeder::class,
            PecCseAi3rdSemSeeder::class,
            PecDs3rdSemSeeder::class,
            PecEce3rdSemSeeder::class,
            PecMech3rdSemSeeder::class,
            PecCivil3rdSemSeeder::class,
            PecVlsi3rdSemSeeder::class,
            MessSeeder::class,
            AravaliMessSeeder::class,
            PecClubsSeeder::class,
            PecSeniorAdviceSeeder::class,
        ]);

        // 1. Create or Find Branches
        $cse = Branch::firstOrCreate(['code' => 'CSE'], ['name' => 'Computer Science and Engineering']);
        $ee = Branch::firstOrCreate(['code' => 'EE'], ['name' => 'Electrical Engineering']);
        $ece = Branch::firstOrCreate(['code' => 'ECE'], ['name' => 'Electronics and Communication Engineering']);

        // 2. Create Classes for CSE
        CourseClass::firstOrCreate(['branch_id' => $cse->id, 'year' => 1, 'group_name' => 'CSE-A']);
        CourseClass::firstOrCreate(['branch_id' => $cse->id, 'year' => 1, 'group_name' => 'CSE-B']);
        CourseClass::firstOrCreate(['branch_id' => $cse->id, 'year' => 2, 'group_name' => 'CSE-A']);
        CourseClass::firstOrCreate(['branch_id' => $cse->id, 'year' => 2, 'group_name' => 'CSE-B']);

        // 3. Create Classes for EE
        CourseClass::firstOrCreate(['branch_id' => $ee->id, 'year' => 1, 'group_name' => 'EE-A']);
        CourseClass::firstOrCreate(['branch_id' => $ee->id, 'year' => 2, 'group_name' => 'EE-A']);
        
        // 4. Create Classes for ECE
        CourseClass::firstOrCreate(['branch_id' => $ece->id, 'year' => 1, 'group_name' => 'ECE-A']);
    }
}
