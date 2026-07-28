<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\CourseClass;
use App\Models\Timetable;
use Illuminate\Database\Seeder;

class PecEce3rdSemSeeder extends Seeder
{
    /**
     * Seed the B.Tech ECE (Electronics & Communication Engineering) 3rd Semester timetable.
     */
    public function run(): void
    {
        // 1. Ensure ECE Branch exists
        $ece = Branch::updateOrCreate(
            ['code' => 'ECE'],
            ['name' => 'Electronics and Communication Engineering']
        );

        // 2. Create ECE Class Group
        $eceGroup = CourseClass::updateOrCreate(
            ['branch_id' => $ece->id, 'year' => 2, 'group_name' => 'ECE - G1 (Roll 1-64)'],
            ['cr_user_id' => null]
        );

        // ==========================================
        // 3. SEED ECE TIMETABLE
        // ==========================================
        $eceSchedule = [
            // ==================== MONDAY ====================
            [
                'day' => 1, 'period' => 2, 'start' => '09:00:00', 'end' => '11:00:00',
                'subject' => 'DSN3001 DS Lab (DS3: Roll 31-45)',
                'teacher' => 'Sudesh Rani', 'room' => 'Lab 306'
            ],
            [
                'day' => 1, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00',
                'subject' => 'HSM-II (Lecture - All DS)',
                'teacher' => 'Humanities Dept', 'room' => 'L405, L406, L407'
            ],
            [
                'day' => 1, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00',
                'subject' => 'DSN3003 OS (Lecture - All DS)',
                'teacher' => 'Ramteke Mamta', 'room' => 'L405'
            ],
            [
                'day' => 1, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00',
                'subject' => 'DSN3002 PDS (Lecture - All DS)',
                'teacher' => 'Kanu Goel', 'room' => 'L405'
            ],
            [
                'day' => 1, 'period' => 8, 'start' => '15:00:00', 'end' => '16:00:00',
                'subject' => 'DSN3001 DS (Lecture - All DS)',
                'teacher' => 'Sudesh Rani', 'room' => 'L405'
            ],
            [
                'day' => 1, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00',
                'subject' => 'Minor Specialization Course',
                'teacher' => 'MSC Dept', 'room' => 'L405'
            ],

            // ==================== TUESDAY ====================
            [
                'day' => 2, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00',
                'subject' => 'DSN3001 DS (Lecture - All DS)',
                'teacher' => 'Sudesh Rani', 'room' => 'L405'
            ],
            [
                'day' => 2, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00',
                'subject' => 'DSN3004 CN (Lecture - All DS)',
                'teacher' => 'Trilok Chand', 'room' => 'L405'
            ],
            [
                'day' => 2, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00',
                'subject' => 'DSN3002 PDS (Lecture - All DS)',
                'teacher' => 'Kanu Goel', 'room' => 'L405'
            ],
            [
                'day' => 2, 'period' => 8, 'start' => '15:00:00', 'end' => '16:00:00',
                'subject' => 'HSM-II (Lecture - All DS)',
                'teacher' => 'Humanities Dept', 'room' => 'L405'
            ],
            [
                'day' => 2, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00',
                'subject' => 'Minor Specialization Course',
                'teacher' => 'MSC Dept', 'room' => 'L405'
            ],
            [
                'day' => 2, 'period' => 10, 'start' => '17:00:00', 'end' => '19:00:00',
                'subject' => 'DSN3003 OS Lab (DS3, DS4: Roll 31-64)',
                'teacher' => 'Ramteke Mamta', 'room' => 'Lab 306'
            ],

            // ==================== WEDNESDAY ====================
            // Simultaneous Lab Slots (09:00 - 11:00)
            [
                'day' => 3, 'period' => 2, 'start' => '09:00:00', 'end' => '11:00:00',
                'subject' => 'DSN3002 PDS Lab (DS3, DS4: Roll 31-64)',
                'teacher' => 'Kanu Goel', 'room' => 'Labs 304, 306'
            ],
            [
                'day' => 3, 'period' => 2, 'start' => '09:00:00', 'end' => '11:00:00',
                'subject' => 'DSN3001 DS Lab (DS1, DS2: Roll 1-30)',
                'teacher' => 'Sudesh Rani', 'room' => 'Labs 301, 303'
            ],
            [
                'day' => 3, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00',
                'subject' => 'DSN3001 DS (Lecture - All DS)',
                'teacher' => 'Sudesh Rani', 'room' => 'L405'
            ],
            [
                'day' => 3, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00',
                'subject' => 'DSN3003 OS (Lecture - All DS)',
                'teacher' => 'Ramteke Mamta', 'room' => 'L405'
            ],
            [
                'day' => 3, 'period' => 7, 'start' => '14:00:00', 'end' => '16:00:00',
                'subject' => 'DSN3004 CN Lab (DS1, DS2: Roll 1-30)',
                'teacher' => 'Trilok Chand', 'room' => 'CL13, CL14'
            ],
            [
                'day' => 3, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00',
                'subject' => 'Minor Specialization Course',
                'teacher' => 'MSC Dept', 'room' => 'L405'
            ],

            // ==================== THURSDAY ====================
            [
                'day' => 4, 'period' => 2, 'start' => '09:00:00', 'end' => '11:00:00',
                'subject' => 'DSN3001 DS Lab (DS4: Roll 46-64)',
                'teacher' => 'Sudesh Rani', 'room' => 'Lab 306'
            ],
            [
                'day' => 4, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00',
                'subject' => 'DSN3004 CN (Lecture - All DS)',
                'teacher' => 'Trilok Chand', 'room' => 'L405'
            ],
            [
                'day' => 4, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00',
                'subject' => 'DSN3002 PDS (Lecture - All DS)',
                'teacher' => 'Kanu Goel', 'room' => 'L22'
            ],
            [
                'day' => 4, 'period' => 8, 'start' => '15:00:00', 'end' => '16:00:00',
                'subject' => 'HSM-II Tutorial (All DS)',
                'teacher' => 'Humanities Dept', 'room' => 'L405'
            ],
            [
                'day' => 4, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00',
                'subject' => 'HSM-II Tutorial (All DS)',
                'teacher' => 'Humanities Dept', 'room' => 'L405, L406, L407, T9, T11, T12'
            ],
            [
                'day' => 4, 'period' => 10, 'start' => '17:00:00', 'end' => '19:00:00',
                'subject' => 'DSN3003 OS Lab (DS1, DS2: Roll 1-30)',
                'teacher' => 'Ramteke Mamta', 'room' => 'Lab 306'
            ],

            // ==================== FRIDAY ====================
            // Simultaneous Lab Slots (09:00 - 11:00)
            [
                'day' => 5, 'period' => 2, 'start' => '09:00:00', 'end' => '11:00:00',
                'subject' => 'DSN3002 PDS Lab (DS1, DS2: Roll 1-30)',
                'teacher' => 'Kanu Goel', 'room' => 'Lab 306'
            ],
            [
                'day' => 5, 'period' => 2, 'start' => '09:00:00', 'end' => '11:00:00',
                'subject' => 'DSN3004 CN Lab (DS3, DS4: Roll 31-64)',
                'teacher' => 'Trilok Chand', 'room' => 'CL13, CL14'
            ],
            [
                'day' => 5, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00',
                'subject' => 'DSN3004 CN (Lecture - All DS)',
                'teacher' => 'Trilok Chand', 'room' => 'L405'
            ],
            [
                'day' => 5, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00',
                'subject' => 'DSN3003 OS (Lecture - All DS)',
                'teacher' => 'Ramteke Mamta', 'room' => 'L19'
            ],
            [
                'day' => 5, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00',
                'subject' => 'HSM-II Tutorial (All DS)',
                'teacher' => 'Humanities Dept', 'room' => 'L405, L406, L407, T9, T11, T12'
            ],
            [
                'day' => 5, 'period' => 8, 'start' => '15:00:00', 'end' => '17:00:00',
                'subject' => 'Minor Spec. Course Tute/Practical',
                'teacher' => 'MSC Dept', 'room' => 'L405'
            ],
        ];

        foreach ($eceSchedule as $slot) {
            $this->seedSlot($eceGroup->id, $slot);
        }
    }

    /**
     * Helper to idempotently seed a timetable slot.
     */
    private function seedSlot(int $classId, array $slot): void
    {
        Timetable::updateOrCreate(
            [
                'class_id'    => $classId,
                'type'        => 'weekly',
                'day_of_week' => $slot['day'],
                'start_time'  => $slot['start'],
                'subject'     => $slot['subject'], // Included in unique key for simultaneous batch lab slots
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
