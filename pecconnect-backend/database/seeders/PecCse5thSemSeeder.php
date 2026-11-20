<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\CourseClass;
use App\Models\Timetable;
use Illuminate\Database\Seeder;

class PecCse5thSemSeeder extends Seeder
{
    /**
     * Run database seeds for B.Tech CSE 5th Semester Timetable (Session 26271, w.e.f. 9/10/2026).
     */
    public function run(): void
    {
        // 1. Ensure CSE Branch exists
        $cse = Branch::updateOrCreate(
            ['code' => 'CSE'],
            ['name' => 'Computer Science and Engineering']
        );

        // 2. Create G1 and G2 Classes for Year 3 (5th Sem)
        // G1: CSE1 (1-20), CSE2 (21-40), CSE3 (41-60), Special CSE7 (127, 131-134)
        $g1 = CourseClass::updateOrCreate(
            ['branch_id' => $cse->id, 'year' => 3, 'group_name' => 'CSE - G1 (Roll 1-60 & 127, 131-134)'],
            ['cr_user_id' => null]
        );

        // G2: CSE4 (61-80), CSE5 (81-100), CSE6 (101-120), CSE7 (121+)
        $g2 = CourseClass::updateOrCreate(
            ['branch_id' => $cse->id, 'year' => 3, 'group_name' => 'CSE - G2 (Roll 61-120 & 121+)'],
            ['cr_user_id' => null]
        );

        // Clear existing slots to prevent duplicates
        Timetable::whereIn('class_id', [$g1->id, $g2->id])->delete();

        // =========================================================================
        // 3. G1 SCHEDULE (Lectures + CSE1-3 & Special CSE7 Labs) w.e.f. 09/10/2026
        // =========================================================================
        $g1Schedule = [
            // MONDAY (Day 1)
            ['day' => 1, 'period' => 1, 'start' => '08:00:00', 'end' => '09:00:00', 'subject' => 'CSP5101- Minor Project', 'teacher' => 'CSE Dept', 'room' => 'Dept Labs'],
            ['day' => 1, 'period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'CSN5003 SE (G1)', 'teacher' => 'Dr. Tejinder', 'room' => 'L21'],
            ['day' => 1, 'period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'CSN5001 TOC (G1)', 'teacher' => 'Dr. Sandeep Harit', 'room' => 'L21'],
            ['day' => 1, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'CSN5001 TOC Tut (CSE3, CSE4)', 'teacher' => 'Dr. Sandeep Harit + Dr. Ravpreet', 'room' => '304+306'],
            ['day' => 1, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'CSN5001 TOC Tut (CSE1, CSE2)', 'teacher' => 'Dr. Sandeep Harit + Dr. Ravpreet', 'room' => '304+306'],
            ['day' => 1, 'period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'CSN5002 SC (G1)', 'teacher' => 'Dr. Dipika', 'room' => 'L21'],
            ['day' => 1, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'MSC L (CSM1003 DBMS)', 'teacher' => 'Dr. Pravneet Kaur', 'room' => 'L19'],

            // TUESDAY (Day 2)
            ['day' => 2, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'CSN5004 DBMS (G1)', 'teacher' => 'Dr. Shilpa', 'room' => 'L22'],
            ['day' => 2, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'CSN5002 SC (G1)', 'teacher' => 'Dr. Dipika', 'room' => 'L407'],
            ['day' => 2, 'period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'CSN5001 TOC Tut (CSE7)', 'teacher' => 'Dr. Sandeep Harit + Dr. Ravpreet', 'room' => '304'],
            ['day' => 2, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'MSC L (CSM1003 DBMS)', 'teacher' => 'Dr. Pravneet Kaur', 'room' => 'L22'],

            // WEDNESDAY (Day 3)
            ['day' => 3, 'period' => 1, 'start' => '08:00:00', 'end' => '10:00:00', 'subject' => 'CSN5004 DBMS Lab (CSE1, CSE2)', 'teacher' => 'Dr. Shilpa', 'room' => '402+306'],
            ['day' => 3, 'period' => 3, 'start' => '10:00:00', 'end' => '12:00:00', 'subject' => 'CSN5004 DBMS Lab (CSE7)', 'teacher' => 'Dr. Shilpa', 'room' => 'CL14'],
            ['day' => 3, 'period' => 4, 'start' => '11:00:00', 'end' => '13:00:00', 'subject' => 'CSN5002 SC Lab (CSE1, CSE2, CSE3, CSE4)', 'teacher' => 'Dr. Dipika', 'room' => 'DS lab'],
            ['day' => 3, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'CSN5001 TOC (G1)', 'teacher' => 'Dr. Sandeep Harit', 'room' => 'L21'],
            ['day' => 3, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'MSC L (CSM1003 DBMS)', 'teacher' => 'Dr. Pravneet Kaur', 'room' => 'L22'],

            // THURSDAY (Day 4)
            ['day' => 4, 'period' => 2, 'start' => '09:00:00', 'end' => '11:00:00', 'subject' => 'CSN5003 SE Lab (CSE3, CSE4)', 'teacher' => 'Ms. Shivani / Dr. Tejinder', 'room' => 'Lab 301'],
            ['day' => 4, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'CSN5003 SE (G1)', 'teacher' => 'Dr. Tejinder', 'room' => 'L407'],
            ['day' => 4, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'CSN5004 DBMS (G1)', 'teacher' => 'Dr. Shilpa', 'room' => 'L407'],
            ['day' => 4, 'period' => 7, 'start' => '14:00:00', 'end' => '16:00:00', 'subject' => 'CSN5003 SE Lab (CSE7)', 'teacher' => 'Dr. Tejinder / Shivani', 'room' => '306'],
            ['day' => 4, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'CSN5001 TOC (G1)', 'teacher' => 'Dr. Sandeep Harit', 'room' => 'L21'],

            // FRIDAY (Day 5)
            ['day' => 5, 'period' => 1, 'start' => '08:00:00', 'end' => '09:00:00', 'subject' => 'CSP5101- Minor Project', 'teacher' => 'CSE Dept', 'room' => 'Dept Labs'],
            ['day' => 5, 'period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'CSN5002 SC (G1)', 'teacher' => 'Dr. Dipika', 'room' => 'L21'],
            ['day' => 5, 'period' => 3, 'start' => '10:00:00', 'end' => '12:00:00', 'subject' => 'CSN5002 SC Lab (CSE7)', 'teacher' => 'Dr. Dipika', 'room' => '301'],
            ['day' => 5, 'period' => 3, 'start' => '10:00:00', 'end' => '12:00:00', 'subject' => 'CSN5003 SE Lab (CSE1, CSE2)', 'teacher' => 'Dr. Tejinder + Ms. Shivani', 'room' => '303+CL13'],
            ['day' => 5, 'period' => 3, 'start' => '10:00:00', 'end' => '12:00:00', 'subject' => 'CSN5004 DBMS Lab (CSE3, CSE4)', 'teacher' => 'Dr. Shilpa', 'room' => '402+L407'],
            ['day' => 5, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'CSN5004 DBMS (G1)', 'teacher' => 'Dr. Shilpa', 'room' => '407'],
            ['day' => 5, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'CSN5003 SE (G1)', 'teacher' => 'Dr. Tejinder', 'room' => 'L21'],
            ['day' => 5, 'period' => 8, 'start' => '15:00:00', 'end' => '17:00:00', 'subject' => 'MSC Lab (CSM1003 DBMS)', 'teacher' => 'Dr. Pravneet Kaur', 'room' => 'L22'],
        ];

        foreach ($g1Schedule as $slot) {
            $this->seedSlot($g1->id, $slot);
        }

        // =========================================================================
        // 4. G2 SCHEDULE (Lectures + CSE4-7 Labs) w.e.f. 09/10/2026
        // =========================================================================
        $g2Schedule = [
            // MONDAY (Day 1)
            ['day' => 1, 'period' => 1, 'start' => '08:00:00', 'end' => '09:00:00', 'subject' => 'CSP5101- Minor Project', 'teacher' => 'CSE Dept', 'room' => 'Dept Labs'],
            ['day' => 1, 'period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'CSN5003 SE (G2)', 'teacher' => 'Dr. Tejinder', 'room' => 'L22'],
            ['day' => 1, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'CSN5001 TOC Tut (CSE3, CSE4)', 'teacher' => 'Dr. Sandeep Harit + Dr. Ravpreet', 'room' => '304+306'],
            ['day' => 1, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'CSN5001 TOC (G2)', 'teacher' => 'Dr. Sandeep Harit', 'room' => 'L21'],
            ['day' => 1, 'period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'CSN5004 DBMS (G2)', 'teacher' => 'Dr. Shilpa', 'room' => 'L22'],
            ['day' => 1, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'MSC L (CSM1003 DBMS)', 'teacher' => 'Dr. Pravneet Kaur', 'room' => 'L19'],

            // TUESDAY (Day 2)
            ['day' => 2, 'period' => 2, 'start' => '09:00:00', 'end' => '11:00:00', 'subject' => 'CSN5002 SC Lab (CSE5, CSE6)', 'teacher' => 'Dr. Dipika', 'room' => '305'],
            ['day' => 2, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'CSN5001 TOC (G2)', 'teacher' => 'Dr. Sandeep Harit', 'room' => 'L407'],
            ['day' => 2, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'CSN5004 DBMS (G2)', 'teacher' => 'Dr. Shilpa', 'room' => 'L406'],
            ['day' => 2, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'CSN5001 TOC Tut (CSE5, CSE6)', 'teacher' => 'Dr. Sandeep Harit + Dr. Ravpreet', 'room' => '301+306'],
            ['day' => 2, 'period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'CSN5001 TOC Tut (CSE7)', 'teacher' => 'Dr. Sandeep Harit + Dr. Ravpreet', 'room' => '304'],
            ['day' => 2, 'period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'CSN5003 SE (G2)', 'teacher' => 'Dr. Tejinder', 'room' => 'L21'],
            ['day' => 2, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'MSC L (CSM1003 DBMS)', 'teacher' => 'Dr. Pravneet Kaur', 'room' => 'L22'],

            // WEDNESDAY (Day 3)
            ['day' => 3, 'period' => 3, 'start' => '10:00:00', 'end' => '12:00:00', 'subject' => 'CSN5003 SE Lab (CSE5, CSE6)', 'teacher' => 'Dr. Shivani / Dr. Tejinder', 'room' => 'CL13+CL5'],
            ['day' => 3, 'period' => 3, 'start' => '10:00:00', 'end' => '12:00:00', 'subject' => 'CSN5004 DBMS Lab (CSE7)', 'teacher' => 'Dr. Shilpa', 'room' => 'CL14'],
            ['day' => 3, 'period' => 4, 'start' => '11:00:00', 'end' => '13:00:00', 'subject' => 'CSN5002 SC Lab (CSE1, CSE2, CSE3, CSE4)', 'teacher' => 'Dr. Dipika', 'room' => 'DS lab'],
            ['day' => 3, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'CSN5002 SC (G2)', 'teacher' => 'Dr. Dipika', 'room' => '405'],
            ['day' => 3, 'period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'CSN5001 TOC (G2)', 'teacher' => 'Dr. Sandeep Harit', 'room' => 'L26'],
            ['day' => 3, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'MSC L (CSM1003 DBMS)', 'teacher' => 'Dr. Pravneet Kaur', 'room' => 'L22'],

            // THURSDAY (Day 4)
            ['day' => 4, 'period' => 2, 'start' => '09:00:00', 'end' => '11:00:00', 'subject' => 'CSN5003 SE Lab (CSE3, CSE4)', 'teacher' => 'Ms. Shivani / Dr. Tejinder', 'room' => 'Lab 301'],
            ['day' => 4, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'CSN5002 SC (G2)', 'teacher' => 'Dr. Dipika', 'room' => 'L406'],
            ['day' => 4, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'CSN5003 SE (G2)', 'teacher' => 'Dr. Tejinder', 'room' => 'L30'],
            ['day' => 4, 'period' => 7, 'start' => '14:00:00', 'end' => '16:00:00', 'subject' => 'CSN5003 SE Lab (CSE7)', 'teacher' => 'Dr. Tejinder / Shivani', 'room' => '306'],
            ['day' => 4, 'period' => 7, 'start' => '14:00:00', 'end' => '16:00:00', 'subject' => 'CSN5004 DBMS Lab (CSE5, CSE6)', 'teacher' => 'Dr. Shilpa', 'room' => '402+301'],
            ['day' => 4, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'CSN5002 SC (G2)', 'teacher' => 'Dr. Dipika', 'room' => 'L22'],

            // FRIDAY (Day 5)
            ['day' => 5, 'period' => 1, 'start' => '08:00:00', 'end' => '09:00:00', 'subject' => 'CSP5101- Minor Project', 'teacher' => 'CSE Dept', 'room' => 'Dept Labs'],
            ['day' => 5, 'period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'CSN5004 DBMS (G2)', 'teacher' => 'Dr. Shilpa', 'room' => 'L22'],
            ['day' => 5, 'period' => 3, 'start' => '10:00:00', 'end' => '12:00:00', 'subject' => 'CSN5002 SC Lab (CSE7)', 'teacher' => 'Dr. Dipika', 'room' => '301'],
            ['day' => 5, 'period' => 3, 'start' => '10:00:00', 'end' => '12:00:00', 'subject' => 'CSN5004 DBMS Lab (CSE3, CSE4)', 'teacher' => 'Dr. Shilpa', 'room' => '402+L407'],
            ['day' => 5, 'period' => 8, 'start' => '15:00:00', 'end' => '17:00:00', 'subject' => 'MSC Lab (CSM1003 DBMS)', 'teacher' => 'Dr. Pravneet Kaur', 'room' => 'L22'],
        ];

        foreach ($g2Schedule as $slot) {
            $this->seedSlot($g2->id, $slot);
        }

        $this->command->info("Seeded B.Tech CSE 5th Semester Timetable (G1: " . count($g1Schedule) . " slots, G2: " . count($g2Schedule) . " slots).");
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
