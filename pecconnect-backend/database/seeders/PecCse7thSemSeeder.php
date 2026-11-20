<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\CourseClass;
use App\Models\Timetable;
use Illuminate\Database\Seeder;

class PecCse7thSemSeeder extends Seeder
{
    /**
     * Run database seeds for B.Tech CSE 7th Semester Timetable (Session 26271, w.e.f. 9/10/2026).
     */
    public function run(): void
    {
        // 1. Ensure CSE Branch exists
        $cseBranch = Branch::updateOrCreate(
            ['code' => 'CSE'],
            ['name' => 'Computer Science and Engineering']
        );

        // 2. Create class for 7th Sem CSE
        $cseClass = CourseClass::updateOrCreate(
            ['branch_id' => $cseBranch->id, 'year' => 4, 'group_name' => 'CSE 7th Sem'],
            ['cr_user_id' => null]
        );

        // Clear existing slots to prevent duplicates
        Timetable::where('class_id', $cseClass->id)->delete();

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
                'subject' => 'Lab: Deep Learning (G1+G2)',
                'teacher' => 'Dr. Navdeep, Dr. Rubal',
                'room' => 'DS lab',
            ],
            [
                'day' => 1,
                'period' => 3,
                'start' => '10:00:00',
                'end' => '11:00:00',
                'subject' => 'Deep Learning (G1+G2)',
                'teacher' => 'Dr. Navdeep',
                'room' => 'L30',
            ],
            [
                'day' => 1,
                'period' => 4,
                'start' => '11:00:00',
                'end' => '12:00:00',
                'subject' => 'WMN (combined w/ DS+AI)',
                'teacher' => 'Dr. Sanehi',
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
                'subject' => 'OE-II Tute/Practical / OE-II DAIR LAB',
                'teacher' => 'Dr. Neeraj, Amanjot, Dr. Suraj',
                'room' => 'Respective dept tute rooms / CL13+CL14',
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
                'period' => 2,
                'start' => '09:00:00',
                'end' => '10:00:00',
                'subject' => 'DEC-II: Cloud Computing (G1+G2) / DIP (combined w/ DS)',
                'teacher' => 'Dr. Vivek Dabra / Dr. Nitin Kumar',
                'room' => 'L21 / L407',
            ],
            [
                'day' => 2,
                'period' => 3,
                'start' => '10:00:00',
                'end' => '11:00:00',
                'subject' => 'OE-II (respective dept) / OE-II DAIR',
                'teacher' => 'Respective Dept / Dr. Amanjot + Dr. Suraj',
                'room' => 'Respective dept classrooms / L19+407',
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
                'subject' => 'WMN (combined w/ DS+AI)',
                'teacher' => 'Dr. Sanehi',
                'room' => '303',
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
                'subject' => 'DEC-I: Deep Learning (G1+G2)',
                'teacher' => 'Dr. Navdeep',
                'room' => 'L21',
            ],
            [
                'day' => 3,
                'period' => 2,
                'start' => '09:00:00',
                'end' => '10:00:00',
                'subject' => 'OE-II (respective dept) / OE-II DAIR',
                'teacher' => 'Respective Dept / Dr. Amanjot + Dr. Suraj',
                'room' => 'Respective dept classrooms / L19+407',
            ],
            [
                'day' => 3,
                'period' => 3,
                'start' => '10:00:00',
                'end' => '11:00:00',
                'subject' => 'DEC-II: Cloud Computing (G1+G2) / DIP (combined w/ DS)',
                'teacher' => 'Dr. Vivek Dabra / Dr. Nitin Kumar',
                'room' => 'L21 / L405',
            ],
            [
                'day' => 3,
                'period' => 4,
                'start' => '11:00:00',
                'end' => '12:00:00',
                'subject' => 'WMN (combined w/ DS+AI)',
                'teacher' => 'Dr. Sanehi',
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
                'subject' => 'DEC-II: Cloud Computing (G1+G2)',
                'teacher' => 'Dr. Vivek Dabra',
                'room' => 'L22',
            ],
            [
                'day' => 3,
                'period' => 8,
                'start' => '15:00:00',
                'end' => '16:00:00',
                'subject' => 'Open Elective labs',
                'teacher' => 'Respective Dept',
                'room' => 'Respective Dept labs',
            ],
            [
                'day' => 3,
                'period' => 9,
                'start' => '16:00:00',
                'end' => '17:00:00',
                'subject' => 'CSP7001 Major Project / CSM1004 MSC Project',
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
                'subject' => 'Lab: Cloud Computing (G1+G2) / DIP Lab',
                'teacher' => 'Dr. Vivek Dabra / Dr. Nitin Kumar',
                'room' => 'DS Lab / CL13+CL14',
            ],
            [
                'day' => 4,
                'period' => 3,
                'start' => '10:00:00',
                'end' => '12:00:00',
                'subject' => 'WMN Lab (combined w/ DS+AI)',
                'teacher' => 'Dr. Sanehi',
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
                'subject' => 'DEC-I: Deep Learning (G1+G2)',
                'teacher' => 'Dr. Navdeep',
                'room' => 'L21',
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
                'subject' => 'OE-II (respective dept) / OE-II DAIR',
                'teacher' => 'Respective Dept / Dr. Amanjot + Dr. Suraj',
                'room' => 'Respective dept classrooms / L19+407',
            ],
            [
                'day' => 5,
                'period' => 3,
                'start' => '10:00:00',
                'end' => '12:00:00',
                'subject' => 'OE-I Tute/Practical / CSP7001 Major Project (CSM1004 MSC)',
                'teacher' => 'Respective Dept',
                'room' => 'Respective dept tute rooms/labs',
            ],
            [
                'day' => 5,
                'period' => 5,
                'start' => '12:00:00',
                'end' => '13:00:00',
                'subject' => 'HSM III G3 / DEC-II: DIP (combined w/ DS)',
                'teacher' => 'Humanities Dept / Dr. Nitin Kumar',
                'room' => 'L26-L29 / 406',
            ],
            [
                'day' => 5,
                'period' => 7,
                'start' => '14:00:00',
                'end' => '16:00:00',
                'subject' => 'OE-II Tute/Practical / OE-II DAIR LAB / CSP7001 Major Project',
                'teacher' => 'Dr. Suraj, Dr. Neeraj, Amanjot',
                'room' => '301+303+306+304 / Dept Labs',
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
            $this->seedSlot($cseClass->id, $slot);
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
