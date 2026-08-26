<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\CourseClass;
use App\Models\Timetable;
use Illuminate\Database\Seeder;

class PecCse1stYearSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Ensure CSE Branch exists
        $cse = Branch::updateOrCreate(
            ['code' => 'CSE'],
            ['name' => 'Computer Science and Engineering']
        );

        // 2. Create G1 and G2 Classes for 1st Year (Group sizes encompass F1/F2/F3 subgroups)
        $g1 = CourseClass::updateOrCreate(
            ['branch_id' => $cse->id, 'year' => 1, 'group_name' => 'CSE - G1 (Includes F1 & F2 Labs)'],
            ['cr_user_id' => null]
        );

        $g2 = CourseClass::updateOrCreate(
            ['branch_id' => $cse->id, 'year' => 1, 'group_name' => 'CSE - G2 (Includes F2 & F3 Labs)'],
            ['cr_user_id' => null]
        );

        // Clear existing slots for these groups to prevent duplicates
        Timetable::whereIn('class_id', [$g1->id, $g2->id])->delete();

        // ==========================================
        // 3. SEED G1 TIMETABLE
        // ==========================================
        $g1Schedule = [
            // MONDAY
            ['day' => 1, 'period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'ES2305 G1', 'teacher' => 'TBD', 'room' => 'L-27'],
            ['day' => 1, 'period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'MA2301 G1', 'teacher' => 'TBD', 'room' => 'L-27'],
            ['day' => 1, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'PY2301 G1', 'teacher' => 'TBD', 'room' => 'L-27'],
            ['day' => 1, 'period' => 6, 'start' => '13:00:00', 'end' => '15:00:00', 'subject' => 'HS2351 LAB G1', 'teacher' => 'TBD', 'room' => 'TBD'],
            ['day' => 1, 'period' => 8, 'start' => '15:00:00', 'end' => '17:00:00', 'subject' => 'MA2301 LAB G1', 'teacher' => 'TBD', 'room' => 'TBD'],

            // TUESDAY
            ['day' => 2, 'period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'PY2301 G1', 'teacher' => 'TBD', 'room' => 'L-10'],
            ['day' => 2, 'period' => 3, 'start' => '10:00:00', 'end' => '12:00:00', 'subject' => 'ES2305 LAB F1', 'teacher' => 'TBD', 'room' => 'TBD'],
            ['day' => 2, 'period' => 6, 'start' => '13:00:00', 'end' => '15:00:00', 'subject' => 'ES2301 LAB F2', 'teacher' => 'TBD', 'room' => 'TBD'],
            ['day' => 2, 'period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'ES2301 G1', 'teacher' => 'TBD', 'room' => 'L-28'],

            // WEDNESDAY
            ['day' => 3, 'period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'OR2302 G1', 'teacher' => 'TBD', 'room' => 'TBD'],
            ['day' => 3, 'period' => 3, 'start' => '10:00:00', 'end' => '12:00:00', 'subject' => 'PY2301 LAB F1', 'teacher' => 'TBD', 'room' => 'TBD'],
            ['day' => 3, 'period' => 6, 'start' => '13:00:00', 'end' => '14:00:00', 'subject' => 'MA2301 G1', 'teacher' => 'TBD', 'room' => 'L-28'],
            ['day' => 3, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'GS2301 G1', 'teacher' => 'TBD', 'room' => 'L-28'],
            ['day' => 3, 'period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'ES2305 G1', 'teacher' => 'TBD', 'room' => 'L-28'],
            ['day' => 3, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'HS2351 G1', 'teacher' => 'TBD', 'room' => 'L-28'],

            // THURSDAY
            ['day' => 4, 'period' => 2, 'start' => '09:00:00', 'end' => '11:00:00', 'subject' => 'PY2301 LAB F2', 'teacher' => 'TBD', 'room' => 'TBD'],
            ['day' => 4, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'PY2301 G1', 'teacher' => 'TBD', 'room' => 'L-30'],
            ['day' => 4, 'period' => 6, 'start' => '13:00:00', 'end' => '15:00:00', 'subject' => 'ES2301 LAB F1', 'teacher' => 'TBD', 'room' => 'TBD'],
            ['day' => 4, 'period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'ES2305 G1', 'teacher' => 'TBD', 'room' => 'L-30'],
            ['day' => 4, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'ES2301 G1', 'teacher' => 'TBD', 'room' => 'L-30/31'],

            // FRIDAY
            ['day' => 5, 'period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'ES2301 G1', 'teacher' => 'TBD', 'room' => 'L-26'],
            ['day' => 5, 'period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'MA2301 G1', 'teacher' => 'TBD', 'room' => 'L-26'],
            ['day' => 5, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'HS2351 G1', 'teacher' => 'TBD', 'room' => 'L-11'],
            ['day' => 5, 'period' => 8, 'start' => '15:00:00', 'end' => '17:00:00', 'subject' => 'ES2305 LAB F2', 'teacher' => 'TBD', 'room' => 'TBD'],
        ];

        foreach ($g1Schedule as $slot) {
            $this->seedSlot($g1->id, $slot);
        }

        // ==========================================
        // 4. SEED G2 TIMETABLE
        // ==========================================
        $g2Schedule = [
            // MONDAY
            ['day' => 1, 'period' => 2, 'start' => '09:00:00', 'end' => '11:00:00', 'subject' => 'PY2301 LAB F3', 'teacher' => 'TBD', 'room' => 'TBD'],
            ['day' => 1, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'PY2301 G2', 'teacher' => 'TBD', 'room' => 'L-31'],
            ['day' => 1, 'period' => 6, 'start' => '13:00:00', 'end' => '15:00:00', 'subject' => 'ES2301 LAB F3', 'teacher' => 'TBD', 'room' => 'TBD'],
            ['day' => 1, 'period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'ES2305 G2', 'teacher' => 'TBD', 'room' => 'L-29'],
            ['day' => 1, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'MA2301 G2', 'teacher' => 'TBD', 'room' => 'L-29'],

            // TUESDAY
            ['day' => 2, 'period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'PY2301 G2', 'teacher' => 'TBD', 'room' => 'L-11'],
            ['day' => 2, 'period' => 3, 'start' => '10:00:00', 'end' => '12:00:00', 'subject' => 'HS2351 LAB G2', 'teacher' => 'TBD', 'room' => 'TBD'],
            ['day' => 2, 'period' => 6, 'start' => '13:00:00', 'end' => '15:00:00', 'subject' => 'ES2301 LAB F2', 'teacher' => 'TBD', 'room' => 'TBD'],
            ['day' => 2, 'period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'ES2301 G2', 'teacher' => 'TBD', 'room' => 'L-31'],
            ['day' => 2, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'OR2302 G2', 'teacher' => 'TBD', 'room' => 'TBD'],

            // WEDNESDAY
            ['day' => 3, 'period' => 3, 'start' => '10:00:00', 'end' => '12:00:00', 'subject' => 'MA2301 LAB G2', 'teacher' => 'TBD', 'room' => 'TBD'],
            ['day' => 3, 'period' => 6, 'start' => '13:00:00', 'end' => '14:00:00', 'subject' => 'MA2301 G2', 'teacher' => 'TBD', 'room' => 'L-29'],
            ['day' => 3, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'GS2301 G2', 'teacher' => 'TBD', 'room' => 'L-29'],
            ['day' => 3, 'period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'ES2305 G2', 'teacher' => 'TBD', 'room' => 'L-29'],
            ['day' => 3, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'HS2351 G2', 'teacher' => 'TBD', 'room' => 'L-29'],

            // THURSDAY
            ['day' => 4, 'period' => 2, 'start' => '09:00:00', 'end' => '11:00:00', 'subject' => 'PY2301 LAB F2', 'teacher' => 'TBD', 'room' => 'TBD'],
            ['day' => 4, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'PY2301 G2', 'teacher' => 'TBD', 'room' => 'L-31'],
            ['day' => 4, 'period' => 6, 'start' => '13:00:00', 'end' => '15:00:00', 'subject' => 'ES2305 LAB F3', 'teacher' => 'TBD', 'room' => 'TBD'],
            ['day' => 4, 'period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'ES2305 G2', 'teacher' => 'TBD', 'room' => 'L-31'],
            ['day' => 4, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'ES2301 G2*', 'teacher' => 'TBD', 'room' => 'L-31'],

            // FRIDAY
            ['day' => 5, 'period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'ES2301 G2', 'teacher' => 'TBD', 'room' => 'L-11'],
            ['day' => 5, 'period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'MA2301 G2', 'teacher' => 'TBD', 'room' => 'L-11'],
            ['day' => 5, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'HS2351 G2', 'teacher' => 'TBD', 'room' => 'L-15'],
            ['day' => 5, 'period' => 8, 'start' => '15:00:00', 'end' => '17:00:00', 'subject' => 'ES2305 LAB F2', 'teacher' => 'TBD', 'room' => 'TBD'],
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
