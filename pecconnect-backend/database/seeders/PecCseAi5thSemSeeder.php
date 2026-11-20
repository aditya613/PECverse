<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\CourseClass;
use App\Models\Timetable;
use Illuminate\Database\Seeder;

class PecCseAi5thSemSeeder extends Seeder
{
    /**
     * Run database seeds for B.Tech CSE (AI) 5th Semester Timetable (Session 26271, w.e.f. 9/10/2026).
     */
    public function run(): void
    {
        // 1. Ensure CSE-AI Branch exists
        $aiBranch = Branch::updateOrCreate(
            ['code' => 'CSE-AI'],
            ['name' => 'Computer Science & Engineering (AI)']
        );

        // 2. Create class for 5th Sem CSE (AI)
        $aiClass = CourseClass::updateOrCreate(
            ['branch_id' => $aiBranch->id, 'year' => 3, 'group_name' => 'CSE (AI) 5th Sem'],
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
                'period' => 2,
                'start' => '09:00:00',
                'end' => '11:00:00',
                'subject' => 'AIH1001- Honours Project-I',
                'teacher' => 'Dept Faculty',
                'room' => 'Dept Labs',
            ],
            [
                'day' => 1,
                'period' => 4,
                'start' => '11:00:00',
                'end' => '13:00:00',
                'subject' => 'AIN5002 DL Lab (AI2) CL5 / AIN5004 CN Lab (AI1) CL13',
                'teacher' => 'Dr. Padmavati / Dr. Divya Bansal, Pooja',
                'room' => 'CL5 / CL13',
            ],
            [
                'day' => 1,
                'period' => 7,
                'start' => '14:00:00',
                'end' => '15:00:00',
                'subject' => 'AIN5001 TOC (L)',
                'teacher' => 'Dr. Ravpreet',
                'room' => 'L406',
            ],
            [
                'day' => 1,
                'period' => 8,
                'start' => '15:00:00',
                'end' => '16:00:00',
                'subject' => 'AIN5002 DL',
                'teacher' => 'Dr. Padmavati',
                'room' => 'L406',
            ],
            [
                'day' => 1,
                'period' => 9,
                'start' => '16:00:00',
                'end' => '17:00:00',
                'subject' => 'MSC L (AIM1003 HMI)',
                'teacher' => 'Dr. Alka Jindal',
                'room' => 'L406',
            ],

            // ==========================================
            // TUESDAY (Day 2)
            // ==========================================
            [
                'day' => 2,
                'period' => 2,
                'start' => '09:00:00',
                'end' => '10:00:00',
                'subject' => 'AIN5003 HMI',
                'teacher' => 'Dr. Alka Jindal',
                'room' => 'L406',
            ],
            [
                'day' => 2,
                'period' => 3,
                'start' => '10:00:00',
                'end' => '11:00:00',
                'subject' => 'AIN5004 CN',
                'teacher' => 'Dr. Divya Bansal, Pooja',
                'room' => 'L406',
            ],
            [
                'day' => 2,
                'period' => 4,
                'start' => '11:00:00',
                'end' => '13:00:00',
                'subject' => 'AIN5003 HMI Lab (AI2) CL14 / AIN5002 DL Lab (AI1) CL13',
                'teacher' => 'Dr. Alka Jindal / Dr. Padmavati',
                'room' => 'CL14 / CL13',
            ],
            [
                'day' => 2,
                'period' => 7,
                'start' => '14:00:00',
                'end' => '16:00:00',
                'subject' => 'AIP5101- Minor Project',
                'teacher' => 'Dept Faculty',
                'room' => 'Dept Labs',
            ],
            [
                'day' => 2,
                'period' => 9,
                'start' => '16:00:00',
                'end' => '17:00:00',
                'subject' => 'MSC L (AIM1003 HMI)',
                'teacher' => 'Dr. Alka Jindal',
                'room' => 'L406',
            ],

            // ==========================================
            // WEDNESDAY (Day 3)
            // ==========================================
            [
                'day' => 3,
                'period' => 2,
                'start' => '09:00:00',
                'end' => '10:00:00',
                'subject' => 'AIN5001 TOC (L)',
                'teacher' => 'Dr. Ravpreet',
                'room' => 'L21',
            ],
            [
                'day' => 3,
                'period' => 3,
                'start' => '10:00:00',
                'end' => '11:00:00',
                'subject' => 'AIN5002 DL',
                'teacher' => 'Dr. Padmavati',
                'room' => 'L19',
            ],
            [
                'day' => 3,
                'period' => 4,
                'start' => '11:00:00',
                'end' => '12:00:00',
                'subject' => 'AIN5003 HMI',
                'teacher' => 'Dr. Alka Jindal',
                'room' => 'L407',
            ],
            [
                'day' => 3,
                'period' => 5,
                'start' => '12:00:00',
                'end' => '13:00:00',
                'subject' => 'AIN5004 CN',
                'teacher' => 'Dr. Divya Bansal, Pooja',
                'room' => 'L406',
            ],
            [
                'day' => 3,
                'period' => 7,
                'start' => '14:00:00',
                'end' => '16:00:00',
                'subject' => 'AIH1001- Honours Project-I',
                'teacher' => 'Dept Faculty',
                'room' => 'Dept Labs',
            ],
            [
                'day' => 3,
                'period' => 9,
                'start' => '16:00:00',
                'end' => '17:00:00',
                'subject' => 'MSC L (AIM1003 HMI)',
                'teacher' => 'Dr. Alka Jindal',
                'room' => 'L406',
            ],

            // ==========================================
            // THURSDAY (Day 4)
            // ==========================================
            [
                'day' => 4,
                'period' => 1,
                'start' => '08:00:00',
                'end' => '09:00:00',
                'subject' => 'AIN5001 TOC (L) Backlog',
                'teacher' => 'Dr. Ravpreet',
                'room' => 'L407',
            ],
            [
                'day' => 4,
                'period' => 2,
                'start' => '09:00:00',
                'end' => '10:00:00',
                'subject' => 'AIN5001 TOC (L)',
                'teacher' => 'Dr. Ravpreet',
                'room' => 'L407',
            ],
            [
                'day' => 4,
                'period' => 3,
                'start' => '10:00:00',
                'end' => '11:00:00',
                'subject' => 'AIP5101- Minor Project',
                'teacher' => 'Dept Faculty',
                'room' => 'Dept Labs',
            ],
            [
                'day' => 4,
                'period' => 4,
                'start' => '11:00:00',
                'end' => '12:00:00',
                'subject' => 'AIN5001 TOC Tut (AI1+AI2)',
                'teacher' => 'Dr. Ravpreet',
                'room' => '402',
            ],
            [
                'day' => 4,
                'period' => 5,
                'start' => '12:00:00',
                'end' => '13:00:00',
                'subject' => 'AIN5002 DL',
                'teacher' => 'Dr. Padmavati',
                'room' => '305',
            ],
            [
                'day' => 4,
                'period' => 7,
                'start' => '14:00:00',
                'end' => '17:00:00',
                'subject' => 'AIP5101- Minor Project',
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
                'subject' => 'AIN5003 HMI',
                'teacher' => 'Dr. Alka Jindal',
                'room' => 'L406',
            ],
            [
                'day' => 5,
                'period' => 3,
                'start' => '10:00:00',
                'end' => '12:00:00',
                'subject' => 'AIN5004 CN Lab (AI2) 304 / AIN5003 HMI Lab (AI1) CL5',
                'teacher' => 'Dr. Divya Bansal, Pooja / Dr. Alka Jindal',
                'room' => '304 / CL5',
            ],
            [
                'day' => 5,
                'period' => 5,
                'start' => '12:00:00',
                'end' => '13:00:00',
                'subject' => 'AIN5004 CN',
                'teacher' => 'Dr. Divya Bansal, Pooja',
                'room' => '305',
            ],
            [
                'day' => 5,
                'period' => 7,
                'start' => '14:00:00',
                'end' => '15:00:00',
                'subject' => 'AIP5101- Minor Project',
                'teacher' => 'Dept Faculty',
                'room' => 'Dept Labs',
            ],
            [
                'day' => 5,
                'period' => 8,
                'start' => '15:00:00',
                'end' => '17:00:00',
                'subject' => 'MSC Lab (AIM1003 HMI)',
                'teacher' => 'Dr. Alka Jindal',
                'room' => 'L406',
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
