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
            ['code' => 'CSE'],
            ['name' => 'Computer Science and Engineering']
        );

        // 2. Create G1 and G2 Classes
        $g1 = CourseClass::updateOrCreate(
            ['branch_id' => $cse->id, 'year' => 2, 'group_name' => 'CSE - G1 (Roll 1-64)'],
            ['cr_user_id' => null]
        );

        $g2 = CourseClass::updateOrCreate(
            ['branch_id' => $cse->id, 'year' => 2, 'group_name' => 'CSE - G2 (Roll 65-128)'],
            ['cr_user_id' => null]
        );

        // Clear existing slots for these groups to prevent duplicates
        Timetable::whereIn('class_id', [$g1->id, $g2->id])->delete();

        // ==========================================
        // 3. SEED G1 TIMETABLE (Roll 1 to 64)
        // Groups: CSE1(1-21), CSE2(22-43), CSE3(44-64)
        // ==========================================
        $g1Schedule = [
            // MONDAY
            ['day' => 1, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'HSM-II G1-G4', 'teacher' => 'Humanities Dept', 'room' => 'L405, L406, L407'],
            ['day' => 1, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'CSN3002 DSML (G1)', 'teacher' => 'Poonam Saini', 'room' => 'L21'],
            ['day' => 1, 'period' => 7, 'start' => '14:00:00', 'end' => '16:00:00', 'subject' => 'CSN3001 Data Str Lab (CSE1, CSE2: Roll 1-43)', 'teacher' => 'Mayank Gupta', 'room' => '301, 303'],
            ['day' => 1, 'period' => 7, 'start' => '14:00:00', 'end' => '16:00:00', 'subject' => 'CSN3004 OOP Lab (CSE3: Roll 44-64)', 'teacher' => 'Dr. Satnam Kaur', 'room' => '306'],
            ['day' => 1, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'Minor Specialization course', 'teacher' => 'MSC Dept', 'room' => 'L29'],
            
            // TUESDAY
            ['day' => 2, 'period' => 1, 'start' => '08:00:00', 'end' => '10:00:00', 'subject' => 'CSN3004 OOP Lab (CSE1, CSE2: Roll 1-43)', 'teacher' => 'Dr. Satnam Kaur', 'room' => '304, 301'],
            ['day' => 2, 'period' => 1, 'start' => '08:00:00', 'end' => '10:00:00', 'subject' => 'CSN3001 Data Str Lab (CSE3: Roll 44-64)', 'teacher' => 'Mayank Gupta', 'room' => '306'],
            ['day' => 2, 'period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'CSN3003 DSCS (G1)', 'teacher' => 'Amandeep Kaur', 'room' => 'L21'],
            ['day' => 2, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'CSN3004 OOP (G1)', 'teacher' => 'Dr. Satnam Kaur', 'room' => 'L21'],
            ['day' => 2, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'CSN3001 DS (G1)', 'teacher' => 'Mayank Gupta', 'room' => 'L21'],
            ['day' => 2, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'HSM-II G1-G4', 'teacher' => 'Humanities Dept', 'room' => 'L405, L406, L407, T9'],
            ['day' => 2, 'period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'CSN3003 Tut (CSE1, CSE2: Roll 1-43)', 'teacher' => 'Amandeep Kaur', 'room' => '301, 303'],
            ['day' => 2, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'Minor Specialization course', 'teacher' => 'MSC Dept', 'room' => 'L21'],

            // WEDNESDAY
            ['day' => 3, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'CSN3002 DSML (G1)', 'teacher' => 'Poonam Saini', 'room' => 'L21'],
            ['day' => 3, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'CSN3004 OOP (G1)', 'teacher' => 'Dr. Satnam Kaur', 'room' => 'L21'],
            ['day' => 3, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'HSM-II (T)', 'teacher' => 'Humanities Dept', 'room' => 'L405, L406, L407, T-9, T-11, T-12'],
            ['day' => 3, 'period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'CSN3001 DS (G1)', 'teacher' => 'Mayank Gupta', 'room' => 'L21'],
            ['day' => 3, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'Minor Specialization course', 'teacher' => 'MSC Dept', 'room' => 'L21'],
            ['day' => 3, 'period' => 10, 'start' => '17:00:00', 'end' => '19:00:00', 'subject' => 'CSN3002 DSML Lab (CSE1, CSE2, CSE3: Roll 1-64)', 'teacher' => 'Poonam Saini', 'room' => '301, 303, 306'],

            // THURSDAY
            ['day' => 4, 'period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'CSN3002 DSML (G1)', 'teacher' => 'Poonam Saini', 'room' => 'L21'],
            ['day' => 4, 'period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'CSN3003 DSCS (G1)', 'teacher' => 'Amandeep Kaur', 'room' => 'L21'],
            ['day' => 4, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'CSN3004 OOP (G1)', 'teacher' => 'Dr. Satnam Kaur', 'room' => 'L21'],
            ['day' => 4, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'CSN3001 DS (G1)', 'teacher' => 'Mayank Gupta', 'room' => 'L21'],
            ['day' => 4, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'HSM-II (T)', 'teacher' => 'Humanities Dept', 'room' => 'L405, L406, L407, T-9, T-11, T-12'],

            // FRIDAY
            ['day' => 5, 'period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'CSN3003 Tut (CSE3: Roll 44-64)', 'teacher' => 'Amandeep Kaur', 'room' => 'L21'],
            ['day' => 5, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'CSN3003 DSCS (G1)', 'teacher' => 'Amandeep Kaur', 'room' => 'L22'],
            ['day' => 5, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'HSM-II (T)', 'teacher' => 'Humanities Dept', 'room' => 'L405, L406, L407, T-9, T-11, T-12'],
            ['day' => 5, 'period' => 8, 'start' => '15:00:00', 'end' => '17:00:00', 'subject' => 'Minor Spec course Tute/Practical', 'teacher' => 'MSC Dept', 'room' => 'DS Lab'],
        ];

        foreach ($g1Schedule as $slot) {
            $this->seedSlot($g1->id, $slot);
        }

        // ==========================================
        // 4. SEED G2 TIMETABLE (Roll 65 to 128)
        // Groups: CSE4(65-85), CSE5(86-106), CSE6(107-128)
        // ==========================================
        $g2Schedule = [
            // MONDAY
            ['day' => 1, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'HSM-II G1-G4', 'teacher' => 'Humanities Dept', 'room' => 'L405, L406, L407'],
            ['day' => 1, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'CSN3001 Data Str (G2)', 'teacher' => 'Mayank Gupta', 'room' => 'L22'],
            ['day' => 1, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'CSN3004 OOP (G2)', 'teacher' => 'Dr. Amita', 'room' => 'L22'],
            ['day' => 1, 'period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'CSN3003 Tut (CSE4, CSE5: Roll 65-106)', 'teacher' => 'Amandeep Kaur', 'room' => '304'],
            ['day' => 1, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'Minor Specialization course', 'teacher' => 'MSC Dept', 'room' => 'L29'],
            ['day' => 1, 'period' => 10, 'start' => '17:00:00', 'end' => '19:00:00', 'subject' => 'CSN3001 Data Str Lab (CSE5, CSE6: Roll 86-128)', 'teacher' => 'Mayank Gupta', 'room' => '306, 402'],

            // TUESDAY
            ['day' => 2, 'period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'CSN3004 OOP (G2)', 'teacher' => 'Dr. Amita', 'room' => 'L22'],
            ['day' => 2, 'period' => 3, 'start' => '10:00:00', 'end' => '12:00:00', 'subject' => 'CSN3002 DSML Lab (CSE5, CSE6: Roll 86-128)', 'teacher' => 'Poonam Saini', 'room' => '303, 304'],
            ['day' => 2, 'period' => 3, 'start' => '10:00:00', 'end' => '12:00:00', 'subject' => 'CSN3001 Data Str Lab (CSE4: Roll 65-85)', 'teacher' => 'Mayank Gupta', 'room' => 'CL5'],
            ['day' => 2, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'CSN3002 DSML (G2)', 'teacher' => 'Poonam Saini', 'room' => 'L22'],
            ['day' => 2, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'HSM-II G1-G4', 'teacher' => 'Humanities Dept', 'room' => 'L405, L406, L407, T9'],
            ['day' => 2, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'Minor Specialization course', 'teacher' => 'MSC Dept', 'room' => 'L21'],

            // WEDNESDAY
            ['day' => 3, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'CSN3003 DSCS (G2)', 'teacher' => 'Amandeep Kaur', 'room' => 'L22'],
            ['day' => 3, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'CSN3001 DS (G2)', 'teacher' => 'Mayank Gupta', 'room' => 'L22'],
            ['day' => 3, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'HSM-II (T)', 'teacher' => 'Humanities Dept', 'room' => 'L405, L406, L407, T-9, T-11, T-12'],
            ['day' => 3, 'period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'CSN3002 DSML (G2)', 'teacher' => 'Poonam Saini', 'room' => 'L22'],
            ['day' => 3, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'Minor Specialization course', 'teacher' => 'MSC Dept', 'room' => 'L21'],
            ['day' => 3, 'period' => 10, 'start' => '17:00:00', 'end' => '19:00:00', 'subject' => 'CSN3004 OOP Lab (CSE4, CSE5, CSE6: Roll 65-128)', 'teacher' => 'Dr. Amita', 'room' => '304, CL13, CL14'],

            // THURSDAY
            ['day' => 4, 'period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'CSN3003 DSCS (G2)', 'teacher' => 'Amandeep Kaur', 'room' => 'L22'],
            ['day' => 4, 'period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'CSN3002 DSML (G2)', 'teacher' => 'Poonam Saini', 'room' => 'L22'],
            ['day' => 4, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'CSN3004 OOP (G2)', 'teacher' => 'Dr. Amita', 'room' => 'L22'],
            ['day' => 4, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'CSN3003 Tut (CSE5: Roll 86-106)', 'teacher' => 'Amandeep Kaur', 'room' => 'CL5'],
            ['day' => 4, 'period' => 7, 'start' => '14:00:00', 'end' => '16:00:00', 'subject' => 'CSN3002 DSML Lab (CSE4: Roll 65-85)', 'teacher' => 'Poonam Saini', 'room' => '303'],
            ['day' => 4, 'period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'CSN3003 Tut (CSE6: Roll 107-128)', 'teacher' => 'Amandeep Kaur', 'room' => 'L21'],
            ['day' => 4, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'HSM-II (T)', 'teacher' => 'Humanities Dept', 'room' => 'L405, L406, L407, T-9, T-11, T-12'],

            // FRIDAY
            ['day' => 5, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'CSN3003 DSCS (G2)', 'teacher' => 'Amandeep Kaur', 'room' => 'L21'],
            ['day' => 5, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'CSN3001 DS (G2)', 'teacher' => 'Mayank Gupta', 'room' => 'L21'],
            ['day' => 5, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'HSM-II (T)', 'teacher' => 'Humanities Dept', 'room' => 'L405, L406, L407, T-9, T-11, T-12'],
            ['day' => 5, 'period' => 8, 'start' => '15:00:00', 'end' => '17:00:00', 'subject' => 'Minor Spec course Tute/Practical', 'teacher' => 'MSC Dept', 'room' => 'DS Lab'],
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
