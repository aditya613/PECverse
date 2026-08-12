<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\CourseClass;
use App\Models\Timetable;
use Illuminate\Database\Seeder;

class PecCivil3rdSemSeeder extends Seeder
{
    public function run(): void
    {
        // Ensure Civil branch exists
        $branch = Branch::firstOrCreate(
            ['code' => 'CE'],
            ['name' => 'Civil Engineering']
        );

        // Club all G2 subgroups (C-4, C-5, C-6) into a single logical class
        $civilClass = CourseClass::firstOrCreate([
            'branch_id' => $branch->id,
            'year' => 2,
            'group_name' => 'CIVIL G2 (SID C4-C6)',
        ]);

        $schedule = [
            // ================= MONDAY =================
            ['day' => 1, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'Fluid Mechanics-L', 'teacher' => 'TBA', 'room' => 'L-1'],
            ['day' => 1, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'Structural Analysis-L', 'teacher' => 'TBA', 'room' => 'L-1'],
            
            ['day' => 1, 'start' => '11:00:00', 'end' => '13:00:00', 'subject' => 'Survey Lab (C-5)', 'teacher' => 'TBA', 'room' => '-'],
            ['day' => 1, 'start' => '11:00:00', 'end' => '13:00:00', 'subject' => 'SM Lab (C-6)', 'teacher' => 'TBA', 'room' => '-'],

            ['day' => 1, 'start' => '14:00:00', 'end' => '16:00:00', 'subject' => 'Fluid Mechanics Lab (C-4)', 'teacher' => 'TBA', 'room' => '-'],
            ['day' => 1, 'start' => '14:00:00', 'end' => '16:00:00', 'subject' => 'RCC Lab (C-5)', 'teacher' => 'TBA', 'room' => '-'],
            ['day' => 1, 'start' => '14:00:00', 'end' => '16:00:00', 'subject' => 'Transportation Lab (C-6)', 'teacher' => 'TBA', 'room' => '-'],

            ['day' => 1, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'Minor Spec (Lec.)', 'teacher' => 'TBA', 'room' => '-'],

            // ================= TUESDAY =================
            ['day' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'Structural Analysis-L', 'teacher' => 'TBA', 'room' => 'L-1'],
            ['day' => 2, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'Geo Informatics-L', 'teacher' => 'TBA', 'room' => 'L-1'],
            ['day' => 2, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'Building Materials-L', 'teacher' => 'TBA', 'room' => 'L-1'],
            ['day' => 2, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'Transportation Eng-L', 'teacher' => 'TBA', 'room' => 'L-1'],

            ['day' => 2, 'start' => '14:00:00', 'end' => '16:00:00', 'subject' => 'RCC Lab (C-4)', 'teacher' => 'TBA', 'room' => '-'],
            ['day' => 2, 'start' => '14:00:00', 'end' => '16:00:00', 'subject' => 'Transportation Lab (C-5)', 'teacher' => 'TBA', 'room' => '-'],

            ['day' => 2, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'Minor Spec (Lec.)', 'teacher' => 'TBA', 'room' => '-'],

            // ================= WEDNESDAY =================
            ['day' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'Structural Analysis-L', 'teacher' => 'TBA', 'room' => 'L-1'],
            ['day' => 3, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'Fluid Mechanics-L', 'teacher' => 'TBA', 'room' => 'L-1'],
            ['day' => 3, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'Transportation Eng-L', 'teacher' => 'TBA', 'room' => 'L-1'],

            ['day' => 3, 'start' => '14:00:00', 'end' => '16:00:00', 'subject' => 'SM Lab (C-4)', 'teacher' => 'TBA', 'room' => '-'],
            ['day' => 3, 'start' => '14:00:00', 'end' => '16:00:00', 'subject' => 'Fluid Mechanics Lab (C-5)', 'teacher' => 'TBA', 'room' => '-'],
            ['day' => 3, 'start' => '14:00:00', 'end' => '16:00:00', 'subject' => 'RCC Lab (C-6)', 'teacher' => 'TBA', 'room' => '-'],

            ['day' => 3, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'Minor Spec (Lec.)', 'teacher' => 'TBA', 'room' => '-'],

            // ================= THURSDAY =================
            ['day' => 4, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'Fluid Mechanics-L', 'teacher' => 'TBA', 'room' => 'L-1'],
            ['day' => 4, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'Building Materials-L', 'teacher' => 'TBA', 'room' => 'L-1'],
            ['day' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'Transportation Eng-L', 'teacher' => 'TBA', 'room' => 'L-1'],
            ['day' => 4, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'Geo Informatics-L', 'teacher' => 'TBA', 'room' => 'L-1'],

            ['day' => 4, 'start' => '14:00:00', 'end' => '16:00:00', 'subject' => 'Survey Lab (C-4)', 'teacher' => 'TBA', 'room' => '-'],
            ['day' => 4, 'start' => '14:00:00', 'end' => '16:00:00', 'subject' => 'SM Lab (C-5)', 'teacher' => 'TBA', 'room' => '-'],
            ['day' => 4, 'start' => '14:00:00', 'end' => '16:00:00', 'subject' => 'Fluid Mechanics Lab (C-6)', 'teacher' => 'TBA', 'room' => '-'],

            // ================= FRIDAY =================
            ['day' => 5, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'Building Materials-L', 'teacher' => 'TBA', 'room' => 'L-2'],
            ['day' => 5, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'Geo Informatics-L', 'teacher' => 'TBA', 'room' => 'L-2'],

            ['day' => 5, 'start' => '11:00:00', 'end' => '13:00:00', 'subject' => 'Transportation Lab (C-4)', 'teacher' => 'TBA', 'room' => '-'],
            ['day' => 5, 'start' => '11:00:00', 'end' => '13:00:00', 'subject' => 'Survey Lab (C-6)', 'teacher' => 'TBA', 'room' => '-'],

            ['day' => 5, 'start' => '15:00:00', 'end' => '17:00:00', 'subject' => 'Minor Spec (Tute/Practical)', 'teacher' => 'TBA', 'room' => '-'],
        ];

        // Seed to database
        Timetable::where('class_id', $civilClass->id)->delete();

        foreach ($schedule as $slot) {
            Timetable::create([
                'class_id' => $civilClass->id,
                'type' => 'weekly',
                'day_of_week' => $slot['day'],
                'start_time' => $slot['start'],
                'end_time' => $slot['end'],
                'subject' => $slot['subject'],
                'teacher' => $slot['teacher'],
                'room' => $slot['room'],
            ]);
        }
    }
}
