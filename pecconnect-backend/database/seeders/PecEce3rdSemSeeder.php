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

        // 2. Create ECE Class Groups
        $eceGroup1 = CourseClass::updateOrCreate(
            ['branch_id' => $ece->id, 'year' => 2, 'group_name' => 'ECE - G1 (Roll 1-60)'],
            ['cr_user_id' => null]
        );

        $eceGroup2 = CourseClass::updateOrCreate(
            ['branch_id' => $ece->id, 'year' => 2, 'group_name' => 'ECE - G2 (Roll 61 Onwards)'],
            ['cr_user_id' => null]
        );

        // 3. Clear existing timetables for these groups to prevent duplicates if re-run
        Timetable::whereIn('class_id', [$eceGroup1->id, $eceGroup2->id])->delete();

        // ==========================================
        // SEED ECE TIMETABLE (G1)
        // ==========================================
        $scheduleG1 = [
            // MONDAY
            ['day' => 1, 'period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'EXN303 Probability (Lecture)', 'teacher' => 'Dr. Satinder', 'room' => 'L-23'],
            ['day' => 1, 'period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'EXN302 EDC (Lecture)', 'teacher' => 'Dr. J. Kedia', 'room' => 'L-20'],
            ['day' => 1, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'EXN304 Circuit Theory (Tutorial - G2)', 'teacher' => 'Lovepreet Singh', 'room' => 'T-9'],
            ['day' => 1, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'EXN301 DLD (Lecture)', 'teacher' => 'Dr. D. Dhawan', 'room' => 'L-24'],
            ['day' => 1, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'EXN303 Probability (Tutorial - G3)', 'teacher' => 'Dr. Satinder', 'room' => 'T-9'],
            ['day' => 1, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'EXN304 Circuit Theory (Tutorial - G1)', 'teacher' => 'Lovepreet Singh', 'room' => 'L-25'],
            ['day' => 1, 'period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'HSM (Lecture)', 'teacher' => 'Humanities Dept', 'room' => 'L-20 & L-23'],
            ['day' => 1, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'Minor Specialization', 'teacher' => 'MSC Dept', 'room' => 'TBA'],

            // TUESDAY
            ['day' => 2, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'HSM (Lecture)', 'teacher' => 'Humanities Dept', 'room' => 'L-20 & L-23'],
            ['day' => 2, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'EXN304 Circuit Theory (Lecture)', 'teacher' => 'Lovepreet Singh', 'room' => 'L-24'],
            ['day' => 2, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'EXN302 EDC (Lab - G3)', 'teacher' => 'Dr. J. Kedia', 'room' => 'Lab 1'],
            ['day' => 2, 'period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'EXN302 EDC (Lab - G3)', 'teacher' => 'Dr. J. Kedia', 'room' => 'Lab 1'],
            ['day' => 2, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'EXN301 DLD (Lab - G1)', 'teacher' => 'Dr. D. Dhawan', 'room' => 'Lab 2'],
            ['day' => 2, 'period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'EXN301 DLD (Lab - G1)', 'teacher' => 'Dr. D. Dhawan', 'room' => 'Lab 2'],
            ['day' => 2, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'EXN303 Probability (Tutorial - G2)', 'teacher' => 'Dr. Satinder', 'room' => 'T-9'],
            ['day' => 2, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'Minor Specialization', 'teacher' => 'MSC Dept', 'room' => 'TBA'],

            // WEDNESDAY
            ['day' => 3, 'period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'EXN303 Probability (Tutorial - G1)', 'teacher' => 'Dr. Satinder', 'room' => 'Lab-8'],
            ['day' => 3, 'period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'EXN302 EDC (Lab - G2)', 'teacher' => 'Dr. Radhika', 'room' => 'Lab 1'],
            ['day' => 3, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'EXN302 EDC (Lab - G2)', 'teacher' => 'Dr. Radhika', 'room' => 'Lab 1'],
            ['day' => 3, 'period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'EXN301 DLD (Lab - G3)', 'teacher' => 'Dr. D. Dhawan', 'room' => 'Lab 2'],
            ['day' => 3, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'EXN301 DLD (Lab - G3)', 'teacher' => 'Dr. D. Dhawan', 'room' => 'Lab 2'],
            ['day' => 3, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'EXN304 Circuit Theory (Lecture)', 'teacher' => 'Lovepreet Singh', 'room' => 'L-20'],
            ['day' => 3, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'HSM (Tutorial)', 'teacher' => 'Humanities Dept', 'room' => 'TBA'],
            ['day' => 3, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'Minor Specialization', 'teacher' => 'MSC Dept', 'room' => 'TBA'],

            // THURSDAY
            ['day' => 4, 'period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'EXN303 Probability (Lecture)', 'teacher' => 'Dr. Satinder', 'room' => 'L-23'],
            ['day' => 4, 'period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'EXN302 EDC (Lecture)', 'teacher' => 'Dr. J. Kedia', 'room' => 'L-24'],
            ['day' => 4, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'EXN301 DLD (Lecture)', 'teacher' => 'Dr. D. Dhawan', 'room' => 'L-24'],
            ['day' => 4, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'EXN304 Circuit Theory (Tutorial - G3)', 'teacher' => 'Lovepreet Singh', 'room' => 'L-25'],
            ['day' => 4, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'EXN302 EDC (Lab - G1)', 'teacher' => 'Dr. J. Kedia', 'room' => 'Lab 1'],
            ['day' => 4, 'period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'EXN302 EDC (Lab - G1)', 'teacher' => 'Dr. J. Kedia', 'room' => 'Lab 1'],
            ['day' => 4, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'EXN301 DLD (Lab - G2)', 'teacher' => 'Dr. D. Dhawan', 'room' => 'Lab 2'],
            ['day' => 4, 'period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'EXN301 DLD (Lab - G2)', 'teacher' => 'Dr. D. Dhawan', 'room' => 'Lab 2'],
            ['day' => 4, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'HSM (Tutorial)', 'teacher' => 'Humanities Dept', 'room' => 'TBA'],

            // FRIDAY
            ['day' => 5, 'period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'EXN303 Probability (Lecture)', 'teacher' => 'Dr. Satinder', 'room' => 'L-23'],
            ['day' => 5, 'period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'EXN304 Circuit Theory (Lecture)', 'teacher' => 'Lovepreet Singh', 'room' => 'L-24'],
            ['day' => 5, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'EXN301 DLD (Lecture)', 'teacher' => 'Dr. D. Dhawan', 'room' => 'L-24'],
            ['day' => 5, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'EXN302 EDC (Lecture)', 'teacher' => 'Dr. J. Kedia', 'room' => 'L-24'],
            ['day' => 5, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'HSM (Tutorial)', 'teacher' => 'Humanities Dept', 'room' => 'TBA'],
            ['day' => 5, 'period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'Minor Specialization', 'teacher' => 'MSC Dept', 'room' => 'TBA'],
        ];

        // ==========================================
        // SEED ECE TIMETABLE (G2)
        // ==========================================
        $scheduleG2 = [
            // MONDAY
            ['day' => 1, 'period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'EXN304 Circuit Theory (Lecture)', 'teacher' => 'Lovepreet Singh', 'room' => 'L-25'],
            ['day' => 1, 'period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'EXN303 Probability (Lecture)', 'teacher' => 'Dr. Satinder', 'room' => 'L-23'],
            ['day' => 1, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'EXN301 DLD (Lecture)', 'teacher' => 'Dr. D. Dhawan', 'room' => 'L-24'],
            ['day' => 1, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'EXN304 Circuit Theory (Tutorial - G4)', 'teacher' => 'Lovepreet Singh', 'room' => 'T-9'],
            ['day' => 1, 'period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'HSM (Lecture)', 'teacher' => 'Humanities Dept', 'room' => 'L-20 & L-23'],
            ['day' => 1, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'Minor Specialization', 'teacher' => 'MSC Dept', 'room' => 'TBA'],

            // TUESDAY
            ['day' => 2, 'period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'EXN303 Probability (Lecture)', 'teacher' => 'Dr. Satinder', 'room' => 'L-23'],
            ['day' => 2, 'period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'EXN302 EDC (Lecture)', 'teacher' => 'Dr. J. Kedia', 'room' => 'L-25'],
            ['day' => 2, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'HSM (Lecture)', 'teacher' => 'Humanities Dept', 'room' => 'L-20 & L-23'],
            ['day' => 2, 'period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'EXN303 Probability (Tutorial - G6)', 'teacher' => 'Dr. Satinder', 'room' => 'L-24'],
            ['day' => 2, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'Minor Specialization', 'teacher' => 'MSC Dept', 'room' => 'TBA'],

            // WEDNESDAY
            ['day' => 3, 'period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'EXN304 Circuit Theory (Lecture)', 'teacher' => 'Lovepreet Singh', 'room' => 'L-25'],
            ['day' => 3, 'period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'EXN303 Probability (Lecture)', 'teacher' => 'Dr. Satinder', 'room' => 'L-23'],
            ['day' => 3, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'EXN302 EDC (Lecture)', 'teacher' => 'Dr. J. Kedia', 'room' => 'L-24'],
            ['day' => 3, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'EXN301 DLD (Lecture)', 'teacher' => 'Dr. D. Dhawan', 'room' => 'L-24'],
            ['day' => 3, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'HSM (Tutorial)', 'teacher' => 'Humanities Dept', 'room' => 'TBA'],
            ['day' => 3, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'EXN302 EDC (Lab - G4)', 'teacher' => 'Dr. J. Kedia', 'room' => 'Lab 1'],
            ['day' => 3, 'period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'EXN302 EDC (Lab - G4)', 'teacher' => 'Dr. J. Kedia', 'room' => 'Lab 1'],
            ['day' => 3, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'EXN301 DLD (Lab - G5)', 'teacher' => 'Dr. Neelam', 'room' => 'Lab 2'],
            ['day' => 3, 'period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'EXN301 DLD (Lab - G5)', 'teacher' => 'Dr. Neelam', 'room' => 'Lab 2'],
            ['day' => 3, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'Minor Specialization', 'teacher' => 'MSC Dept', 'room' => 'TBA'],

            // THURSDAY
            ['day' => 4, 'period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'EXN302 EDC (Lab - G5)', 'teacher' => 'Dr. Sukhwinder Singh', 'room' => 'Lab 1'],
            ['day' => 4, 'period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'EXN302 EDC (Lab - G5)', 'teacher' => 'Dr. Sukhwinder Singh', 'room' => 'Lab 1'],
            ['day' => 4, 'period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'EXN301 DLD (Lab - G6)', 'teacher' => 'Dr. Jasbir Kaur', 'room' => 'Lab 2'],
            ['day' => 4, 'period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'EXN301 DLD (Lab - G6)', 'teacher' => 'Dr. Jasbir Kaur', 'room' => 'Lab 2'],
            ['day' => 4, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'EXN301 DLD (Lecture)', 'teacher' => 'Dr. D. Dhawan', 'room' => 'L-24'],
            ['day' => 4, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'EXN302 EDC (Lecture)', 'teacher' => 'Dr. J. Kedia', 'room' => 'L-25'],
            ['day' => 4, 'period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'EXN304 Circuit Theory (Tutorial - G5)', 'teacher' => 'Lovepreet Singh', 'room' => 'L-25'],
            ['day' => 4, 'period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'HSM (Tutorial)', 'teacher' => 'Humanities Dept', 'room' => 'TBA'],

            // FRIDAY
            ['day' => 5, 'period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'EXN302 EDC (Lab - G6)', 'teacher' => 'Dr. J. Kedia', 'room' => 'Lab 1'],
            ['day' => 5, 'period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'EXN302 EDC (Lab - G6)', 'teacher' => 'Dr. J. Kedia', 'room' => 'Lab 1'],
            ['day' => 5, 'period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'EXN301 DLD (Lab - G4)', 'teacher' => 'Dr. D. Dhawan', 'room' => 'Lab 2'],
            ['day' => 5, 'period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'EXN301 DLD (Lab - G4)', 'teacher' => 'Dr. D. Dhawan', 'room' => 'Lab 2'],
            ['day' => 5, 'period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'EXN303 Probability (Tutorial - G5)', 'teacher' => 'Dr. Satinder', 'room' => 'T-9'],
            ['day' => 5, 'period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'EXN304 Circuit Theory (Lecture)', 'teacher' => 'Lovepreet Singh', 'room' => 'L-20'],
            ['day' => 5, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'EXN303 Probability (Tutorial - G4)', 'teacher' => 'Dr. Satinder', 'room' => 'Lab-6'],
            ['day' => 5, 'period' => 5, 'start' => '12:00:00', 'end' => '13:00:00', 'subject' => 'EXN304 Circuit Theory (Tutorial - G6)', 'teacher' => 'Lovepreet Singh', 'room' => 'L-25'],
            ['day' => 5, 'period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'HSM (Tutorial)', 'teacher' => 'Humanities Dept', 'room' => 'TBA'],
            ['day' => 5, 'period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'Minor Specialization', 'teacher' => 'MSC Dept', 'room' => 'TBA'],
        ];

        foreach ($scheduleG1 as $slot) {
            $this->seedSlot($eceGroup1->id, $slot);
        }
        foreach ($scheduleG2 as $slot) {
            $this->seedSlot($eceGroup2->id, $slot);
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
