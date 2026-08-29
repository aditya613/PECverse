<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\CourseClass;
use App\Models\Timetable;
use Illuminate\Database\Seeder;

class PecMech3rdSemSeeder extends Seeder
{
    public function run(): void
    {
        // Ensure Mechanical branch exists
        $branch = Branch::firstOrCreate(
            ['code' => 'ME'],
            ['name' => 'Mechanical Engineering']
        );

        // ----------------------------------------------------
        // G1 CLASS SEEDING (Roll 1-60)
        // ----------------------------------------------------
        $mechClassG1 = CourseClass::firstOrCreate([
            'branch_id' => $branch->id,
            'year' => 2,
            'group_name' => 'Mechanical - G1 (Roll 1-60)',
        ]);

        $scheduleG1 = [
            // MONDAY
            ['day' => 1, 'start' => '09:00:00', 'end' => '11:00:00', 'subject' => 'Fluid Mechanics (Lab - M1)', 'teacher' => 'TBA', 'room' => 'FM lab/T6'],
            ['day' => 1, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'Mechanics of Material (Tutorial - M2)', 'teacher' => 'TBA', 'room' => 'T16'],
            ['day' => 1, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'Kinematics of Machine (Lecture)', 'teacher' => 'TBA', 'room' => 'L7'],
            ['day' => 1, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'Fluid Mechanics (Lecture)', 'teacher' => 'TBA', 'room' => 'L7'],
            ['day' => 1, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'Elements of Thermo (Tutorial - M2)', 'teacher' => 'TBA', 'room' => 'L7'],
            ['day' => 1, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'Kinematics of Machine (Tutorial - M1)', 'teacher' => 'TBA', 'room' => 'L6'],
            ['day' => 1, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'Minor Specialization', 'teacher' => 'MSC Dept', 'room' => 'TBA'],

            // TUESDAY
            ['day' => 2, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'Elements of Thermo (Lecture)', 'teacher' => 'TBA', 'room' => 'L6'],
            ['day' => 2, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'Physical Metallurgy (Lecture)', 'teacher' => 'TBA', 'room' => 'L5'],
            ['day' => 2, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'Elements of Manuf (Lecture)', 'teacher' => 'TBA', 'room' => 'L7'],
            ['day' => 2, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'Elements of Thermo (Tutorial - M3)', 'teacher' => 'TBA', 'room' => 'L6'],
            ['day' => 2, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'Mechanics of Material (Tutorial - M1)', 'teacher' => 'TBA', 'room' => 'T16'],
            ['day' => 2, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'Minor Specialization', 'teacher' => 'MSC Dept', 'room' => 'TBA'],

            // WEDNESDAY
            ['day' => 3, 'start' => '09:00:00', 'end' => '11:00:00', 'subject' => 'Fluid Mechanics (Lab - M3)', 'teacher' => 'TBA', 'room' => 'FM lab/T6'],
            ['day' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'Kinematics of Machine (Tutorial - M2)', 'teacher' => 'TBA', 'room' => 'T16'],
            ['day' => 3, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'Mechanics of Material (Lecture)', 'teacher' => 'TBA', 'room' => 'L26'],
            ['day' => 3, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'Physical Metallurgy (Lecture)', 'teacher' => 'TBA', 'room' => 'L6'],
            ['day' => 3, 'start' => '14:00:00', 'end' => '16:00:00', 'subject' => 'Elements of Manuf (Lab - M2)', 'teacher' => 'TBA', 'room' => 'TBA'],
            ['day' => 3, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'Kinematics of Machine (Tutorial - M3)', 'teacher' => 'TBA', 'room' => 'T6'],
            ['day' => 3, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'Minor Specialization', 'teacher' => 'MSC Dept', 'room' => 'TBA'],

            // THURSDAY
            ['day' => 4, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'Elements of Manuf (Lecture)', 'teacher' => 'TBA', 'room' => 'L6'],
            ['day' => 4, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'Kinematics of Machine (Lecture)', 'teacher' => 'TBA', 'room' => 'L6'],
            ['day' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'Mechanics of Material (Lecture)', 'teacher' => 'TBA', 'room' => 'L15'],
            ['day' => 4, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'Elements of Thermo (Lecture)', 'teacher' => 'TBA', 'room' => 'L6'],
            ['day' => 4, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'Fluid Mechanics (Lecture)', 'teacher' => 'TBA', 'room' => 'L7'],
            ['day' => 4, 'start' => '15:00:00', 'end' => '17:00:00', 'subject' => 'Elements of Manuf (Lab - M3)', 'teacher' => 'TBA', 'room' => 'TBA'],
            ['day' => 4, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'Elements of Thermo (Tutorial - M1)', 'teacher' => 'TBA', 'room' => 'L6'],

            // FRIDAY
            ['day' => 5, 'start' => '09:00:00', 'end' => '11:00:00', 'subject' => 'Elements of Manuf (Lab - M1)', 'teacher' => 'TBA', 'room' => 'TBA'],
            ['day' => 5, 'start' => '09:00:00', 'end' => '11:00:00', 'subject' => 'Fluid Mechanics (Lab - M2)', 'teacher' => 'TBA', 'room' => 'FM lab/T6'],
            ['day' => 5, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'Mechanics of Material (Tutorial - M3)', 'teacher' => 'TBA', 'room' => 'T16'],
            ['day' => 5, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'Physical Metallurgy (Lecture)', 'teacher' => 'TBA', 'room' => 'L5'],
            ['day' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'Elements of Thermo (Lecture)', 'teacher' => 'TBA', 'room' => 'L6'],
            ['day' => 5, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'Elements of Manuf (Lecture)', 'teacher' => 'TBA', 'room' => 'L6'],
            ['day' => 5, 'start' => '15:00:00', 'end' => '17:00:00', 'subject' => 'Minor Specialization', 'teacher' => 'MSC Dept', 'room' => 'TBA'],
        ];

        Timetable::where('class_id', $mechClassG1->id)->delete();
        foreach ($scheduleG1 as $slot) {
            Timetable::create([
                'class_id' => $mechClassG1->id,
                'type' => 'weekly',
                'day_of_week' => $slot['day'],
                'start_time' => $slot['start'],
                'end_time' => $slot['end'],
                'subject' => $slot['subject'],
                'teacher' => $slot['teacher'],
                'room' => $slot['room'],
            ]);
        }

        // ----------------------------------------------------
        // G2 CLASS SEEDING (SID 61-120)
        // ----------------------------------------------------
        $mechClassG2 = CourseClass::firstOrCreate([
            'branch_id' => $branch->id,
            'year' => 2,
            'group_name' => 'MECH G2 (SID 61-120)',
        ]);

        $scheduleG2 = [
            // ================= MONDAY =================
            ['day' => 1, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'THERMO-L', 'teacher' => 'TBA', 'room' => 'L7'],
            ['day' => 1, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'HEAT TR-L', 'teacher' => 'TBA', 'room' => 'L7'],
            ['day' => 1, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'THERMO-T (SID 61-80)', 'teacher' => 'TBA', 'room' => 'L6'],
            ['day' => 1, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'FM-L', 'teacher' => 'TBA', 'room' => 'L5'],

            // ================= TUESDAY =================
            ['day' => 2, 'start' => '09:00:00', 'end' => '11:00:00', 'subject' => 'FM LAB/T (SID 81-100)', 'teacher' => 'TBA', 'room' => '-'],
            ['day' => 2, 'start' => '09:00:00', 'end' => '11:00:00', 'subject' => 'EMP WS (SID 101-120)', 'teacher' => 'TBA', 'room' => '-'],
            ['day' => 2, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'MOM-T (SID 61-80)', 'teacher' => 'TBA', 'room' => 'T16'],
            
            ['day' => 2, 'start' => '11:00:00', 'end' => '13:00:00', 'subject' => 'FM LAB/T (SID 61-80)', 'teacher' => 'TBA', 'room' => '-'],
            ['day' => 2, 'start' => '11:00:00', 'end' => '13:00:00', 'subject' => 'EMP WS (SID 81-100)', 'teacher' => 'TBA', 'room' => '-'],
            ['day' => 2, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'KOM-T (SID 101-120)', 'teacher' => 'TBA', 'room' => 'T6'],

            ['day' => 2, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'KOM-L', 'teacher' => 'TBA', 'room' => 'L5'],
            ['day' => 2, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'EMP-L', 'teacher' => 'TBA', 'room' => 'L7'],
            ['day' => 2, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'MINOR', 'teacher' => 'TBA', 'room' => '-'],

            // ================= WEDNESDAY =================
            ['day' => 3, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'EMP-L', 'teacher' => 'TBA', 'room' => 'L7'],
            ['day' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'THERMO-L', 'teacher' => 'TBA', 'room' => 'L7'],
            ['day' => 3, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'MOM-L', 'teacher' => 'TBA', 'room' => 'L5'],
            ['day' => 3, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'FM-L', 'teacher' => 'TBA', 'room' => 'L5'],
            ['day' => 3, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'HEAT TR-L', 'teacher' => 'TBA', 'room' => 'L5'],
            
            ['day' => 3, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'KOM-T (SID 61-80)', 'teacher' => 'TBA', 'room' => 'L6'],
            ['day' => 3, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'THERMO-T (SID 81-100)', 'teacher' => 'TBA', 'room' => 'L7'],
            ['day' => 3, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'MOM-T (SID 101-120)', 'teacher' => 'TBA', 'room' => 'T16'],
            
            ['day' => 3, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'MINOR', 'teacher' => 'TBA', 'room' => '-'],

            // ================= THURSDAY =================
            ['day' => 4, 'start' => '09:00:00', 'end' => '11:00:00', 'subject' => 'EMP WS (SID 61-80)', 'teacher' => 'TBA', 'room' => '-'],
            ['day' => 4, 'start' => '09:00:00', 'end' => '11:00:00', 'subject' => 'FM LAB/T (SID 101-120)', 'teacher' => 'TBA', 'room' => '-'],
            ['day' => 4, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'KOM-T (SID 81-100)', 'teacher' => 'TBA', 'room' => 'T16'],
            
            ['day' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'MOM-L', 'teacher' => 'TBA', 'room' => 'L7'],
            ['day' => 4, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'THERMO-L', 'teacher' => 'TBA', 'room' => 'L6'],
            ['day' => 4, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'EMP-L', 'teacher' => 'TBA', 'room' => 'L7'],

            // ================= FRIDAY =================
            ['day' => 5, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'EMP-L', 'teacher' => 'TBA', 'room' => 'L7'],
            ['day' => 5, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'KOM-L', 'teacher' => 'TBA', 'room' => 'L7'],
            ['day' => 5, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'MOM-T (SID 81-100)', 'teacher' => 'TBA', 'room' => 'T16'],
            ['day' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'HEAT TR-L', 'teacher' => 'TBA', 'room' => 'L7'],
            
            ['day' => 5, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'MINOR (SID 61-100)', 'teacher' => 'TBA', 'room' => '-'],
            ['day' => 5, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'THERMO-T (SID 101-120)', 'teacher' => 'TBA', 'room' => 'L5'],
            
            // MINOR for everyone from 3 PM to 5 PM
            ['day' => 5, 'start' => '15:00:00', 'end' => '17:00:00', 'subject' => 'MINOR', 'teacher' => 'TBA', 'room' => '-'],
        ];

        Timetable::where('class_id', $mechClassG2->id)->delete();
        foreach ($scheduleG2 as $slot) {
            Timetable::create([
                'class_id' => $mechClassG2->id,
                'type' => 'weekly',
                'day_of_week' => $slot['day'],
                'start_time' => $slot['start'],
                'end_time' => $slot['end'],
                'subject' => $slot['subject'],
                'teacher' => $slot['teacher'],
                'room' => $slot['room'],
            ]);
        }
    }
}
