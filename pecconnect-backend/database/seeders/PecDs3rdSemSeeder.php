<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\CourseClass;
use App\Models\Timetable;
use Illuminate\Database\Seeder;

class PecDs3rdSemSeeder extends Seeder
{
    /**
     * Seed the B.Tech CSE (Data Science) 3rd Semester timetable.
     * Groups division based on SIDs:
     * DS1 -> 1-15
     * DS2 -> 16-30
     * DS3 -> 31-45
     * DS4 -> 46-64
     */
    public function run(): void
    {
        // 1. Ensure Data Science Branch exists
        $ds = Branch::updateOrCreate(
            ['code' => 'DS'],
            ['name' => 'Computer Science and Engineering (Data Science)']
        );

        // 2. Create DS Class (Single Group for the batch: Roll 1-64)
        $dsGroup = CourseClass::updateOrCreate(
            ['branch_id' => $ds->id, 'year' => 2, 'group_name' => 'DS - G1 (Roll 1-64)'],
            ['cr_user_id' => null]
        );

        // Clear existing slots to prevent duplicates
        Timetable::where('class_id', $dsGroup->id)->delete();

        // ==========================================
        // 3. SEED DATA SCIENCE TIMETABLE
        // ==========================================
        $dsSchedule = [
            // ==================== MONDAY ====================
            [
                'day' => 1, 'period' => 2, 'start' => '09:00:00', 'end' => '11:00:00',
                'subject' => 'DSN3003 OS Lab (DS3: Roll 31-45)',
                'teacher' => 'Ramteke Mamta', 'room' => 'Lab 306'
            ],
            [
                'day' => 1, 'period' => 2, 'start' => '09:00:00', 'end' => '11:00:00',
                'subject' => 'DSN3002 PDS Lab (DS1: Roll 1-15)',
                'teacher' => 'Kanu Goel', 'room' => 'CL13'
            ],
            [
                'day' => 1, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00',
                'subject' => 'HSM-II G1-G4 (Lecture)',
                'teacher' => 'Humanities Dept', 'room' => 'L405, L406, L407'
            ],
            [
                'day' => 1, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00',
                'subject' => 'DSN3001 DS (Lecture)',
                'teacher' => 'Sudesh Rani', 'room' => 'L405'
            ],
            [
                'day' => 1, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00',
                'subject' => 'DSN3003 OS (Lecture)',
                'teacher' => 'Ramteke Mamta', 'room' => 'L407'
            ],
            [
                'day' => 1, 'period' => 8, 'start' => '15:00:00', 'end' => '16:00:00',
                'subject' => 'DSN3002 PDS (Lecture)',
                'teacher' => 'Kanu Goel', 'room' => 'L405'
            ],
            [
                'day' => 1, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00',
                'subject' => 'Minor Specialization Course',
                'teacher' => 'MSC Dept', 'room' => 'DS MSC L405'
            ],

            // ==================== TUESDAY ====================
            [
                'day' => 2, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00',
                'subject' => 'DSN3001 DS (Lecture)',
                'teacher' => 'Sudesh Rani', 'room' => 'L405'
            ],
            [
                'day' => 2, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00',
                'subject' => 'DSN3004 CN (Lecture)',
                'teacher' => 'Trilok Chand', 'room' => 'L405'
            ],
            [
                'day' => 2, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00',
                'subject' => 'DSN3002 PDS (Lecture)',
                'teacher' => 'Kanu Goel', 'room' => 'L21'
            ],
            [
                'day' => 2, 'period' => 8, 'start' => '15:00:00', 'end' => '16:00:00',
                'subject' => 'HSM-II G1-G4 (Lecture)',
                'teacher' => 'Humanities Dept', 'room' => 'L405'
            ],
            [
                'day' => 2, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00',
                'subject' => 'Minor Specialization Course',
                'teacher' => 'MSC Dept', 'room' => 'DS MSC L405'
            ],
            [
                'day' => 2, 'period' => 10, 'start' => '17:00:00', 'end' => '19:00:00',
                'subject' => 'DSN3001 DS Lab (DS3: Roll 31-45)',
                'teacher' => 'Sudesh Rani', 'room' => 'Lab 306'
            ],

            // ==================== WEDNESDAY ====================
            [
                'day' => 3, 'period' => 1, 'start' => '08:00:00', 'end' => '11:00:00',
                'subject' => 'DSN3002 PDS Lab (DS3: Roll 31-45)',
                'teacher' => 'Kanu Goel', 'room' => 'Lab 304'
            ],
            [
                'day' => 3, 'period' => 1, 'start' => '08:00:00', 'end' => '11:00:00',
                'subject' => 'DSN3001 DS Lab (DS1, DS2: Roll 1-30)',
                'teacher' => 'Sudesh Rani', 'room' => 'Labs 301, 303'
            ],
            [
                'day' => 3, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00',
                'subject' => 'DSN3001 DS (Lecture)',
                'teacher' => 'Sudesh Rani', 'room' => 'L405'
            ],
            [
                'day' => 3, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00',
                'subject' => 'No venues available',
                'teacher' => '-', 'room' => '-'
            ],
            [
                'day' => 3, 'period' => 7, 'start' => '14:00:00', 'end' => '16:00:00',
                'subject' => 'DSN3004 CN Lab (DS1, DS2: Roll 1-30)',
                'teacher' => 'Trilok Chand', 'room' => 'CL13, CL14'
            ],
            [
                'day' => 3, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00',
                'subject' => 'Minor Specialization Course',
                'teacher' => 'MSC Dept', 'room' => 'DS MSC L405'
            ],

            // ==================== THURSDAY ====================
            [
                'day' => 4, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00',
                'subject' => 'DSN3004 CN (Lecture)',
                'teacher' => 'Trilok Chand', 'room' => 'L405'
            ],
            [
                'day' => 4, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00',
                'subject' => 'DSN3002 PDS (Lecture)',
                'teacher' => 'Kanu Goel', 'room' => 'L22'
            ],
            [
                'day' => 4, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00',
                'subject' => 'DSN3003 OS (Lecture)',
                'teacher' => 'Ramteke Mamta', 'room' => 'L405'
            ],
            [
                'day' => 4, 'period' => 8, 'start' => '15:00:00', 'end' => '16:00:00',
                'subject' => 'HSM-II (T)',
                'teacher' => 'Humanities Dept', 'room' => 'L405'
            ],
            [
                'day' => 4, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00',
                'subject' => 'HSM-II (T)',
                'teacher' => 'Humanities Dept', 'room' => 'L405, L406, L407, T-9, T-11, T-12'
            ],
            [
                'day' => 4, 'period' => 10, 'start' => '17:00:00', 'end' => '19:00:00',
                'subject' => 'DSN3003 OS Lab (DS1, DS2: Roll 1-30)',
                'teacher' => 'Ramteke Mamta', 'room' => 'Lab 306'
            ],

            // ==================== FRIDAY ====================
            [
                'day' => 5, 'period' => 2, 'start' => '09:00:00', 'end' => '11:00:00',
                'subject' => 'DSN3002 PDS Lab (DS1: Roll 1-15)',
                'teacher' => 'Kanu Goel', 'room' => 'Lab 306'
            ],
            [
                'day' => 5, 'period' => 2, 'start' => '09:00:00', 'end' => '11:00:00',
                'subject' => 'DSN3004 CN Lab (DS3: Roll 31-45)',
                'teacher' => 'Trilok Chand', 'room' => 'CL14'
            ],
            [
                'day' => 5, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00',
                'subject' => 'DSN3004 CN (Lecture)',
                'teacher' => 'Trilok Chand', 'room' => 'L405'
            ],
            [
                'day' => 5, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00',
                'subject' => 'DSN3003 OS (Lecture)',
                'teacher' => 'Ramteke Mamta', 'room' => 'L19'
            ],
            [
                'day' => 5, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00',
                'subject' => 'HSM-II (T)',
                'teacher' => 'Humanities Dept', 'room' => 'L405, L406, L407, T-9, T-11, T-12'
            ],
            [
                'day' => 5, 'period' => 8, 'start' => '15:00:00', 'end' => '17:00:00',
                'subject' => 'Minor Spec. Course Tute/Practical',
                'teacher' => 'MSC Dept', 'room' => 'DS MSC L405'
            ],
        ];

        foreach ($dsSchedule as $slot) {
            $this->seedSlot($dsGroup->id, $slot);
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
