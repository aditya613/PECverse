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
        // G2 CLASS SEEDING (Roll 61-120 / M4, M5, M6)
        // ----------------------------------------------------
        $mechClassG2 = CourseClass::where('branch_id', $branch->id)
            ->where('year', 2)
            ->where(function ($q) {
                $q->where('group_name', 'Mechanical - G2 (Roll 61-120)')
                  ->orWhere('group_name', 'MECH G2 (SID 61-120)');
            })->first();

        if (!$mechClassG2) {
            $mechClassG2 = CourseClass::create([
                'branch_id' => $branch->id,
                'year' => 2,
                'group_name' => 'Mechanical - G2 (Roll 61-120)',
            ]);
        } else {
            $mechClassG2->update(['group_name' => 'Mechanical - G2 (Roll 61-120)']);
        }

        $scheduleG2 = [
            // ================= MONDAY =================
            ['day' => 1, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'Elements of Thermo (Lecture)', 'teacher' => 'TBA', 'room' => 'L7'],
            ['day' => 1, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'Physical Metallurgy & Heat Treatment (Lecture)', 'teacher' => 'TBA', 'room' => 'L7'],
            ['day' => 1, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'Elements of Thermo (Tutorial - M4)', 'teacher' => 'TBA', 'room' => 'L7'],
            ['day' => 1, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'Fluid Mechanics (Lecture)', 'teacher' => 'TBA', 'room' => 'L5'],
            ['day' => 1, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'Minor Specialization', 'teacher' => 'MSC Dept', 'room' => 'TBA'],

            // ================= TUESDAY =================
            ['day' => 2, 'start' => '09:00:00', 'end' => '11:00:00', 'subject' => 'Fluid Mechanics (Lab - M5)', 'teacher' => 'TBA', 'room' => 'FM Lab/T6'],
            ['day' => 2, 'start' => '09:00:00', 'end' => '11:00:00', 'subject' => 'Elements of Manuf (Lab/WS - M6)', 'teacher' => 'TBA', 'room' => 'WS/Lab'],
            ['day' => 2, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'Mechanics of Material (Tutorial - M4)', 'teacher' => 'TBA', 'room' => 'T16'],
            ['day' => 2, 'start' => '11:00:00', 'end' => '13:00:00', 'subject' => 'Fluid Mechanics (Lab - M4)', 'teacher' => 'TBA', 'room' => 'FM Lab/T6'],
            ['day' => 2, 'start' => '11:00:00', 'end' => '13:00:00', 'subject' => 'Elements of Manuf (Lab/WS - M5)', 'teacher' => 'TBA', 'room' => 'WS/Lab'],
            ['day' => 2, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'Kinematics of Machine (Tutorial - M6)', 'teacher' => 'TBA', 'room' => 'T6'],
            ['day' => 2, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'Kinematics of Machine (Lecture)', 'teacher' => 'TBA', 'room' => 'L5'],
            ['day' => 2, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'Elements of Manuf (Lecture)', 'teacher' => 'TBA', 'room' => 'L7'],
            ['day' => 2, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'Minor Specialization', 'teacher' => 'MSC Dept', 'room' => 'TBA'],

            // ================= WEDNESDAY =================
            ['day' => 3, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'Elements of Manuf (Lecture)', 'teacher' => 'TBA', 'room' => 'L7'],
            ['day' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'Elements of Thermo (Lecture)', 'teacher' => 'TBA', 'room' => 'L7'],
            ['day' => 3, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'Mechanics of Material (Lecture)', 'teacher' => 'TBA', 'room' => 'L26'],
            ['day' => 3, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'Physical Metallurgy & Heat Treatment (Lecture)', 'teacher' => 'TBA', 'room' => 'L5'],
            ['day' => 3, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'Kinematics of Machine (Tutorial - M4)', 'teacher' => 'TBA', 'room' => 'L6'],
            ['day' => 3, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'Elements of Thermo (Tutorial - M5)', 'teacher' => 'TBA', 'room' => 'L7'],
            ['day' => 3, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'Mechanics of Material (Tutorial - M6)', 'teacher' => 'TBA', 'room' => 'T16'],
            ['day' => 3, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'Minor Specialization', 'teacher' => 'MSC Dept', 'room' => 'TBA'],

            // ================= THURSDAY =================
            ['day' => 4, 'start' => '09:00:00', 'end' => '11:00:00', 'subject' => 'Elements of Manuf (Lab/WS - M4)', 'teacher' => 'TBA', 'room' => 'WS/Lab'],
            ['day' => 4, 'start' => '09:00:00', 'end' => '11:00:00', 'subject' => 'Fluid Mechanics (Lab - M6)', 'teacher' => 'TBA', 'room' => 'FM Lab/T6'],
            ['day' => 4, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'Kinematics of Machine (Tutorial - M5)', 'teacher' => 'TBA', 'room' => 'T16'],
            ['day' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'Mechanics of Material (Lecture)', 'teacher' => 'TBA', 'room' => 'L15'],
            ['day' => 4, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'Fluid Mechanics (Lecture)', 'teacher' => 'TBA', 'room' => 'L6'],
            ['day' => 4, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'Elements of Thermo (Tutorial - M6)', 'teacher' => 'TBA', 'room' => 'L7'],

            // ================= FRIDAY =================
            ['day' => 5, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'Elements of Manuf (Lecture)', 'teacher' => 'TBA', 'room' => 'L7'],
            ['day' => 5, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'Physical Metallurgy & Heat Treatment (Lecture)', 'teacher' => 'TBA', 'room' => 'L7'],
            ['day' => 5, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'Mechanics of Material (Tutorial - M5)', 'teacher' => 'TBA', 'room' => 'T16'],
            ['day' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'Elements of Thermo (Lecture)', 'teacher' => 'TBA', 'room' => 'L7'],
            ['day' => 5, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'Kinematics of Machine (Lecture)', 'teacher' => 'TBA', 'room' => 'L5'],
            ['day' => 5, 'start' => '15:00:00', 'end' => '17:00:00', 'subject' => 'Minor Specialization', 'teacher' => 'MSC Dept', 'room' => 'TBA'],
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
