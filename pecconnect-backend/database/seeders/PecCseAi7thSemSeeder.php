<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\CourseClass;
use App\Models\Timetable;
use Illuminate\Database\Seeder;

class PecCseAi7thSemSeeder extends Seeder
{
    /**
     * Run database seeds for B.Tech CSE (AI) 7th Semester Timetable (Session 26271, w.e.f. 9/10/2026).
     */
    public function run(): void
    {
        // 1. Ensure CSE-AI Branch exists
        $aiBranch = Branch::updateOrCreate(
            ['code' => 'CSE-AI'],
            ['name' => 'Computer Science & Engineering (AI)']
        );

        // 2. Create class for 7th Sem CSE (AI)
        $aiClass = CourseClass::updateOrCreate(
            ['branch_id' => $aiBranch->id, 'year' => 4, 'group_name' => 'CSE (AI) 7th Sem'],
            ['cr_user_id' => null]
        );

        // Clear existing slots to prevent duplicates
        Timetable::where('class_id', $aiClass->id)->delete();

        // 3. Define Timetable Schedule (w.e.f. 09/10/2026)
        $schedule = [
            // ==========================================
            // MONDAY (Day 1)
            // ==========================================
            [
                'day' => 1,
                'period' => 1,
                'start' => '08:00:00',
                'end' => '10:00:00',
                'subject' => 'Lab: CVIP',
                'teacher' => 'Dr. Ravpreet',
                'room' => '303',
            ],
            [
                'day' => 1,
                'period' => 3,
                'start' => '10:00:00',
                'end' => '11:00:00',
                'subject' => 'DEC-II (L): NLP',
                'teacher' => 'Dr. Neeraj',
                'room' => 'L407',
            ],
            [
                'day' => 1,
                'period' => 4,
                'start' => '11:00:00',
                'end' => '12:00:00',
                'subject' => 'WMN (combined w/ CSE+DS)',
                'teacher' => 'Sanehi',
                'room' => '303',
            ],
            [
                'day' => 1,
                'period' => 5,
                'start' => '12:00:00',
                'end' => '13:00:00',
                'subject' => 'HSM III G1',
                'teacher' => 'Humanities Dept',
                'room' => 'L26-L29',
            ],
            [
                'day' => 1,
                'period' => 7,
                'start' => '14:00:00',
                'end' => '16:00:00',
                'subject' => 'OE-II Tute/Practical',
                'teacher' => 'Respective Dept',
                'room' => 'Respective dept tute rooms/labs',
            ],
            [
                'day' => 1,
                'period' => 9,
                'start' => '16:00:00',
                'end' => '17:00:00',
                'subject' => 'HSM III (Tute)',
                'teacher' => 'Humanities Dept',
                'room' => 'L21, L22, L26, L27',
            ],

            // ==========================================
            // TUESDAY (Day 2)
            // ==========================================
            [
                'day' => 2,
                'period' => 1,
                'start' => '08:00:00',
                'end' => '09:00:00',
                'subject' => 'HSM III G3',
                'teacher' => 'Humanities Dept',
                'room' => 'L26-L29',
            ],
            [
                'day' => 2,
                'period' => 3,
                'start' => '10:00:00',
                'end' => '11:00:00',
                'subject' => 'OE-II',
                'teacher' => 'Respective Dept',
                'room' => 'Respective dept classrooms',
            ],
            [
                'day' => 2,
                'period' => 4,
                'start' => '11:00:00',
                'end' => '12:00:00',
                'subject' => 'OE-I',
                'teacher' => 'Respective Dept',
                'room' => 'Respective dept classrooms',
            ],
            [
                'day' => 2,
                'period' => 5,
                'start' => '12:00:00',
                'end' => '13:00:00',
                'subject' => 'HSM III G1',
                'teacher' => 'Humanities Dept',
                'room' => 'L26-L29',
            ],
            [
                'day' => 2,
                'period' => 7,
                'start' => '14:00:00',
                'end' => '15:00:00',
                'subject' => 'DEC-II (L): NLP',
                'teacher' => 'Dr. Neeraj',
                'room' => 'L22',
            ],
            [
                'day' => 2,
                'period' => 8,
                'start' => '15:00:00',
                'end' => '17:00:00',
                'subject' => 'OE-I Tute/Practical',
                'teacher' => 'Respective Dept',
                'room' => 'Respective dept classrooms',
            ],

            // ==========================================
            // WEDNESDAY (Day 3)
            // ==========================================
            [
                'day' => 3,
                'period' => 1,
                'start' => '08:00:00',
                'end' => '09:00:00',
                'subject' => 'AIP7001 Major Project',
                'teacher' => 'Dept Faculty',
                'room' => 'Dept Labs',
            ],
            [
                'day' => 3,
                'period' => 2,
                'start' => '09:00:00',
                'end' => '10:00:00',
                'subject' => 'OE-II',
                'teacher' => 'Respective Dept',
                'room' => 'Respective dept classrooms',
            ],
            [
                'day' => 3,
                'period' => 3,
                'start' => '10:00:00',
                'end' => '11:00:00',
                'subject' => 'DEC-I: CVIP',
                'teacher' => 'Dr. Ravpreet',
                'room' => 'L22',
            ],
            [
                'day' => 3,
                'period' => 4,
                'start' => '11:00:00',
                'end' => '12:00:00',
                'subject' => 'WMN (combined w/ CSE+DS)',
                'teacher' => 'Sanehi',
                'room' => '303',
            ],
            [
                'day' => 3,
                'period' => 5,
                'start' => '12:00:00',
                'end' => '13:00:00',
                'subject' => 'HSM III (Tute)',
                'teacher' => 'Humanities Dept',
                'room' => 'L26-L31',
            ],
            [
                'day' => 3,
                'period' => 7,
                'start' => '14:00:00',
                'end' => '15:00:00',
                'subject' => 'DEC-I: CVIP',
                'teacher' => 'Dr. Ravpreet',
                'room' => 'L407',
            ],
            [
                'day' => 3,
                'period' => 8,
                'start' => '15:00:00',
                'end' => '16:00:00',
                'subject' => 'DEC-II (L): NLP',
                'teacher' => 'Dr. Neeraj',
                'room' => 'L405',
            ],
            [
                'day' => 3,
                'period' => 9,
                'start' => '16:00:00',
                'end' => '17:00:00',
                'subject' => 'AIP7001 Major Project',
                'teacher' => 'Dept Faculty',
                'room' => 'Dept Labs',
            ],

            // ==========================================
            // THURSDAY (Day 4)
            // ==========================================
            [
                'day' => 4,
                'period' => 1,
                'start' => '08:00:00',
                'end' => '10:00:00',
                'subject' => 'Lab: NLP',
                'teacher' => 'Dr. Neeraj / Jagminder',
                'room' => 'CL5',
            ],
            [
                'day' => 4,
                'period' => 3,
                'start' => '10:00:00',
                'end' => '12:00:00',
                'subject' => 'WMN Lab (combined w/ CSE+DS)',
                'teacher' => 'Sanehi',
                'room' => '306+303',
            ],
            [
                'day' => 4,
                'period' => 5,
                'start' => '12:00:00',
                'end' => '13:00:00',
                'subject' => 'HSM III G2',
                'teacher' => 'Humanities Dept',
                'room' => 'L26-L29',
            ],
            [
                'day' => 4,
                'period' => 7,
                'start' => '14:00:00',
                'end' => '15:00:00',
                'subject' => 'DEC-I: CVIP',
                'teacher' => 'Dr. Ravpreet',
                'room' => 'L22',
            ],
            [
                'day' => 4,
                'period' => 8,
                'start' => '15:00:00',
                'end' => '16:00:00',
                'subject' => 'OE-I',
                'teacher' => 'Respective Dept',
                'room' => 'Respective dept classrooms',
            ],
            [
                'day' => 4,
                'period' => 9,
                'start' => '16:00:00',
                'end' => '17:00:00',
                'subject' => 'HSM III (Tute)',
                'teacher' => 'Humanities Dept',
                'room' => 'L10, L11, L26-L29',
            ],

            // ==========================================
            // FRIDAY (Day 5)
            // ==========================================
            [
                'day' => 5,
                'period' => 1,
                'start' => '08:00:00',
                'end' => '09:00:00',
                'subject' => 'OE-II (Alternative slot for 11-12 class)',
                'teacher' => 'Respective Dept',
                'room' => 'Central timetable classroom',
            ],
            [
                'day' => 5,
                'period' => 2,
                'start' => '09:00:00',
                'end' => '10:00:00',
                'subject' => 'OE-II',
                'teacher' => 'Respective Dept',
                'room' => 'Respective dept classrooms',
            ],
            [
                'day' => 5,
                'period' => 3,
                'start' => '10:00:00',
                'end' => '12:00:00',
                'subject' => 'OE-I Tute/Practical / AIP7001 Major Project (AIM1004 MSC)',
                'teacher' => 'Respective Dept',
                'room' => 'Respective dept tute rooms/labs',
            ],
            [
                'day' => 5,
                'period' => 5,
                'start' => '12:00:00',
                'end' => '13:00:00',
                'subject' => 'HSM III G2',
                'teacher' => 'Humanities Dept',
                'room' => 'L26-L29',
            ],
            [
                'day' => 5,
                'period' => 7,
                'start' => '14:00:00',
                'end' => '16:00:00',
                'subject' => 'OE-II Tute/Practical / AIP7001 Major Project (AIM1004 MSC)',
                'teacher' => 'Respective Dept',
                'room' => 'Respective dept tute rooms/labs',
            ],
            [
                'day' => 5,
                'period' => 9,
                'start' => '16:00:00',
                'end' => '17:00:00',
                'subject' => 'HSM III G2',
                'teacher' => 'Humanities Dept',
                'room' => 'L26-L29',
            ],
        ];

        foreach ($schedule as $slot) {
            $this->seedSlot($aiClass->id, $slot);
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
