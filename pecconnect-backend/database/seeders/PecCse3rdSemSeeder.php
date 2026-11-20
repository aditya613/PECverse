<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\CourseClass;
use App\Models\Timetable;
use Illuminate\Database\Seeder;

class PecCse3rdSemSeeder extends Seeder
{
    /**
     * Run database seeds for B.Tech CSE 3rd Semester Timetable (Session 26271, w.e.f. 9/10/2026).
     */
    public function run(): void
    {
        // 1. Ensure CSE Branch exists
        $cse = Branch::updateOrCreate(
            ['code' => 'CSE'],
            ['name' => 'Computer Science and Engineering']
        );

        // 2. Create G1 and G2 Classes for Year 2 (3rd Sem)
        // G1: CSE1 (1-21), CSE2 (22-43), CSE3 (44-64) -> Roll 1-64
        $g1 = CourseClass::updateOrCreate(
            ['branch_id' => $cse->id, 'year' => 2, 'group_name' => 'CSE - G1 (Roll 1-64)'],
            ['cr_user_id' => null]
        );

        // G2: CSE4 (65-86), CSE5 (87-107), CSE6 (108-128) -> Roll 65-128
        $g2 = CourseClass::updateOrCreate(
            ['branch_id' => $cse->id, 'year' => 2, 'group_name' => 'CSE - G2 (Roll 65-128)'],
            ['cr_user_id' => null]
        );

        // Clear existing slots to prevent duplicates
        Timetable::whereIn('class_id', [$g1->id, $g2->id])->delete();

        // ==========================================
        // 3. G1 SCHEDULE (Roll 1 to 64) w.e.f. 09/10/2026
        // ==========================================
        $g1Schedule = [
            // MONDAY (Day 1)
            ['day' => 1, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'HSM-II G1–G4', 'teacher' => 'Humanities Dept', 'room' => 'L405, L406, L407'],
            ['day' => 1, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'CSN3002 DSML (G1)', 'teacher' => 'Amanpreet Singh', 'room' => 'L21'],
            ['day' => 1, 'period' => 7, 'start' => '14:00:00', 'end' => '16:00:00', 'subject' => 'CSN3001 Data Str Lab (CSE1+CSE2) 301+303 / CSN3004 OOP Lab (CSE3) 306', 'teacher' => 'Mayank Gupta / Dr. Satnam Kaur', 'room' => '301+303 / 306'],
            ['day' => 1, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'MSC', 'teacher' => 'MSC Dept', 'room' => 'CSE MSC L29'],

            // TUESDAY (Day 2)
            ['day' => 2, 'period' => 1, 'start' => '08:00:00', 'end' => '10:00:00', 'subject' => 'CSN3004 OOP Lab (CSE1+CSE2) 304+301 / CSN3001 Data Str Lab (CSE3) 303', 'teacher' => 'Dr. Satnam Kaur / Dr. Mayank Gupta', 'room' => '304+301 / 303'],
            ['day' => 2, 'period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'CSN3003 DSCS (G1)', 'teacher' => 'Amandeep Kaur', 'room' => 'L21'],
            ['day' => 2, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'CSN3004 OOP (G1)', 'teacher' => 'Dr. Satnam Kaur', 'room' => 'L21'],
            ['day' => 2, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'CSN3001 DS (G1)', 'teacher' => 'Mayank Gupta', 'room' => 'L21'],
            ['day' => 2, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'HSM-II G1–G4', 'teacher' => 'Humanities Dept', 'room' => 'L405, L406, L407'],
            ['day' => 2, 'period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'CSN3003 Tut (CSE1+CSE2)', 'teacher' => 'Amandeep Kaur', 'room' => '301+303'],
            ['day' => 2, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'Minor Specialization course', 'teacher' => 'MSC Dept', 'room' => 'CSE MSC L21'],

            // WEDNESDAY (Day 3)
            ['day' => 3, 'period' => 2, 'start' => '09:00:00', 'end' => '11:00:00', 'subject' => 'CSN3002 DSML Lab (CSE1, CSE2, CSE3)', 'teacher' => 'Poonam Saini / Amanpreet Singh', 'room' => 'DS Lab'],
            ['day' => 3, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'CSN3002 DSML (G1)', 'teacher' => 'Amanpreet Singh', 'room' => 'L21'],
            ['day' => 3, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'CSN3004 OOP (G1)', 'teacher' => 'Dr. Satnam Kaur', 'room' => 'L21'],
            ['day' => 3, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'HSM-II (T)', 'teacher' => 'Humanities Dept', 'room' => 'L405, L406, L407, T-9, T-11, T-12'],
            ['day' => 3, 'period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'CSN3001 DS (G1)', 'teacher' => 'Mayank Gupta', 'room' => 'L21'],
            ['day' => 3, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'Minor Specialization course', 'teacher' => 'MSC Dept', 'room' => 'CSE MSC L21'],

            // THURSDAY (Day 4)
            ['day' => 4, 'period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'CSN3002 DSML (G1)', 'teacher' => 'Amanpreet Singh', 'room' => 'L21'],
            ['day' => 4, 'period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'CSN3003 DSCS (G1)', 'teacher' => 'Amandeep Kaur', 'room' => 'L21'],
            ['day' => 4, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'CSN3004 OOP (G1)', 'teacher' => 'Dr. Satnam Kaur', 'room' => 'L21'],
            ['day' => 4, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'CSN3001 DS (G1)', 'teacher' => 'Mayank Gupta', 'room' => 'L21'],
            ['day' => 4, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'CSN3003 Tut (CSE3)', 'teacher' => 'Amandeep Kaur', 'room' => '407'],
            ['day' => 4, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'HSM-II (T)', 'teacher' => 'Humanities Dept', 'room' => 'L405, L406, L407, T-9, T-11, T-12'],

            // FRIDAY (Day 5)
            ['day' => 5, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'CSN3003 DSCS (G1)', 'teacher' => 'Amandeep Kaur', 'room' => 'L22'],
            ['day' => 5, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'HSM-II (T)', 'teacher' => 'Humanities Dept', 'room' => 'L405, L406, L407, T-9, T-11, T-12'],
            ['day' => 5, 'period' => 8, 'start' => '15:00:00', 'end' => '17:00:00', 'subject' => 'Minor Spec. course Tute/Practical', 'teacher' => 'MSC Dept', 'room' => 'CSE MSC DS Lab'],
        ];

        foreach ($g1Schedule as $slot) {
            $this->seedSlot($g1->id, $slot);
        }

        // ==========================================
        // 4. G2 SCHEDULE (Roll 65 to 128) w.e.f. 09/10/2026
        // ==========================================
        $g2Schedule = [
            // MONDAY (Day 1)
            ['day' => 1, 'period' => 2, 'start' => '09:00:00', 'end' => '11:00:00', 'subject' => 'CSN3001 Data Str Lab (CSE4+CSE5+CSE6)', 'teacher' => 'Mayank Gupta', 'room' => '305+304'],
            ['day' => 1, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'MHN205 (L) CSE G2', 'teacher' => 'Dr. Kanu Goel', 'room' => 'L21'],
            ['day' => 1, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'CSN3001 Data Str (G2)', 'teacher' => 'Mayank Gupta', 'room' => 'L22'],
            ['day' => 1, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'CSN3004 OOP (G2)', 'teacher' => 'Dr. Amita', 'room' => 'L22'],
            ['day' => 1, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'MSC', 'teacher' => 'MSC Dept', 'room' => 'CSE MSC L29'],

            // TUESDAY (Day 2)
            ['day' => 2, 'period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'CSN3004 OOP (G2)', 'teacher' => 'Dr. Amita', 'room' => 'L22'],
            ['day' => 2, 'period' => 3, 'start' => '10:00:00', 'end' => '12:00:00', 'subject' => 'CSN3002 DSML Lab (CSE5, CSE6) 303+304 / CSN3004 OOP Lab (CSE4) CL5', 'teacher' => 'Poonam Saini, Amanpreet Singh / Dr. Amita', 'room' => '303+304 / CL5'],
            ['day' => 2, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'CSN3002 DSML (G2)', 'teacher' => 'Amanpreet Singh', 'room' => 'L22'],
            ['day' => 2, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'MHN205 (L) CSE G2', 'teacher' => 'Dr. Kanu Goel', 'room' => '#407'],
            ['day' => 2, 'period' => 8, 'start' => '15:00:00', 'end' => '17:00:00', 'subject' => 'CSN3004 OOP Lab (CSE5+CSE6)', 'teacher' => 'Dr. Amita', 'room' => 'CL13+CL14'],
            ['day' => 2, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'Minor Specialization course', 'teacher' => 'MSC Dept', 'room' => 'CSE MSC L21'],

            // WEDNESDAY (Day 3)
            ['day' => 3, 'period' => 2, 'start' => '09:00:00', 'end' => '11:00:00', 'subject' => 'CSN3002 DSML Lab (CSE4)', 'teacher' => 'Poonam Saini / Amanpreet Singh', 'room' => 'DS Lab'],
            ['day' => 3, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'CSN3003 DSCS (G2)', 'teacher' => 'Amandeep Kaur', 'room' => 'L22'],
            ['day' => 3, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'CSN3001 DS (G2)', 'teacher' => 'Mayank Gupta', 'room' => 'L22'],
            ['day' => 3, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'MHN205 Tut1 CSE G2 (g1)', 'teacher' => 'Dr. Kanu Goel', 'room' => '305'],
            ['day' => 3, 'period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'CSN3002 DSML (G2)', 'teacher' => 'Amanpreet Singh', 'room' => 'L22'],
            ['day' => 3, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'Minor Specialization course', 'teacher' => 'MSC Dept', 'room' => 'CSE MSC L21'],

            // THURSDAY (Day 4)
            ['day' => 4, 'period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'CSN3003 DSCS (G2)', 'teacher' => 'Amandeep Kaur', 'room' => 'L22'],
            ['day' => 4, 'period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'CSN3002 DSML (G2)', 'teacher' => 'Amanpreet Singh', 'room' => 'L22'],
            ['day' => 4, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'CSN3004 OOP (G2)', 'teacher' => 'Dr. Amita', 'room' => 'L22'],
            ['day' => 4, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'CSN3003 Tut (CSE4)', 'teacher' => 'Amandeep Kaur', 'room' => '407'],
            ['day' => 4, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'HSM-II (T)', 'teacher' => 'Humanities Dept', 'room' => 'L405, L406, L407, T-9, T-11, T-12'],

            // FRIDAY (Day 5)
            ['day' => 5, 'period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'CSN3003 DSCS CSE5+CSE6 Tut', 'teacher' => 'Amandeep Kaur', 'room' => 'L21+L22'],
            ['day' => 5, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'CSN3003 DSCS (G2)', 'teacher' => 'Amandeep Kaur', 'room' => 'L21'],
            ['day' => 5, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'CSN3001 DS (G2)', 'teacher' => 'Mayank Gupta', 'room' => 'L21'],
            ['day' => 5, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'MHN205 Tut2 CSE G2 (g2+g3)', 'teacher' => 'Dr. Kanu Goel', 'room' => '407'],
            ['day' => 5, 'period' => 8, 'start' => '15:00:00', 'end' => '17:00:00', 'subject' => 'Minor Spec. course Tute/Practical', 'teacher' => 'MSC Dept', 'room' => 'CSE MSC DS Lab'],
        ];

        foreach ($g2Schedule as $slot) {
            $this->seedSlot($g2->id, $slot);
        }

        $this->command->info("Seeded B.Tech CSE 3rd Semester Timetable (G1: " . count($g1Schedule) . " slots, G2: " . count($g2Schedule) . " slots).");
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
