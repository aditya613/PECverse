<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\CourseClass;
use App\Models\Timetable;
use Illuminate\Database\Seeder;

class PecCseAi3rdSemSeeder extends Seeder
{
    /**
     * Run database seeds for B.Tech CSE (AI) 3rd Semester Timetable (Session 26271, w.e.f. 9/10/2026).
     */
    public function run(): void
    {
        // 1. Ensure CSE-AI Branch exists
        $aiBranch = Branch::updateOrCreate(
            ['code' => 'CSE-AI'],
            ['name' => 'Computer Science & Engineering (AI)']
        );

        // 2. Create single unified class for all 30 students (AI1: 1-15, AI2: 16-30)
        $aiClass = CourseClass::updateOrCreate(
            ['branch_id' => $aiBranch->id, 'year' => 2, 'group_name' => 'CSE (AI) (Roll 1-30)'],
            ['cr_user_id' => null]
        );

        // Clear existing slots to prevent duplicates
        Timetable::where('class_id', $aiClass->id)->delete();

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
                'end' => '10:00:00',
                'subject' => 'AIN3002 OOP',
                'teacher' => 'Satnam Kaur',
                'room' => 'L406',
            ],
            [
                'day' => 1,
                'period' => 3,
                'start' => '10:00:00',
                'end' => '11:00:00',
                'subject' => 'HSM-II G1-G4',
                'teacher' => 'Humanities Dept',
                'room' => 'L405',
            ],
            [
                'day' => 1,
                'period' => 4,
                'start' => '11:00:00',
                'end' => '12:00:00',
                'subject' => 'AIN3003 DSML',
                'teacher' => 'Shailendra Singh',
                'room' => 'L22',
            ],
            [
                'day' => 1,
                'period' => 5,
                'start' => '12:00:00',
                'end' => '13:00:00',
                'subject' => 'Discussions/Library/Doubts',
                'teacher' => 'Dept Faculty',
                'room' => 'Library / Classroom',
            ],
            [
                'day' => 1,
                'period' => 7,
                'start' => '14:00:00',
                'end' => '16:00:00',
                'subject' => 'AIN3001 DS Lab (AI1) 402 / AIN3002 OOP Lab (AI2) CL5',
                'teacher' => 'Sudesh Rani / Satnam Kaur',
                'room' => '402 / CL5',
            ],
            [
                'day' => 1,
                'period' => 9,
                'start' => '16:00:00',
                'end' => '17:00:00',
                'subject' => 'Minor Specialization course',
                'teacher' => 'MSC Dept',
                'room' => 'Respective Dept',
            ],

            // ==========================================
            // TUESDAY (Day 2)
            // ==========================================
            [
                'day' => 2,
                'period' => 2,
                'start' => '09:00:00',
                'end' => '11:00:00',
                'subject' => 'AIN3004 MFAI Lab (AI1)',
                'teacher' => 'Dr. Nitin Kumar',
                'room' => '402',
            ],
            [
                'day' => 2,
                'period' => 4,
                'start' => '11:00:00',
                'end' => '12:00:00',
                'subject' => 'AIN3004 MFAI',
                'teacher' => 'Dr. Nitin Kumar',
                'room' => 'L406',
            ],
            [
                'day' => 2,
                'period' => 5,
                'start' => '12:00:00',
                'end' => '13:00:00',
                'subject' => 'AIN3002 OOP',
                'teacher' => 'Satnam Kaur',
                'room' => '305',
            ],
            [
                'day' => 2,
                'period' => 7,
                'start' => '14:00:00',
                'end' => '16:00:00',
                'subject' => 'AIN3003 DSML Lab (AI2)',
                'teacher' => 'Shailendra Singh',
                'room' => 'CL5',
            ],
            [
                'day' => 2,
                'period' => 9,
                'start' => '16:00:00',
                'end' => '17:00:00',
                'subject' => 'Minor Specialization course',
                'teacher' => 'MSC Dept',
                'room' => 'Respective Dept',
            ],

            // ==========================================
            // WEDNESDAY (Day 3)
            // ==========================================
            [
                'day' => 3,
                'period' => 2,
                'start' => '09:00:00',
                'end' => '11:00:00',
                'subject' => 'AIN3001 DS Lab (AI2)',
                'teacher' => 'Sudesh Rani',
                'room' => '305',
            ],
            [
                'day' => 3,
                'period' => 4,
                'start' => '11:00:00',
                'end' => '12:00:00',
                'subject' => 'AIN3003 DSML',
                'teacher' => 'Shailendra Singh',
                'room' => 'L406',
            ],
            [
                'day' => 3,
                'period' => 5,
                'start' => '12:00:00',
                'end' => '13:00:00',
                'subject' => 'HSM-II',
                'teacher' => 'Humanities Dept',
                'room' => 'L405',
            ],
            [
                'day' => 3,
                'period' => 7,
                'start' => '14:00:00',
                'end' => '16:00:00',
                'subject' => 'AIN3002 OOP Lab (AI1) CL5 / AIN3004 MFAI Lecture backlog L406',
                'teacher' => 'Satnam Kaur / Dr. Nitin Kumar',
                'room' => 'CL5 / L406',
            ],
            [
                'day' => 3,
                'period' => 9,
                'start' => '16:00:00',
                'end' => '17:00:00',
                'subject' => 'Minor Specialization course',
                'teacher' => 'MSC Dept',
                'room' => 'Respective Dept',
            ],

            // ==========================================
            // THURSDAY (Day 4)
            // ==========================================
            [
                'day' => 4,
                'period' => 2,
                'start' => '09:00:00',
                'end' => '10:00:00',
                'subject' => 'AIN3001 DS',
                'teacher' => 'Sudesh Rani',
                'room' => 'L406',
            ],
            [
                'day' => 4,
                'period' => 3,
                'start' => '10:00:00',
                'end' => '12:00:00',
                'subject' => 'AIN3003 DSML Lab (AI1) CL5 / AIN3004 MFAI Lab (AI2) CL13',
                'teacher' => 'Shailendra Singh / Dr. Nitin Kumar',
                'room' => 'CL5 / CL13',
            ],
            [
                'day' => 4,
                'period' => 5,
                'start' => '12:00:00',
                'end' => '13:00:00',
                'subject' => 'AIN3004 MFAI',
                'teacher' => 'Dr. Nitin Kumar',
                'room' => 'L406',
            ],
            [
                'day' => 4,
                'period' => 7,
                'start' => '14:00:00',
                'end' => '15:00:00',
                'subject' => 'AIN3001 DS',
                'teacher' => 'Sudesh Rani',
                'room' => 'L406',
            ],
            [
                'day' => 4,
                'period' => 8,
                'start' => '15:00:00',
                'end' => '16:00:00',
                'subject' => 'AIN3004 MFAI',
                'teacher' => 'Dr. Nitin Kumar',
                'room' => 'L22',
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
                'end' => '10:00:00',
                'subject' => 'AIN3001 DS',
                'teacher' => 'Sudesh Rani',
                'room' => 'L405',
            ],
            [
                'day' => 5,
                'period' => 3,
                'start' => '10:00:00',
                'end' => '11:00:00',
                'subject' => 'AIN3003 DSML',
                'teacher' => 'Shailendra Singh',
                'room' => 'L406',
            ],
            [
                'day' => 5,
                'period' => 4,
                'start' => '11:00:00',
                'end' => '12:00:00',
                'subject' => 'HSM-II (T)',
                'teacher' => 'Humanities Dept',
                'room' => 'L405, L406, L407',
            ],
            [
                'day' => 5,
                'period' => 5,
                'start' => '12:00:00',
                'end' => '13:00:00',
                'subject' => 'HSM-II (T)',
                'teacher' => 'Humanities Dept',
                'room' => 'L405, L406, L407',
            ],
            [
                'day' => 5,
                'period' => 7,
                'start' => '14:00:00',
                'end' => '15:00:00',
                'subject' => 'AIN3002 OOP',
                'teacher' => 'Satnam Kaur',
                'room' => '405',
            ],
            [
                'day' => 5,
                'period' => 8,
                'start' => '15:00:00',
                'end' => '17:00:00',
                'subject' => 'Minor Spec. course Tute/Practical',
                'teacher' => 'MSC Dept',
                'room' => 'Respective Dept',
            ],
        ];

        // 4. Insert slots
        foreach ($schedule as $slot) {
            $this->seedSlot($aiClass->id, $slot);
        }

        $this->command->info("Seeded B.Tech CSE (AI) 3rd Semester Timetable (" . count($schedule) . " slots).");
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
