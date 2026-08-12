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
            AdminSeeder::class,
            PecCse3rdSemSeeder::class,
            PecCseAi3rdSemSeeder::class,
            PecMech3rdSemSeeder::class,
            PecCivil3rdSemSeeder::class,
            MessSeeder::class,
        ]);

        // 1. Create Branches
        $cse = Branch::create(['name' => 'Computer Science and Engineering', 'code' => 'CSE']);
        $ee = Branch::create(['name' => 'Electrical Engineering', 'code' => 'EE']);
        $ece = Branch::create(['name' => 'Electronics and Communication Engineering', 'code' => 'ECE']);

        // 2. Create Classes for CSE
        CourseClass::create(['branch_id' => $cse->id, 'year' => 1, 'group_name' => 'CSE-A']);
        CourseClass::create(['branch_id' => $cse->id, 'year' => 1, 'group_name' => 'CSE-B']);
        CourseClass::create(['branch_id' => $cse->id, 'year' => 2, 'group_name' => 'CSE-A']);
        CourseClass::create(['branch_id' => $cse->id, 'year' => 2, 'group_name' => 'CSE-B']);

        // 3. Create Classes for EE
        CourseClass::create(['branch_id' => $ee->id, 'year' => 1, 'group_name' => 'EE-A']);
        CourseClass::create(['branch_id' => $ee->id, 'year' => 2, 'group_name' => 'EE-A']);
        
        // 4. Create Classes for ECE
        CourseClass::create(['branch_id' => $ece->id, 'year' => 1, 'group_name' => 'ECE-A']);
    }
}
