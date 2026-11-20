<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\CourseClass;
use App\Models\Timetable;
use Illuminate\Database\Seeder;

class PecDs3rdSemSeeder extends Seeder
{
    /**
     * Run database seeds for B.Tech CSE (Data Science) 3rd Semester Timetable (Session 26271, w.e.f. 9/10/2026).
     */
    public function run(): void
    {
        // 1. Ensure Data Science Branch exists
        $ds = Branch::updateOrCreate(
            ['code' => 'DS'],
            ['name' => 'Computer Science and Engineering (Data Science)']
        );

        // 2. Create DS Class (Single Group for the batch: Roll 1-64, DS1: 1-22, DS2: 23-42, DS3: 43-64)
        $dsGroup = CourseClass::updateOrCreate(
            ['branch_id' => $ds->id, 'year' => 2, 'group_name' => 'DS - G1 (Roll 1-64)'],
            ['cr_user_id' => null]
        );

        // Clear existing slots to prevent duplicates
        Timetable::where('class_id', $dsGroup->id)->delete();

        // ==========================================
        // 3. SEED TIMETABLE (w.e.f. 09/10/2026)
        // ==========================================
        $schedule = [
            // ==========================================
            // MONDAY (Day 1)
            // ==========================================
            [
                'day' => 1,
                'period' => 2,
                'start' => '09:00:00',
                'end' => '11:00:00',
                'subject' => 'DSN3003 OS Lab (DS3) 306 / DSN3002 PDS Lab (DS1) CL13',
                'teacher' => 'Ramteke Mamta / Kanu Goel',
                'room' => '306 / CL13',
            ],
            [
                'day' => 1,
                'period' => 4,
                'start' => '11:00:00',
                'end' => '12:00:00',
                'subject' => 'HSM-II G1–G4',
                'teacher' => 'Humanities Dept',
                'room' => 'L405, L406, L407',
            ],
            [
                'day' => 1,
                'period' => 5,
                'start' => '12:00:00',
                'end' => '13:00:00',
                'subject' => 'DSN3001 DS',
                'teacher' => 'Sudesh Rani',
                'room' => 'L405',
            ],
            [
                'day' => 1,
                'period' => 7,
                'start' => '14:00:00',
                'end' => '15:00:00',
                'subject' => 'DSN3003 OS',
                'teacher' => 'Ramteke Mamta',
                'room' => 'L407',
            ],
            [
                'day' => 1,
                'period' => 8,
                'start' => '15:00:00',
                'end' => '16:00:00',
                'subject' => 'DSN3002 PDS',
                'teacher' => 'Kanu Goel',
                'room' => 'L405',
            ],
            [
                'day' => 1,
                'period' => 9,
                'start' => '16:00:00',
                'end' => '17:00:00',
                'subject' => 'Minor Specialization course',
                'teacher' => 'MSC Dept',
                'room' => 'DS MSC L405',
            ],

            // ==========================================
            // TUESDAY (Day 2)
            // ==========================================
            [
                'day' => 2,
                'period' => 2,
                'start' => '09:00:00',
                'end' => '11:00:00',
                'subject' => 'DSN3001 DS Lab (DS3)',
                'teacher' => 'Sudesh Rani',
                'room' => '306',
            ],
            [
                'day' => 2,
                'period' => 4,
                'start' => '11:00:00',
                'end' => '12:00:00',
                'subject' => 'DSN3002 PDS',
                'teacher' => 'Kanu Goel',
                'room' => 'L405',
            ],
            [
                'day' => 2,
                'period' => 5,
                'start' => '12:00:00',
                'end' => '13:00:00',
                'subject' => 'DSN3004 CN',
                'teacher' => 'Trilok Chand',
                'room' => 'L405',
            ],
            [
                'day' => 2,
                'period' => 7,
                'start' => '14:00:00',
                'end' => '15:00:00',
                'subject' => 'DSN3001 DS',
                'teacher' => 'Sudesh Rani',
                'room' => 'L21',
            ],
            [
                'day' => 2,
                'period' => 8,
                'start' => '15:00:00',
                'end' => '16:00:00',
                'subject' => 'HSM-II G1–G4',
                'teacher' => 'Humanities Dept',
                'room' => 'L405',
            ],
            [
                'day' => 2,
                'period' => 9,
                'start' => '16:00:00',
                'end' => '17:00:00',
                'subject' => 'Minor Specialization course',
                'teacher' => 'MSC Dept',
                'room' => 'DS MSC L405',
            ],

            // ==========================================
            // WEDNESDAY (Day 3)
            // ==========================================
            [
                'day' => 3,
                'period' => 2,
                'start' => '09:00:00',
                'end' => '11:00:00',
                'subject' => 'DSN3002 PDS Lab (DS3) 304 / DSN3001 DS Lab (DS1, DS2) 301+305',
                'teacher' => 'Kanu Goel / Sudesh Rani',
                'room' => '304 / 301+305',
            ],
            [
                'day' => 3,
                'period' => 4,
                'start' => '11:00:00',
                'end' => '12:00:00',
                'subject' => 'DSN3001 DS',
                'teacher' => 'Sudesh Rani',
                'room' => 'L405',
            ],
            [
                'day' => 3,
                'period' => 5,
                'start' => '12:00:00',
                'end' => '13:00:00',
                'subject' => 'DSN3003 OS',
                'teacher' => 'Ramteke Mamta',
                'room' => '405',
            ],
            [
                'day' => 3,
                'period' => 7,
                'start' => '14:00:00',
                'end' => '16:00:00',
                'subject' => 'DSN3004 CN Lab (DS1, DS2)',
                'teacher' => 'Trilok Chand',
                'room' => 'CL13+CL14',
            ],
            [
                'day' => 3,
                'period' => 9,
                'start' => '16:00:00',
                'end' => '17:00:00',
                'subject' => 'Minor Specialization course',
                'teacher' => 'MSC Dept',
                'room' => 'DS MSC L405',
            ],

            // ==========================================
            // THURSDAY (Day 4)
            // ==========================================
            [
                'day' => 4,
                'period' => 2,
                'start' => '09:00:00',
                'end' => '11:00:00',
                'subject' => 'DSN3003 OS Lab (DS1, DS2)',
                'teacher' => 'Ramteke Mamta',
                'room' => '305',
            ],
            [
                'day' => 4,
                'period' => 4,
                'start' => '11:00:00',
                'end' => '12:00:00',
                'subject' => 'DSN3004 CN',
                'teacher' => 'Trilok Chand',
                'room' => 'L405',
            ],
            [
                'day' => 4,
                'period' => 5,
                'start' => '12:00:00',
                'end' => '13:00:00',
                'subject' => 'DSN3002 PDS',
                'teacher' => 'Kanu Goel',
                'room' => 'L22',
            ],
            [
                'day' => 4,
                'period' => 7,
                'start' => '14:00:00',
                'end' => '15:00:00',
                'subject' => 'DSN3003 OS',
                'teacher' => 'Ramteke Mamta',
                'room' => 'L405',
            ],
            [
                'day' => 4,
                'period' => 8,
                'start' => '15:00:00',
                'end' => '16:00:00',
                'subject' => 'HSM-II (T)',
                'teacher' => 'Humanities Dept',
                'room' => 'L405',
            ],
            [
                'day' => 4,
                'period' => 9,
                'start' => '16:00:00',
                'end' => '17:00:00',
                'subject' => 'HSM-II (T)',
                'teacher' => 'Humanities Dept',
                'room' => 'L405, L406, L407, T-9, T-11, T-12',
            ],

            // ==========================================
            // FRIDAY (Day 5)
            // ==========================================
            [
                'day' => 5,
                'period' => 2,
                'start' => '09:00:00',
                'end' => '11:00:00',
                'subject' => 'DSN3002 PDS Lab (DS2) 306 / DSN3004 CN Lab (DS3) CL14',
                'teacher' => 'Kanu Goel / Trilok Chand',
                'room' => '306 / CL14',
            ],
            [
                'day' => 5,
                'period' => 4,
                'start' => '11:00:00',
                'end' => '12:00:00',
                'subject' => 'DSN3004 CN',
                'teacher' => 'Trilok Chand',
                'room' => 'L405',
            ],
            [
                'day' => 5,
                'period' => 7,
                'start' => '14:00:00',
                'end' => '15:00:00',
                'subject' => 'HSM-II (T)',
                'teacher' => 'Humanities Dept',
                'room' => 'L405, L406, L407, T-9, T-11, T-12',
            ],
            [
                'day' => 5,
                'period' => 8,
                'start' => '15:00:00',
                'end' => '17:00:00',
                'subject' => 'Minor Spec. course Tute/Practical',
                'teacher' => 'MSC Dept',
                'room' => 'DS MSC L405',
            ],
        ];

        // 4. Insert slots
        foreach ($schedule as $slot) {
            $this->seedSlot($dsGroup->id, $slot);
        }

        $this->command->info("Seeded B.Tech CSE (Data Science) 3rd Semester Timetable (" . count($schedule) . " slots).");
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
