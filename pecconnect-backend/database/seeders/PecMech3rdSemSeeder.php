<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\CourseClass;
use App\Models\Timetable;
use Illuminate\Database\Seeder;

class PecCse3rdSemSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Ensure CSE Branch exists
        $cse = Branch::updateOrCreate(
            ['code' => 'MECH'],
            ['name' => 'Mechanical Engineering']
        );

        // 2. Create G1 and G2 Classes
        $g1 = CourseClass::updateOrCreate(
            ['branch_id' => $cse->id, 'year' => 2, 'group_name' => 'MECH - G1 (Roll 1-64)'],
            ['cr_user_id' => null]
        );

        $g2 = CourseClass::updateOrCreate(
            ['branch_id' => $cse->id, 'year' => 2, 'group_name' => 'CSE - G2 (Roll 65-128)'],
            ['cr_user_id' => null]
        );

        // ==========================================
        // 3. SEED G1 TIMETABLE (Roll 1 to 64)
        // ==========================================
        $g1Schedule = [
            // MONDAY
            ['day' => 1, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'HSM-II (Lecture - All G1)', 'teacher' => 'Humanities Dept', 'room' => 'L405, L406, L407'],
            ['day' => 1, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'CSN3002 DSML (Lecture - All G1)', 'teacher' => 'Poonam Saini', 'room' => 'L21'],
            ['day' => 1, 'period' => 7, 'start' => '14:00:00', 'end' => '16:00:00', 'subject' => 'CSN3002 DSML Lab (Roll 1-61: CSE1,2,3)', 'teacher' => 'Poonam Saini', 'room' => 'Labs 301, 303, 306'],
            ['day' => 1, 'period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'CSN3003 DSCS Tut (Roll 62-64: CSE4)', 'teacher' => 'Amandeep Kaur', 'room' => 'Room 304, 305'],
            ['day' => 1, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'Minor Specialization Course (Optional)', 'teacher' => 'MSC Dept', 'room' => 'L21'],
            ['day' => 1, 'period' => 10, 'start' => '17:00:00', 'end' => '19:00:00', 'subject' => 'CSN3004 OOP Lab (Roll 1-61: CSE1,2,3)', 'teacher' => 'TF4', 'room' => 'Labs 304, 301, 306'],
            ['day' => 1, 'period' => 10, 'start' => '17:00:00', 'end' => '19:00:00', 'subject' => 'CSN3001 Data Str Lab (Roll 62-64: CSE4)', 'teacher' => 'Mayank Gupta', 'room' => 'Lab 303'],

            // TUESDAY
            ['day' => 2, 'period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'CSN3003 DSCS (Lecture - All G1)', 'teacher' => 'Amandeep Kaur', 'room' => 'L21'],
            ['day' => 2, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'CSN3002 DSML / CSN3001 DS (Lecture)', 'teacher' => 'Poonam Saini / Mayank Gupta', 'room' => 'L22 / L21'],
            ['day' => 2, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'HSM-II (Lecture - All G1)', 'teacher' => 'Humanities Dept', 'room' => 'L405, L406, L407, T9'],
            ['day' => 2, 'period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'CSN3003 DSCS Tut (Roll 1-41: CSE1, CSE2)', 'teacher' => 'Amandeep Kaur', 'room' => 'Room 301, 303'],
            ['day' => 2, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'Minor Specialization Course (Optional)', 'teacher' => 'MSC Dept', 'room' => 'L21'],

            // WEDNESDAY
            ['day' => 3, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'CSN3002 DSML (Lecture - All G1)', 'teacher' => 'Poonam Saini', 'room' => 'L21'],
            ['day' => 3, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'CSN3004 OOP (Lecture - All G1)', 'teacher' => 'TF4', 'room' => 'L21'],
            ['day' => 3, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'HSM-II Tutorial (All G1)', 'teacher' => 'Humanities Dept', 'room' => 'L405, L406, L407, T9, T-11, T-12'],
            ['day' => 3, 'period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'CSN3001 Data Str (Lecture - All G1)', 'teacher' => 'Mayank Gupta', 'room' => 'L21'],
            ['day' => 3, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'Minor Specialization Course (Optional)', 'teacher' => 'MSC Dept', 'room' => 'L21'],
            ['day' => 3, 'period' => 10, 'start' => '17:00:00', 'end' => '19:00:00', 'subject' => 'CSN3001 Data Str Lab (Roll 1-61: CSE1,2,3)', 'teacher' => 'Mayank Gupta', 'room' => 'Labs 301, 303, 306'],
            ['day' => 3, 'period' => 10, 'start' => '17:00:00', 'end' => '19:00:00', 'subject' => 'CSN3004 OOP Lab (Roll 62-64: CSE4)', 'teacher' => 'TF4, TF5', 'room' => 'DS Lab / 304'],

            // THURSDAY
            ['day' => 4, 'period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'CSN3003 DSCS (Lecture - All G1)', 'teacher' => 'Amandeep Kaur', 'room' => 'L21'],
            ['day' => 4, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'CSN3004 OOP (Lecture - All G1)', 'teacher' => 'TF4', 'room' => 'L21'],
            ['day' => 4, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'CSN3002 DSML (Lecture - All G1)', 'teacher' => 'Poonam Saini', 'room' => 'L21'],
            ['day' => 4, 'period' => 7, 'start' => '14:00:00', 'end' => '16:00:00', 'subject' => 'CSN3002 DSML Lab (Roll 42-64: CSE3, CSE4)', 'teacher' => 'Poonam Saini', 'room' => 'Lab 303'],
            ['day' => 4, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'HSM-II Tutorial (All G1)', 'teacher' => 'Humanities Dept', 'room' => 'L405, L406, L407, T-9, T11, T-12'],

            // FRIDAY
            ['day' => 5, 'period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'CSN3003 DSCS Tut (Roll 42-61: CSE3)', 'teacher' => 'Amandeep Kaur', 'room' => 'Tutorial Room'],
            ['day' => 5, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'CSN3004 OOP (Lecture - All G1)', 'teacher' => 'TF4', 'room' => 'L21'],
            ['day' => 5, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'CSN3001 Data Str (Lecture - All G1)', 'teacher' => 'Mayank Gupta', 'room' => 'L21'],
            ['day' => 5, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'HSM-II Tutorial (All G1)', 'teacher' => 'Humanities Dept', 'room' => 'L405, L406, L407, T9, T-11, T-12'],
            ['day' => 5, 'period' => 8, 'start' => '15:00:00', 'end' => '17:00:00', 'subject' => 'Minor Spec. Course Tute / Practical', 'teacher' => 'MSC Dept', 'room' => 'DS Lab'],
        ];

        foreach ($g1Schedule as $slot) {
            $this->seedSlot($g1->id, $slot);
        }

        // ==========================================
        // 4. SEED G2 TIMETABLE (Roll 65 to 128)
        // ==========================================
        $g2Schedule = [
            // MONDAY
            ['day' => 1, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'HSM-II (Lecture - All G2)', 'teacher' => 'Humanities Dept', 'room' => 'L405, L406, L407'],
            ['day' => 1, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'CSN3001 Data Str (Lecture - All G2)', 'teacher' => 'Mayank Gupta', 'room' => 'L22'],
            ['day' => 1, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'CSN3004 OOP (Lecture - All G2)', 'teacher' => 'TF5', 'room' => 'L22'],
            ['day' => 1, 'period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'CSN3003 DSCS Tut (Roll 65-105: CSE4, CSE5)', 'teacher' => 'Amandeep Kaur', 'room' => 'Room 304, 305'],
            ['day' => 1, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'Minor Specialization Course (Optional)', 'teacher' => 'MSC Dept', 'room' => 'L21'],
            ['day' => 1, 'period' => 10, 'start' => '17:00:00', 'end' => '19:00:00', 'subject' => 'CSN3001 Data Str Lab (Roll 65-128: CSE4, CSE5, CSE6)', 'teacher' => 'Mayank Gupta', 'room' => 'Lab 303 + DS Lab'],

            // TUESDAY
            ['day' => 2, 'period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'CSN3004 OOP (Lecture - All G2)', 'teacher' => 'TF5', 'room' => 'L22'],
            ['day' => 2, 'period' => 3, 'start' => '10:00:00', 'end' => '12:00:00', 'subject' => 'CSN3002 DSML Lab (Roll 84-128: CSE5, CSE6)', 'teacher' => 'Poonam Saini', 'room' => 'Labs 303, 304'],
            ['day' => 2, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'CSN3003 DSCS (Lecture - All G2)', 'teacher' => 'Amandeep Kaur', 'room' => 'L21'],
            ['day' => 2, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'HSM-II (Lecture - All G2)', 'teacher' => 'Humanities Dept', 'room' => 'L405, L406, L407, T9'],
            ['day' => 2, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'Minor Specialization Course (Optional)', 'teacher' => 'MSC Dept', 'room' => 'L21'],

            // WEDNESDAY
            ['day' => 3, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'CSN3003 DSCS (Lecture - All G2)', 'teacher' => 'Amandeep Kaur', 'room' => 'L22'],
            ['day' => 3, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'CSN3001 Data Str (Lecture - All G2)', 'teacher' => 'Mayank Gupta', 'room' => 'L22'],
            ['day' => 3, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'HSM-II Tutorial (All G2)', 'teacher' => 'Humanities Dept', 'room' => 'L405, L406, L407, T9, T-11, T-12'],
            ['day' => 3, 'period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'CSN3002 DSML (Lecture - All G2)', 'teacher' => 'Poonam Saini', 'room' => 'L22'],
            ['day' => 3, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'Minor Specialization Course (Optional)', 'teacher' => 'MSC Dept', 'room' => 'L21'],
            ['day' => 3, 'period' => 10, 'start' => '17:00:00', 'end' => '19:00:00', 'subject' => 'CSN3004 OOP Lab (Roll 65-128: CSE4, CSE5, CSE6)', 'teacher' => 'TF4, TF5', 'room' => 'DS Lab & Room 304'],

            // THURSDAY
            ['day' => 4, 'period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'CSN3004 OOP (Lecture - All G2)', 'teacher' => 'TF5', 'room' => 'L22'],
            ['day' => 4, 'period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'CSN3002 DSML (Lecture - All G2)', 'teacher' => 'Poonam Saini', 'room' => 'L22'],
            ['day' => 4, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'CSN3003 DSCS (Lecture - All G2)', 'teacher' => 'Amandeep Kaur', 'room' => 'L22'],
            ['day' => 4, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'CSN3001 Data Str (Lecture - All G2)', 'teacher' => 'Mayank Gupta', 'room' => 'L31'],
            ['day' => 4, 'period' => 7, 'start' => '14:00:00', 'end' => '16:00:00', 'subject' => 'CSN3002 DSML Lab (Roll 65-83: CSE4 in G2)', 'teacher' => 'Poonam Saini', 'room' => 'Lab 303'],
            ['day' => 4, 'period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'CSN3003 DSCS Tut (Roll 106-116: CSE6 Batch A)', 'teacher' => 'Amandeep Kaur', 'room' => 'Tutorial Room'],
            ['day' => 4, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'HSM-II Tutorial (All G2)', 'teacher' => 'Humanities Dept', 'room' => 'L405, L406, L407, T-9, T11, T-12'],

            // FRIDAY
            ['day' => 5, 'period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'CSN3003 DSCS Tut (Roll 117-128: CSE6 Batch B)', 'teacher' => 'Amandeep Kaur', 'room' => 'Tutorial Room'],
            ['day' => 5, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'CSN3003 DSCS (Lecture - All G2)', 'teacher' => 'Amandeep Kaur', 'room' => 'L22'],
            ['day' => 5, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'HSM-II Tutorial (All G2)', 'teacher' => 'Humanities Dept', 'room' => 'L405, L406, L407, T9, T-11, T-12'],
            ['day' => 5, 'period' => 8, 'start' => '15:00:00', 'end' => '17:00:00', 'subject' => 'Minor Spec. Course Tute / Practical', 'teacher' => 'MSC Dept', 'room' => 'DS Lab'],
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
                'subject'     => $slot['subject'], // Included in unique key to allow simultaneous lab slots in different rooms if needed
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
