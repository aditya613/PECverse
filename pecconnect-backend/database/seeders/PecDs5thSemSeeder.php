<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\CourseClass;
use App\Models\Timetable;
use Illuminate\Database\Seeder;

class PecDs5thSemSeeder extends Seeder
{
    /**
     * Run database seeds for B.Tech CSE (Data Science) 5th Semester Timetable (Session 26271, w.e.f. 9/10/2026).
     */
    public function run(): void
    {
        // 1. Ensure Data Science Branch exists
        $dsBranch = Branch::updateOrCreate(
            ['code' => 'DS'],
            ['name' => 'Data Science']
        );

        // 2. Create class for 5th Sem Data Science
        $dsClass = CourseClass::updateOrCreate(
            ['branch_id' => $dsBranch->id, 'year' => 3, 'group_name' => 'Data Science 5th Sem'],
            ['cr_user_id' => null]
        );

        // Clear existing slots to prevent duplicates
        Timetable::where('class_id', $dsClass->id)->delete();

        // 3. Define Timetable Schedule (w.e.f. 09/10/2026)
        $schedule = [
            // ==========================================
            // MONDAY (Day 1)
            // ==========================================
            [
                'day' => 1,
                'period' => 3,
                'start' => '10:00:00',
                'end' => '12:00:00',
                'subject' => 'DSN5001 DAIR Lab (DS2+DS3) / DSN5002 ATDS Lab (DS1)',
                'teacher' => 'Dr. Suraj Srivastava / Dr. Manish Kumar',
                'room' => '301+CL14 / 402',
            ],
            [
                'day' => 1,
                'period' => 5,
                'start' => '12:00:00',
                'end' => '13:00:00',
                'subject' => 'DSN5004 IoT',
                'teacher' => 'Ms. Ishita',
                'room' => 'L407',
            ],
            [
                'day' => 1,
                'period' => 7,
                'start' => '14:00:00',
                'end' => '15:00:00',
                'subject' => 'DSP5101- Minor Project',
                'teacher' => 'Dept Faculty',
                'room' => 'Dept Labs',
            ],
            [
                'day' => 1,
                'period' => 8,
                'start' => '15:00:00',
                'end' => '16:00:00',
                'subject' => 'DSN5002 ATDS',
                'teacher' => 'Dr. Manish Kumar',
                'room' => 'L407',
            ],
            [
                'day' => 1,
                'period' => 9,
                'start' => '16:00:00',
                'end' => '17:00:00',
                'subject' => 'MSC L (DSM1003 ATDS)',
                'teacher' => 'Dr. Manish Kumar',
                'room' => 'L407',
            ],

            // ==========================================
            // TUESDAY (Day 2)
            // ==========================================
            [
                'day' => 2,
                'period' => 2,
                'start' => '09:00:00',
                'end' => '10:00:00',
                'subject' => 'DSN5001 DAIR',
                'teacher' => 'Dr. Suraj Srivastava',
                'room' => 'L405',
            ],
            [
                'day' => 2,
                'period' => 3,
                'start' => '10:00:00',
                'end' => '11:00:00',
                'subject' => 'DSN5003 SE',
                'teacher' => 'Dr. Rajesh Bhatia',
                'room' => 'L405',
            ],
            [
                'day' => 2,
                'period' => 4,
                'start' => '11:00:00',
                'end' => '13:00:00',
                'subject' => 'DSN5002 ATDS Lab (DS2) / DSN5001 DAIR Lab (DS4)',
                'teacher' => 'Dr. Manish Kumar / Dr. Suraj Srivastava',
                'room' => '301 / 402',
            ],
            [
                'day' => 2,
                'period' => 7,
                'start' => '14:00:00',
                'end' => '15:00:00',
                'subject' => 'DSP5101- Minor Project',
                'teacher' => 'Dept Faculty',
                'room' => 'Dept Labs',
            ],
            [
                'day' => 2,
                'period' => 8,
                'start' => '15:00:00',
                'end' => '16:00:00',
                'subject' => 'DSN5004 IoT',
                'teacher' => 'Ms. Ishita',
                'room' => 'L407',
            ],
            [
                'day' => 2,
                'period' => 9,
                'start' => '16:00:00',
                'end' => '17:00:00',
                'subject' => 'MSC L (DSM1003 ATDS)',
                'teacher' => 'Dr. Manish Kumar',
                'room' => 'L407',
            ],

            // ==========================================
            // WEDNESDAY (Day 3)
            // ==========================================
            [
                'day' => 3,
                'period' => 1,
                'start' => '08:00:00',
                'end' => '10:00:00',
                'subject' => 'DSH1001- Honours Project-I',
                'teacher' => 'Dept Faculty',
                'room' => 'Dept Labs',
            ],
            [
                'day' => 3,
                'period' => 3,
                'start' => '10:00:00',
                'end' => '11:00:00',
                'subject' => 'DSN5001 DAIR',
                'teacher' => 'Dr. Suraj Srivastava',
                'room' => '407',
            ],
            [
                'day' => 3,
                'period' => 4,
                'start' => '11:00:00',
                'end' => '13:00:00',
                'subject' => 'DSN5003 SE Lab (DS1+DS2) / DSN5002 ATDS Lab (DS3+DS4)',
                'teacher' => 'Dr. Rajesh Bhatia / Dr. Manish Kumar',
                'room' => '301+306 / 305',
            ],
            [
                'day' => 3,
                'period' => 7,
                'start' => '14:00:00',
                'end' => '16:00:00',
                'subject' => 'DSN5003 SE Lab (DS3+DS4) / DSN5001 DAIR Lab (DS1)',
                'teacher' => 'Dr. Rajesh Bhatia / Dr. Suraj Srivastava',
                'room' => '303+306 / 402',
            ],
            [
                'day' => 3,
                'period' => 9,
                'start' => '16:00:00',
                'end' => '17:00:00',
                'subject' => 'MSC L (DSM1003 ATDS)',
                'teacher' => 'Dr. Manish Kumar',
                'room' => 'L407',
            ],

            // ==========================================
            // THURSDAY (Day 4)
            // ==========================================
            [
                'day' => 4,
                'period' => 2,
                'start' => '09:00:00',
                'end' => '10:00:00',
                'subject' => 'DSN5001 DAIR',
                'teacher' => 'Dr. Suraj Srivastava',
                'room' => 'L405',
            ],
            [
                'day' => 4,
                'period' => 3,
                'start' => '10:00:00',
                'end' => '11:00:00',
                'subject' => 'DSN5003 SE',
                'teacher' => 'Dr. Rajesh Bhatia',
                'room' => 'L407',
            ],
            [
                'day' => 4,
                'period' => 4,
                'start' => '11:00:00',
                'end' => '12:00:00',
                'subject' => 'DSP5101- Minor Project',
                'teacher' => 'Dept Faculty',
                'room' => 'Dept Labs',
            ],
            [
                'day' => 4,
                'period' => 5,
                'start' => '12:00:00',
                'end' => '13:00:00',
                'subject' => 'DSN5002 ATDS',
                'teacher' => 'Dr. Manish Kumar',
                'room' => 'L405',
            ],
            [
                'day' => 4,
                'period' => 7,
                'start' => '14:00:00',
                'end' => '16:00:00',
                'subject' => 'DSN5004 IoT Lab (DS1+DS2+DS3+DS4)',
                'teacher' => 'Dr. Sanehi',
                'room' => '305+CL13+CL14',
            ],
            [
                'day' => 4,
                'period' => 9,
                'start' => '16:00:00',
                'end' => '17:00:00',
                'subject' => 'DSH1001- Honours Project-I',
                'teacher' => 'Dept Faculty',
                'room' => 'Dept Labs',
            ],

            // ==========================================
            // FRIDAY (Day 5)
            // ==========================================
            [
                'day' => 5,
                'period' => 2,
                'start' => '09:00:00',
                'end' => '10:00:00',
                'subject' => 'DSH1001- Honours Project-I',
                'teacher' => 'Dept Faculty',
                'room' => 'Dept Labs',
            ],
            [
                'day' => 5,
                'period' => 3,
                'start' => '10:00:00',
                'end' => '11:00:00',
                'subject' => 'DSN5002 ATDS',
                'teacher' => 'Dr. Manish Kumar',
                'room' => 'L405',
            ],
            [
                'day' => 5,
                'period' => 4,
                'start' => '11:00:00',
                'end' => '12:00:00',
                'subject' => 'DSN5004 IoT',
                'teacher' => 'Ms. Ishita',
                'room' => 'L406',
            ],
            [
                'day' => 5,
                'period' => 5,
                'start' => '12:00:00',
                'end' => '13:00:00',
                'subject' => 'DSN5003 SE',
                'teacher' => 'Dr. Rajesh Bhatia',
                'room' => 'L406',
            ],
            [
                'day' => 5,
                'period' => 7,
                'start' => '14:00:00',
                'end' => '15:00:00',
                'subject' => 'DSP5101- Minor Project',
                'teacher' => 'Dept Faculty',
                'room' => 'Dept Labs',
            ],
            [
                'day' => 5,
                'period' => 8,
                'start' => '15:00:00',
                'end' => '17:00:00',
                'subject' => 'MSC Lab (DSM1003 ATDS)',
                'teacher' => 'Dr. Manish Kumar',
                'room' => 'L407',
            ],
        ];

        // 4. Insert slots
        foreach ($schedule as $slot) {
            $this->seedSlot($dsClass->id, $slot);
        }

        $this->command->info("Seeded B.Tech CSE (Data Science) 5th Semester Timetable (" . count($schedule) . " slots).");
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
