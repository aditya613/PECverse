<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\CourseClass;
use App\Models\Timetable;
use Illuminate\Database\Seeder;

class PecVlsi3rdSemSeeder extends Seeder
{
    /**
     * Seed the B.Tech Electronics Engineering (VLSI Design and Technology) 3rd Semester timetable.
     * 
     * Teachers:
     * - VLN 301: Dr. Neelam
     * - VLN 302: Dr. Sukhwinder
     * - VLN 303: Dr. Bipin
     * - VLN 304: Dr. Deepak
     * - HSM: Humanities Dept
     */
    public function run(): void
    {
        // 1. Ensure VLSI Branch exists
        $vlsiBranch = Branch::updateOrCreate(
            ['code' => 'VLSI'],
            ['name' => 'Electronics Engineering (VLSI Design and Technology)']
        );

        // 2. Create VLSI 2nd Year (3rd Sem) Class
        $vlsiClass = CourseClass::updateOrCreate(
            ['branch_id' => $vlsiBranch->id, 'year' => 2, 'group_name' => 'VLSI 2nd Year (3rd Sem)'],
            ['cr_user_id' => null]
        );

        // Clear existing slots to prevent duplicates
        Timetable::where('class_id', $vlsiClass->id)->delete();

        // ==========================================
        // 3. SEED TIMETABLE (100% accurate to official schedule)
        // ==========================================
        $schedule = [
            // MONDAY (Day 1)
            // 11:00 - 13:00 (Period 4-5): Parallel Labs (G1 in Lab 2, G2 in Lab 6)
            [
                'day' => 1,
                'period' => 4,
                'start' => '11:00:00',
                'end' => '13:00:00',
                'subject' => 'VLN 301 Lab (G1)',
                'teacher' => 'Dr. Neelam',
                'room' => 'Lab 2',
            ],
            [
                'day' => 1,
                'period' => 4,
                'start' => '11:00:00',
                'end' => '13:00:00',
                'subject' => 'VLN 304 Lab (G2)',
                'teacher' => 'Dr. Deepak',
                'room' => 'Lab 6',
            ],
            // 14:00 - 15:00 (Period 7): VLN 304 Lecture
            [
                'day' => 1,
                'period' => 7,
                'start' => '14:00:00',
                'end' => '15:00:00',
                'subject' => 'VLN 304',
                'teacher' => 'Dr. Deepak',
                'room' => 'L20',
            ],
            // 15:00 - 16:00 (Period 8): VLN 301 Lecture
            [
                'day' => 1,
                'period' => 8,
                'start' => '15:00:00',
                'end' => '16:00:00',
                'subject' => 'VLN 301',
                'teacher' => 'Dr. Neelam',
                'room' => 'L20',
            ],

            // TUESDAY (Day 2)
            // 09:00 - 11:00 (Period 2-3): Parallel Labs (G2 in Lab 2, G1 in Lab 1)
            [
                'day' => 2,
                'period' => 2,
                'start' => '09:00:00',
                'end' => '11:00:00',
                'subject' => 'VLN 301 Lab (G2)',
                'teacher' => 'Dr. Neelam',
                'room' => 'Lab 2',
            ],
            [
                'day' => 2,
                'period' => 2,
                'start' => '09:00:00',
                'end' => '11:00:00',
                'subject' => 'VLN 302 Lab (G1)',
                'teacher' => 'Dr. Sukhwinder',
                'room' => 'Lab 1',
            ],
            // 12:00 - 13:00 (Period 5): VLN 302 Lecture
            [
                'day' => 2,
                'period' => 5,
                'start' => '12:00:00',
                'end' => '13:00:00',
                'subject' => 'VLN 302',
                'teacher' => 'Dr. Sukhwinder',
                'room' => 'L23',
            ],
            // 15:00 - 16:00 (Period 8): VLN 303 Lecture
            [
                'day' => 2,
                'period' => 8,
                'start' => '15:00:00',
                'end' => '16:00:00',
                'subject' => 'VLN 303',
                'teacher' => 'Dr. Bipin',
                'room' => 'L20',
            ],

            // WEDNESDAY (Day 3)
            // 09:00 - 10:00 (Period 2): VLN 303 Lecture
            [
                'day' => 3,
                'period' => 2,
                'start' => '09:00:00',
                'end' => '10:00:00',
                'subject' => 'VLN 303',
                'teacher' => 'Dr. Bipin',
                'room' => 'L20',
            ],
            // 10:00 - 11:00 (Period 3): VLN 301 Lecture
            [
                'day' => 3,
                'period' => 3,
                'start' => '10:00:00',
                'end' => '11:00:00',
                'subject' => 'VLN 301',
                'teacher' => 'Dr. Neelam',
                'room' => 'L20',
            ],
            // 11:00 - 12:00 (Period 4): VLN 303 Tutorial G1
            [
                'day' => 3,
                'period' => 4,
                'start' => '11:00:00',
                'end' => '12:00:00',
                'subject' => 'VLN 303 (Tut G1)',
                'teacher' => 'Dr. Bipin',
                'room' => 'Lab 6',
            ],
            // 12:00 - 13:00 (Period 5): HSM Lecture
            [
                'day' => 3,
                'period' => 5,
                'start' => '12:00:00',
                'end' => '13:00:00',
                'subject' => 'HSM',
                'teacher' => 'Humanities Dept',
                'room' => 'L26',
            ],
            // 14:00 - 15:00 (Period 7): VLN 304 Lecture
            [
                'day' => 3,
                'period' => 7,
                'start' => '14:00:00',
                'end' => '15:00:00',
                'subject' => 'VLN 304',
                'teacher' => 'Dr. Deepak',
                'room' => 'L20',
            ],
            // 15:00 - 16:00 (Period 8): VLN 303 Tutorial G2
            [
                'day' => 3,
                'period' => 8,
                'start' => '15:00:00',
                'end' => '16:00:00',
                'subject' => 'VLN 303 (Tut G2)',
                'teacher' => 'Dr. Bipin',
                'room' => 'Lab 8',
            ],

            // THURSDAY (Day 4)
            // 09:00 - 10:00 (Period 2): VLN 304 Lecture
            [
                'day' => 4,
                'period' => 2,
                'start' => '09:00:00',
                'end' => '10:00:00',
                'subject' => 'VLN 304',
                'teacher' => 'Dr. Deepak',
                'room' => 'L25',
            ],
            // 10:00 - 11:00 (Period 3): VLN 301 Lecture
            [
                'day' => 4,
                'period' => 3,
                'start' => '10:00:00',
                'end' => '11:00:00',
                'subject' => 'VLN 301',
                'teacher' => 'Dr. Neelam',
                'room' => 'L20',
            ],
            // 11:00 - 13:00 (Period 4-5): VLN 302 Lab (G2)
            [
                'day' => 4,
                'period' => 4,
                'start' => '11:00:00',
                'end' => '13:00:00',
                'subject' => 'VLN 302 Lab (G2)',
                'teacher' => 'Dr. Sukhwinder',
                'room' => 'Lab 1',
            ],
            // 14:00 - 15:00 (Period 7): VLN 302 Lecture
            [
                'day' => 4,
                'period' => 7,
                'start' => '14:00:00',
                'end' => '15:00:00',
                'subject' => 'VLN 302',
                'teacher' => 'Dr. Sukhwinder',
                'room' => 'L24',
            ],
            // 15:00 - 16:00 (Period 8): VLN 303 Lecture
            [
                'day' => 4,
                'period' => 8,
                'start' => '15:00:00',
                'end' => '16:00:00',
                'subject' => 'VLN 303',
                'teacher' => 'Dr. Bipin',
                'room' => 'L20',
            ],

            // FRIDAY (Day 5)
            // 09:00 - 11:00 (Period 2-3): VLN 304 Lab (G1)
            [
                'day' => 5,
                'period' => 2,
                'start' => '09:00:00',
                'end' => '11:00:00',
                'subject' => 'VLN 304 Lab (G1)',
                'teacher' => 'Dr. Deepak',
                'room' => 'Lab 6',
            ],
            // 11:00 - 13:00 (Period 4-5): HSM (Class + TUT)
            [
                'day' => 5,
                'period' => 4,
                'start' => '11:00:00',
                'end' => '13:00:00',
                'subject' => 'HSM (Class + TUT)',
                'teacher' => 'Humanities Dept',
                'room' => 'L26',
            ],
            // 14:00 - 15:00 (Period 7): VLN 302 Lecture
            [
                'day' => 5,
                'period' => 7,
                'start' => '14:00:00',
                'end' => '15:00:00',
                'subject' => 'VLN 302',
                'teacher' => 'Dr. Sukhwinder',
                'room' => 'L24',
            ],
        ];

        foreach ($schedule as $slot) {
            Timetable::create([
                'class_id'    => $vlsiClass->id,
                'type'        => 'weekly',
                'day_of_week' => $slot['day'],
                'period_no'   => $slot['period'],
                'start_time'  => $slot['start'],
                'end_time'    => $slot['end'],
                'subject'     => $slot['subject'],
                'teacher'     => $slot['teacher'],
                'room'        => $slot['room'],
                'date'        => null,
                'reason'      => null,
            ]);
        }
    }
}
