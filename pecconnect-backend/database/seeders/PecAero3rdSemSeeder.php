<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\CourseClass;
use App\Models\Timetable;
use Illuminate\Database\Seeder;

class PecAero3rdSemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Ensure Aerospace Engineering Branch exists
        $aeroBranch = Branch::updateOrCreate(
            ['code' => 'AERO'],
            ['name' => 'Aerospace Engineering']
        );

        // 2. Create single unified class for 3rd semester Aero
        $aeroClass = CourseClass::updateOrCreate(
            ['branch_id' => $aeroBranch->id, 'year' => 2, 'group_name' => 'AERO'],
            ['cr_user_id' => null]
        );

        // 3. Clear existing timetable entries for this class to prevent duplicates
        Timetable::where('class_id', $aeroClass->id)->delete();

        // 4. Define schedules
        $schedules = [
            1 => [ // Monday
                ['period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'AEN3004 (L)', 'teacher' => 'Prof. Konark Arora (KA)', 'room' => 'T-19'],
                ['period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'AEN3001 (L)', 'teacher' => 'Dr. Amarjeet Singh (AS)', 'room' => 'Audi'],
                ['period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'AEN3005 (L)', 'teacher' => 'Prof. Rajesh Kumar Verma (RKV)', 'room' => 'T-19'],
                ['period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'AEN3002 (L)', 'teacher' => 'Dr. Parvinder Kumar (PK)', 'room' => 'T-19'],
                ['period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'Minor Specialisation Course', 'teacher' => 'TBD', 'room' => 'L1'],
            ],
            2 => [ // Tuesday
                ['period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'AEN3004 (L)', 'teacher' => 'Prof. Konark Arora (KA)', 'room' => 'T-19'],
                ['period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'AEN3003 (L)', 'teacher' => 'Prof. Rakesh Kumar (RK)', 'room' => 'T-19'],
                ['period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'AEN3002 (L)', 'teacher' => 'Dr. Parvinder Kumar (PK)', 'room' => 'T-19'],
                ['period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'AEN3005 (L)', 'teacher' => 'Prof. Rajesh Kumar Verma (RKV)', 'room' => 'T-19'],
                ['period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'Minor Specialisation Course', 'teacher' => 'TBD', 'room' => 'L2'],
            ],
            3 => [ // Wednesday
                ['period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'AEN3004 (L)', 'teacher' => 'Prof. Konark Arora (KA)', 'room' => 'T-19'],
                ['period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'AEN3003 (L)', 'teacher' => 'Prof. Rakesh Kumar (RK)', 'room' => 'T-19'],
                ['period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'AEN3003 (T)', 'teacher' => 'Prof. Rakesh Kumar (RK)', 'room' => 'T-19'],
                ['period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'AEN3005 (T)', 'teacher' => 'Prof. Rajesh Kumar Verma (RKV)', 'room' => 'T-19'],
                ['period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'Minor Specialisation Course', 'teacher' => 'TBD', 'room' => 'L3'],
            ],
            4 => [ // Thursday
                ['period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'AEN3001 (L)', 'teacher' => 'Dr. Amarjeet Singh (AS)', 'room' => 'Audi'],
                ['period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'AEN3004 (T)', 'teacher' => 'Prof. Konark Arora (KA)', 'room' => 'T-19'],
                ['period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'AEN3003 (L)', 'teacher' => 'Prof. Rakesh Kumar (RK)', 'room' => 'T-19'],
                ['period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'AEN3002 (T)', 'teacher' => 'Dr. Parvinder Kumar (PK)', 'room' => 'T-19'],
            ],
            5 => [ // Friday
                ['period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'AEN3001 (L)', 'teacher' => 'Dr. Amarjeet Singh (AS)', 'room' => 'Audi'],
                ['period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'AEN3005 (L)', 'teacher' => 'Prof. Rajesh Kumar Verma (RKV)', 'room' => 'T-19'],
                ['period' => 4, 'start' => '11:00:00', 'end' => '13:00:00', 'subject' => 'AEN3001 Lab/Practical', 'teacher' => 'Dr. Amarjeet Singh (AS)', 'room' => 'TBD'],
                ['period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'AEN3002 (L)', 'teacher' => 'Dr. Parvinder Kumar (PK)', 'room' => 'T-19'],
                ['period' => 8, 'start' => '15:00:00', 'end' => '17:00:00', 'subject' => 'Minor Specialization Tut/Practical', 'teacher' => 'TBD', 'room' => 'TBD'],
            ]
        ];

        // 5. Insert entries
        foreach ($schedules as $dayOfWeek => $slots) {
            foreach ($slots as $slot) {
                Timetable::create([
                    'class_id' => $aeroClass->id,
                    'day_of_week' => $dayOfWeek,
                    'period_no' => $slot['period'],
                    'start_time' => $slot['start'],
                    'end_time' => $slot['end'],
                    'subject' => $slot['subject'],
                    'teacher' => $slot['teacher'],
                    'room' => $slot['room']
                ]);
            }
        }
    }
}
