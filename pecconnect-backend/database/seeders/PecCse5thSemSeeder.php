<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\CourseClass;
use App\Models\Timetable;
use Illuminate\Database\Seeder;

class PecCse5thSemSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Ensure CSE Branch exists
        $cse = Branch::updateOrCreate(
            ['code' => 'CSE'],
            ['name' => 'Computer Science and Engineering']
        );

        // 2. Create G1 and G2 Classes for Year 3 (5th Sem)
        // G1: CSE1 (1-20), CSE2 (21-40), CSE3 (41-60), Special (127, 131-134)
        $g1 = CourseClass::updateOrCreate(
            ['branch_id' => $cse->id, 'year' => 3, 'group_name' => 'CSE - G1 (Roll 1-60 & 127, 131-134)'],
            ['cr_user_id' => null]
        );

        // G2: CSE4 (61-80), CSE5 (81-100), CSE6 (101-120), CSE7 (121+)
        $g2 = CourseClass::updateOrCreate(
            ['branch_id' => $cse->id, 'year' => 3, 'group_name' => 'CSE - G2 (Roll 61-120 & 121+)'],
            ['cr_user_id' => null]
        );

        // Clear existing slots for these 5th Sem classes to prevent duplicates
        Timetable::whereIn('class_id', [$g1->id, $g2->id])->delete();

        // =========================================================================
        // 3. G1 SCHEDULE (Lectures + CSE1-3 & Special CSE7 Labs)
        // Handled by G1 CR
        // =========================================================================
        $g1Schedule = [
            // MONDAY
            ['day' => 1, 'period' => 1, 'start' => '08:00:00', 'end' => '09:00:00', 'subject' => 'CSP5101 Minor Project', 'teacher' => 'CSE Dept', 'room' => '-'],
            ['day' => 1, 'period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'CSN5003 SE (G1)', 'teacher' => 'Dr. Ashpreet', 'room' => 'L21'],
            ['day' => 1, 'period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'CSN5001 TOC (G1)', 'teacher' => 'Dr. Sandeep Harit', 'room' => 'L21'],
            ['day' => 1, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'CSN5001 TOC Tut (CSE3: Roll 41-60)', 'teacher' => 'Dr. Sandeep Harit + Dr. Ravpreet', 'room' => '304+306'],
            ['day' => 1, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'CSN5001 TOC Tut (CSE1, CSE2: Roll 1-40)', 'teacher' => 'Dr. Sandeep Harit + Dr. Ravpreet', 'room' => '304+306'],
            ['day' => 1, 'period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'CSN5002 SC (G1)', 'teacher' => 'Dr. Dipika', 'room' => 'L21'],
            ['day' => 1, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'MSC L (CSM1003 DBMS)', 'teacher' => 'Dr. Pravneet Kaur', 'room' => 'L19'],

            // TUESDAY
            ['day' => 2, 'period' => 2, 'start' => '09:00:00', 'end' => '11:00:00', 'subject' => 'CSH1001 Honours Project- I', 'teacher' => 'CSE Dept', 'room' => '-'],
            ['day' => 2, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'CSN5004 DBMS (G1)', 'teacher' => 'Dr. Shilpa', 'room' => 'L22'],
            ['day' => 2, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'CSN5001 TOC Tut (CSE7: Roll 127, 131-134)', 'teacher' => 'Dr. Sandeep Harit + Dr. Ravpreet', 'room' => 'CL13'],
            ['day' => 2, 'period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'CSN5002 SC (G1)', 'teacher' => 'Dr. Dipika', 'room' => 'L22'],
            ['day' => 2, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'MSC L (CSM1003 DBMS)', 'teacher' => 'Dr. Pravneet Kaur', 'room' => 'L22'],
            ['day' => 2, 'period' => 10, 'start' => '17:00:00', 'end' => '19:00:00', 'subject' => 'CSN5002 SC Lab (CSE3: Roll 41-60)', 'teacher' => 'Dr. Dipika', 'room' => '301+303'],

            // WEDNESDAY
            ['day' => 3, 'period' => 1, 'start' => '08:00:00', 'end' => '10:00:00', 'subject' => 'CSN5004 DBMS Lab (CSE3: Roll 41-60)', 'teacher' => 'Dr. Shilpa', 'room' => '402+306'],
            ['day' => 3, 'period' => 3, 'start' => '10:00:00', 'end' => '12:00:00', 'subject' => 'CSN5004 DBMS Lab (CSE7: Roll 127, 131-134)', 'teacher' => 'Dr. Shilpa', 'room' => 'CL14'],
            ['day' => 3, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'CSN5001 TOC (G1)', 'teacher' => 'Dr. Sandeep Harit', 'room' => 'L21'],
            ['day' => 3, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'MSC L (CSM1003 DBMS)', 'teacher' => 'Dr. Pravneet Kaur', 'room' => 'L22'],

            // THURSDAY
            ['day' => 4, 'period' => 2, 'start' => '09:00:00', 'end' => '11:00:00', 'subject' => 'CSH1001 Honours Project- I', 'teacher' => 'CSE Dept', 'room' => '-'],
            ['day' => 4, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'CSN5003 SE (G1)', 'teacher' => 'Dr. Ashpreet', 'room' => 'L407'],
            ['day' => 4, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'CSN5004 DBMS (G1)', 'teacher' => 'Dr. Shilpa', 'room' => 'L407'],
            ['day' => 4, 'period' => 7, 'start' => '14:00:00', 'end' => '16:00:00', 'subject' => 'CSN5004 DBMS Lab (CSE1, CSE2: Roll 1-40)', 'teacher' => 'Dr. Shilpa', 'room' => '402+301'],
            ['day' => 4, 'period' => 7, 'start' => '14:00:00', 'end' => '16:00:00', 'subject' => 'CSN5003 SE Lab (CSE7: Roll 127, 131-134)', 'teacher' => 'Dr. Ashpreet/Shivani', 'room' => '306'],
            ['day' => 4, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'CSN5001+AIN5001 TOC (G1)', 'teacher' => 'Dr. Sandeep Harit', 'room' => 'L21'],
            ['day' => 4, 'period' => 10, 'start' => '17:00:00', 'end' => '19:00:00', 'subject' => 'CSN5003 SE Lab (CSE3: Roll 41-60)', 'teacher' => 'Ms. Shivani', 'room' => '301+303'],
            ['day' => 4, 'period' => 10, 'start' => '17:00:00', 'end' => '19:00:00', 'subject' => 'CSN5002 SC Lab (CSE1, CSE2: Roll 1-40)', 'teacher' => 'Dr. Dipika', 'room' => '402+L405'],

            // FRIDAY
            ['day' => 5, 'period' => 1, 'start' => '08:00:00', 'end' => '09:00:00', 'subject' => 'CSP5101 Minor Project', 'teacher' => 'CSE Dept', 'room' => '-'],
            ['day' => 5, 'period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'CSN5002 SC (G1)', 'teacher' => 'Dr. Dipika', 'room' => 'L21'],
            ['day' => 5, 'period' => 3, 'start' => '10:00:00', 'end' => '12:00:00', 'subject' => 'CSN5002 SC Lab (CSE7: Roll 127, 131-134)', 'teacher' => 'Dr. Dipika', 'room' => '301'],
            ['day' => 5, 'period' => 3, 'start' => '10:00:00', 'end' => '12:00:00', 'subject' => 'CSN5003 SE Lab (CSE1, CSE2: Roll 1-40)', 'teacher' => 'Dr. Ashpreet + Ms. Shivani', 'room' => '303+CL13'],
            ['day' => 5, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'CSN5004 DBMS (G1)', 'teacher' => 'Dr. Shilpa', 'room' => '407'],
            ['day' => 5, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'CSN5003 SE (G1)', 'teacher' => 'Dr. Ashpreet', 'room' => 'L21'],
            ['day' => 5, 'period' => 8, 'start' => '15:00:00', 'end' => '17:00:00', 'subject' => 'MSC Lab (CSM1003 DBMS)', 'teacher' => 'Dr. Pravneet Kaur', 'room' => 'L22'],
        ];

        foreach ($g1Schedule as $slot) {
            $this->seedSlot($g1->id, $slot);
        }

        // =========================================================================
        // 4. G2 SCHEDULE (Lectures + CSE4-7 Labs)
        // Handled by G2 CR
        // =========================================================================
        $g2Schedule = [
            // MONDAY
            ['day' => 1, 'period' => 1, 'start' => '08:00:00', 'end' => '09:00:00', 'subject' => 'CSP5101 Minor Project', 'teacher' => 'CSE Dept', 'room' => '-'],
            ['day' => 1, 'period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'CSN5003 SE (G2)', 'teacher' => 'Dr. Shivani', 'room' => 'L22'],
            ['day' => 1, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'CSN5001 TOC Tut (CSE4: Roll 61-80)', 'teacher' => 'Dr. Sandeep Harit + Dr. Ravpreet', 'room' => '304+306'],
            ['day' => 1, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'CSN5001 TOC (G2)', 'teacher' => 'Dr. Sandeep Harit', 'room' => 'L21'],
            ['day' => 1, 'period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'CSN5004 DBMS (G2)', 'teacher' => 'Dr. Shilpa', 'room' => 'L22'],
            ['day' => 1, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'MSC L (CSM1003 DBMS)', 'teacher' => 'Dr. Pravneet Kaur', 'room' => 'L19'],

            // TUESDAY
            ['day' => 2, 'period' => 2, 'start' => '09:00:00', 'end' => '11:00:00', 'subject' => 'CSH1001 Honours Project- I', 'teacher' => 'CSE Dept', 'room' => '-'],
            ['day' => 2, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'CSN5001 TOC (G2)', 'teacher' => 'Dr. Sandeep Harit', 'room' => 'L407'],
            ['day' => 2, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'CSN5001 TOC Tut (CSE7: Roll 121+)', 'teacher' => 'Dr. Sandeep Harit + Dr. Ravpreet', 'room' => 'CL13'],
            ['day' => 2, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'CSN5001 TOC Tut (CSE5, CSE6: Roll 81-120)', 'teacher' => 'Dr. Sandeep Harit + Dr. Ravpreet', 'room' => '301+306'],
            ['day' => 2, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'MSC L (CSM1003 DBMS)', 'teacher' => 'Dr. Pravneet Kaur', 'room' => 'L22'],
            ['day' => 2, 'period' => 10, 'start' => '17:00:00', 'end' => '19:00:00', 'subject' => 'CSN5002 SC Lab (CSE4: Roll 61-80)', 'teacher' => 'Dr. Dipika', 'room' => '301+303'],

            // WEDNESDAY
            ['day' => 3, 'period' => 1, 'start' => '08:00:00', 'end' => '10:00:00', 'subject' => 'CSN5004 DBMS Lab (CSE4: Roll 61-80)', 'teacher' => 'Dr. Shilpa', 'room' => '402+306'],
            ['day' => 3, 'period' => 1, 'start' => '08:00:00', 'end' => '10:00:00', 'subject' => 'CSN5002 SC Lab (CSE5, CSE6: Roll 81-120)', 'teacher' => 'Dr. Dipika', 'room' => 'CL13+CL14'],
            ['day' => 3, 'period' => 3, 'start' => '10:00:00', 'end' => '12:00:00', 'subject' => 'CSN5003 SE Lab (CSE5, CSE6: Roll 81-120)', 'teacher' => 'Dr. Shivani', 'room' => 'CL13+CL5'],
            ['day' => 3, 'period' => 3, 'start' => '10:00:00', 'end' => '12:00:00', 'subject' => 'CSN5004 DBMS Lab (CSE7: Roll 121+)', 'teacher' => 'Dr. Shilpa', 'room' => 'CL14'],
            ['day' => 3, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'CSN5004 DBMS (G2)', 'teacher' => 'Dr. Shilpa', 'room' => 'L407'],
            ['day' => 3, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'CSN5002 SC (G2)', 'teacher' => 'Dr. Dipika', 'room' => 'L22'],
            ['day' => 3, 'period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'CSN5001 TOC (G2)', 'teacher' => 'Dr. Sandeep Harit', 'room' => 'L26'],
            ['day' => 3, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'MSC L (CSM1003 DBMS)', 'teacher' => 'Dr. Pravneet Kaur', 'room' => 'L22'],

            // THURSDAY
            ['day' => 4, 'period' => 2, 'start' => '09:00:00', 'end' => '11:00:00', 'subject' => 'CSH1001 Honours Project- I', 'teacher' => 'CSE Dept', 'room' => '-'],
            ['day' => 4, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'CSN5002 SC (G2)', 'teacher' => 'Dr. Dipika', 'room' => 'L406'],
            ['day' => 4, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'CSN5003 SE (G2)', 'teacher' => 'Dr. Shivani', 'room' => 'L30'],
            ['day' => 4, 'period' => 7, 'start' => '14:00:00', 'end' => '16:00:00', 'subject' => 'CSN5003 SE Lab (CSE7: Roll 121+)', 'teacher' => 'Dr. Ashpreet/Shivani', 'room' => '306'],
            ['day' => 4, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'CSN5002 SC (G2)', 'teacher' => 'Dr. Dipika', 'room' => 'L22'],
            ['day' => 4, 'period' => 10, 'start' => '17:00:00', 'end' => '19:00:00', 'subject' => 'CSN5003 SE Lab (CSE4: Roll 61-80)', 'teacher' => 'Ms. Shivani', 'room' => '301+303'],

            // FRIDAY
            ['day' => 5, 'period' => 1, 'start' => '08:00:00', 'end' => '09:00:00', 'subject' => 'CSP5101 Minor Project', 'teacher' => 'CSE Dept', 'room' => '-'],
            ['day' => 5, 'period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'CSN5004 DBMS (G2)', 'teacher' => 'Dr. Shilpa', 'room' => 'L22'],
            ['day' => 5, 'period' => 3, 'start' => '10:00:00', 'end' => '12:00:00', 'subject' => 'CSN5002 SC Lab (CSE7: Roll 121+)', 'teacher' => 'Dr. Dipika', 'room' => '301'],
            ['day' => 5, 'period' => 3, 'start' => '10:00:00', 'end' => '12:00:00', 'subject' => 'CSN5004 DBMS Lab (CSE5, CSE6: Roll 81-120)', 'teacher' => 'Dr. Shilpa', 'room' => '402+L407'],
            ['day' => 5, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'CSN5003 SE (G2)', 'teacher' => 'Dr. Shivani', 'room' => 'L22'],
            ['day' => 5, 'period' => 8, 'start' => '15:00:00', 'end' => '17:00:00', 'subject' => 'MSC Lab (CSM1003 DBMS)', 'teacher' => 'Dr. Pravneet Kaur', 'room' => 'L22'],
        ];

        foreach ($g2Schedule as $slot) {
            $this->seedSlot($g2->id, $slot);
        }
    }

    private function seedSlot(int $classId, array $slot): void
    {
        Timetable::updateOrCreate(
            [
                'class_id'    => $classId,
                'type'        => 'weekly',
                'day_of_week' => $slot['day'],
                'start_time'  => $slot['start'],
                'subject'     => $slot['subject'],
            ],
            [
                'period_no' => $slot['period'],
                'end_time'  => $slot['end'],
                'teacher'   => $slot['teacher'],
                'room'      => $slot['room'],
                'date'      => null,
                'reason'    => null,
            ]
        );
    }
}
