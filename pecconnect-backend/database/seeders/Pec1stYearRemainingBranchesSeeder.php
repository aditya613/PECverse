<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\CourseClass;
use App\Models\Timetable;
use Illuminate\Database\Seeder;

class Pec1stYearRemainingBranchesSeeder extends Seeder
{
    public function run(): void
    {
        // Define all branches
        $branches = [
            'AERO' => 'Aerospace Engineering',
            'M&C' => 'Mathematics and Computing',
            'ECE' => 'Electronics and Communication Engineering',
            'MECH' => 'Mechanical Engineering',
            'AI' => 'Artificial Intelligence',
            'VLSI' => 'VLSI Design',
            'METTA' => 'Metallurgical Engineering',
            'CIVIL' => 'Civil Engineering',
            'EE' => 'Electrical Engineering',
            'PROD' => 'Production Engineering',
            'DS' => 'Data Science',
            'BDES' => 'Bachelor of Design'
        ];

        foreach ($branches as $code => $name) {
            Branch::updateOrCreate(['code' => $code], ['name' => $name]);
        }

        $days = [
            1 => $this->getMondaySchedules(),
            2 => $this->getTuesdaySchedules(),
            3 => $this->getWednesdaySchedules(),
            4 => $this->getThursdaySchedules(),
            5 => $this->getFridaySchedules(),
        ];

        foreach ($days as $dayOfWeek => $branchesSchedules) {
            foreach ($branchesSchedules as $branchCode => $groups) {
                $branch = Branch::where('code', $branchCode)->first();
                if (!$branch) continue;

                foreach ($groups as $groupName => $slots) {
                    // Normalize group name
                    $fullGroupName = $groupName === 'ALL' ? "$branchCode" : "$branchCode - $groupName";
                    
                    $class = CourseClass::updateOrCreate(
                        ['branch_id' => $branch->id, 'year' => 1, 'group_name' => $fullGroupName],
                        ['cr_user_id' => null]
                    );

                    // Clear existing slots for this specific day to allow safe re-running
                    Timetable::where('class_id', $class->id)->where('day_of_week', $dayOfWeek)->delete();

                    foreach ($slots as $slot) {
                        $this->seedSlot($class->id, $slot, $dayOfWeek);
                    }
                }
            }
        }
    }

    private function getMondaySchedules(): array
    {
        return [
            'AERO' => [
                'ALL' => [
                    ['period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'ES2302', 'teacher' => 'TBD', 'room' => 'L-26'],
                    ['period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'ES2304', 'teacher' => 'TBD', 'room' => 'L-26'],
                    ['period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'MA2301', 'teacher' => 'TBD', 'room' => 'L-26'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '17:00:00', 'subject' => 'ES2302 LAB', 'teacher' => 'TBD', 'room' => 'DH-1'],
                ]
            ],
            'M&C' => [
                'ALL' => [
                    ['period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'ES2302', 'teacher' => 'TBD', 'room' => 'L-26'],
                    ['period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'ES2304', 'teacher' => 'TBD', 'room' => 'L-26'],
                    ['period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'MA2301', 'teacher' => 'TBD', 'room' => 'L-26'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '17:00:00', 'subject' => 'ES2302 LAB', 'teacher' => 'TBD', 'room' => 'DH-2'],
                ]
            ],
            'ECE' => [
                'G1' => [
                    ['period' => 1, 'start' => '08:00:00', 'end' => '11:00:00', 'subject' => 'ES2303 LAB G1', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '14:00:00', 'subject' => 'MA2301 G1', 'teacher' => 'TBD', 'room' => 'L-26'],
                    ['period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'CH2301 G1', 'teacher' => 'TBD', 'room' => 'L-26'],
                    ['period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'ES2304 G1', 'teacher' => 'TBD', 'room' => 'L-26'],
                ],
                'G2' => [
                    ['period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'CH2301 G2', 'teacher' => 'TBD', 'room' => 'L-11'],
                    ['period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'MA2301 G2', 'teacher' => 'TBD', 'room' => 'L-11'],
                    ['period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'ES2304 G2', 'teacher' => 'TBD', 'room' => 'L-11'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '17:00:00', 'subject' => 'ES2307 LAB G2', 'teacher' => 'TBD', 'room' => 'TBD'],
                ]
            ],
            'MECH' => [
                'G1' => [
                    ['period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'ES2304 G1', 'teacher' => 'TBD', 'room' => 'L-28'],
                    ['period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'ES2302 G1', 'teacher' => 'TBD', 'room' => 'L-28'],
                    ['period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'MA2301 G1', 'teacher' => 'TBD', 'room' => 'L-28'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '17:00:00', 'subject' => 'ES2302 LAB G1', 'teacher' => 'TBD', 'room' => 'DH-3, DH-4'],
                ],
                'G2' => [
                    ['period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'ES2304 G2', 'teacher' => 'TBD', 'room' => 'L-29'],
                    ['period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'ES2302 G2', 'teacher' => 'TBD', 'room' => 'L-29'],
                    ['period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'MA2301 G2', 'teacher' => 'TBD', 'room' => 'L-29'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '17:00:00', 'subject' => 'ES2307 LAB G2', 'teacher' => 'TBD', 'room' => 'TBD'],
                ]
            ],
            'AI' => [
                'ALL' => [
                    ['period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'OR2302', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 3, 'start' => '10:00:00', 'end' => '12:00:00', 'subject' => 'CH2301 LAB', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '14:00:00', 'subject' => 'ES2304', 'teacher' => 'TBD', 'room' => 'L-15'],
                    ['period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'CH2301', 'teacher' => 'TBD', 'room' => 'L-15'],
                    ['period' => 8, 'start' => '15:00:00', 'end' => '17:00:00', 'subject' => 'ES2304 LAB', 'teacher' => 'TBD', 'room' => 'TBD'],
                ]
            ],
            'VLSI' => [
                'ALL' => [
                    ['period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'OR2302', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 3, 'start' => '10:00:00', 'end' => '12:00:00', 'subject' => 'ES2304 LAB', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '14:00:00', 'subject' => 'ES2304', 'teacher' => 'TBD', 'room' => 'L-15'],
                    ['period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'CH2301', 'teacher' => 'TBD', 'room' => 'L-15'],
                    ['period' => 8, 'start' => '15:00:00', 'end' => '17:00:00', 'subject' => 'CH2301 LAB', 'teacher' => 'TBD', 'room' => 'TBD'],
                ]
            ],
            'METTA' => [
                'ALL' => [
                    ['period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'CH2302', 'teacher' => 'TBD', 'room' => 'L-10'],
                    ['period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'ES2304', 'teacher' => 'TBD', 'room' => 'L-10'],
                    ['period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'OR2302', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '17:00:00', 'subject' => 'ES2303 LAB', 'teacher' => 'TBD', 'room' => 'TBD'],
                ]
            ],
            'CIVIL' => [
                'G1' => [
                    ['period' => 3, 'start' => '10:00:00', 'end' => '12:00:00', 'subject' => 'PY2302 LAB F1', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '14:00:00', 'subject' => 'MA2301 G1', 'teacher' => 'TBD', 'room' => 'L-30'],
                    ['period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'PY2302 G1', 'teacher' => 'TBD', 'room' => 'L-30'],
                    ['period' => 8, 'start' => '15:00:00', 'end' => '17:00:00', 'subject' => 'ES2306 LAB F1 (F11)', 'teacher' => 'TBD', 'room' => 'TBD'],
                ],
                'G2' => [
                    ['period' => 3, 'start' => '10:00:00', 'end' => '12:00:00', 'subject' => 'MA2301 LAB G2', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '14:00:00', 'subject' => 'MA2301 G2', 'teacher' => 'TBD', 'room' => 'L-31'],
                    ['period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'PY2302 G2', 'teacher' => 'TBD', 'room' => 'L-31'],
                    ['period' => 8, 'start' => '15:00:00', 'end' => '17:00:00', 'subject' => 'ES2301 LAB F3', 'teacher' => 'TBD', 'room' => 'TBD'],
                ]
            ],
            'EE' => [
                'G1' => [
                    ['period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'ES2301 G1', 'teacher' => 'TBD', 'room' => 'L-30'],
                    ['period' => 3, 'start' => '10:00:00', 'end' => '12:00:00', 'subject' => 'HS2351 LAB G1', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '15:00:00', 'subject' => 'MA2301 LAB G1', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'HS2351 G1', 'teacher' => 'TBD', 'room' => 'L-30'],
                    ['period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'PY2301 G1', 'teacher' => 'TBD', 'room' => 'L-30'],
                ],
                'G2' => [
                    ['period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'ES2301 G2', 'teacher' => 'TBD', 'room' => 'L-31'],
                    ['period' => 3, 'start' => '10:00:00', 'end' => '12:00:00', 'subject' => 'ES2301 LAB F3', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '15:00:00', 'subject' => 'PY2301 LAB F3', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'HS2351 G2', 'teacher' => 'TBD', 'room' => 'L-31'],
                    ['period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'PY2301 G2', 'teacher' => 'TBD', 'room' => 'L-31'],
                ]
            ],
            'PROD' => [
                'ALL' => [
                    ['period' => 3, 'start' => '10:00:00', 'end' => '12:00:00', 'subject' => 'ES2306 LAB F1 (F11)', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '14:00:00', 'subject' => 'ES2306', 'teacher' => 'TBD', 'room' => 'L-28'],
                    ['period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'HS2351', 'teacher' => 'TBD', 'room' => 'L-28'],
                    ['period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'MA2301', 'teacher' => 'TBD', 'room' => 'L-15'],
                    ['period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'ES2301', 'teacher' => 'TBD', 'room' => 'L-15'],
                ]
            ],
            'DS' => [
                'ALL' => [
                    ['period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'GS2301', 'teacher' => 'TBD', 'room' => 'L-15'],
                    ['period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'OR2302', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'PY2301', 'teacher' => 'TBD', 'room' => 'L-30'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '14:00:00', 'subject' => 'ES2301', 'teacher' => 'TBD', 'room' => 'L-11'],
                    ['period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'ES2305', 'teacher' => 'TBD', 'room' => 'L-11'],
                    ['period' => 8, 'start' => '15:00:00', 'end' => '17:00:00', 'subject' => 'PY2301 LAB', 'teacher' => 'TBD', 'room' => 'TBD'],
                ]
            ],
            'BDES' => [
                'ALL' => [
                    ['period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'OR2302', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'HS2351', 'teacher' => 'TBD', 'room' => 'L-28'],
                ]
            ]
        ];
    }

    private function getTuesdaySchedules(): array
    {
        return [
            'AERO' => [
                'ALL' => [
                    ['period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'CH2302', 'teacher' => 'TBD', 'room' => 'L-10'],
                    ['period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'MA2301', 'teacher' => 'TBD', 'room' => 'L-10'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '15:00:00', 'subject' => 'ES2304 LAB', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 8, 'start' => '15:00:00', 'end' => '17:00:00', 'subject' => 'CH2302 LAB', 'teacher' => 'TBD', 'room' => 'TBD'],
                ]
            ],
            'M&C' => [
                'ALL' => [
                    ['period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'CH2301', 'teacher' => 'TBD', 'room' => 'L-30'],
                    ['period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'MA2301', 'teacher' => 'TBD', 'room' => 'L-10'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '15:00:00', 'subject' => 'CH2301 LAB', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 8, 'start' => '15:00:00', 'end' => '17:00:00', 'subject' => 'ES2304 LAB', 'teacher' => 'TBD', 'room' => 'TBD'],
                ]
            ],
            'ECE' => [
                'G1' => [
                    ['period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'GS2302 G1', 'teacher' => 'TBD', 'room' => 'L-26'],
                    ['period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'ES2302 G1', 'teacher' => 'TBD', 'room' => 'L-26'],
                    ['period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'MA2301 G1', 'teacher' => 'TBD', 'room' => 'L-26'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '17:00:00', 'subject' => 'ES2302 LAB G1', 'teacher' => 'TBD', 'room' => 'DH-1, DH-2'],
                ],
                'G2' => [
                    ['period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'GS2302 G2', 'teacher' => 'TBD', 'room' => 'L-27'],
                    ['period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'ES2302 G2', 'teacher' => 'TBD', 'room' => 'L-27'],
                    ['period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'MA2301 G2', 'teacher' => 'TBD', 'room' => 'L-27'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '17:00:00', 'subject' => 'ES2303 LAB G2', 'teacher' => 'TBD', 'room' => 'TBD'],
                ]
            ],
            'MECH' => [
                'G1' => [
                    ['period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'CH2302 G1', 'teacher' => 'TBD', 'room' => 'L-28'],
                    ['period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'MA2301 G1', 'teacher' => 'TBD', 'room' => 'L-28'],
                    ['period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'ES2304 G1', 'teacher' => 'TBD', 'room' => 'L-28'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '17:00:00', 'subject' => 'ES2307 LAB G1', 'teacher' => 'TBD', 'room' => 'TBD'],
                ],
                'G2' => [
                    ['period' => 1, 'start' => '08:00:00', 'end' => '11:00:00', 'subject' => 'ES2303 LAB G2', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '14:00:00', 'subject' => 'CH2302 G2', 'teacher' => 'TBD', 'room' => 'L-11'],
                    ['period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'MA2301 G2', 'teacher' => 'TBD', 'room' => 'L-11'],
                    ['period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'ES2304 G2', 'teacher' => 'TBD', 'room' => 'L-11'],
                ]
            ],
            'AI' => [
                'ALL' => [
                    ['period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'MA2301', 'teacher' => 'TBD', 'room' => 'L-29'],
                    ['period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'ES2304', 'teacher' => 'TBD', 'room' => 'L-29'],
                    ['period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'ES2302', 'teacher' => 'TBD', 'room' => 'L-29'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '17:00:00', 'subject' => 'ES2307 LAB', 'teacher' => 'TBD', 'room' => 'TBD'],
                ]
            ],
            'VLSI' => [
                'ALL' => [
                    ['period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'MA2301', 'teacher' => 'TBD', 'room' => 'L-29'],
                    ['period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'ES2304', 'teacher' => 'TBD', 'room' => 'L-29'],
                    ['period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'ES2302', 'teacher' => 'TBD', 'room' => 'L-29'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '17:00:00', 'subject' => 'ES2307 LAB', 'teacher' => 'TBD', 'room' => 'TBD'],
                ]
            ],
            'METTA' => [
                'ALL' => [
                    ['period' => 3, 'start' => '10:00:00', 'end' => '12:00:00', 'subject' => 'ES2304 LAB / CH2302 LAB', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '14:00:00', 'subject' => 'MA2301', 'teacher' => 'TBD', 'room' => 'L-15'],
                    ['period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'CH2302', 'teacher' => 'TBD', 'room' => 'L-15'],
                    ['period' => 8, 'start' => '15:00:00', 'end' => '17:00:00', 'subject' => 'MA2301 LAB', 'teacher' => 'TBD', 'room' => 'TBD'],
                ]
            ],
            'CIVIL' => [
                'G1' => [
                    ['period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'ES2301 G1', 'teacher' => 'TBD', 'room' => 'L-30'],
                    ['period' => 3, 'start' => '10:00:00', 'end' => '12:00:00', 'subject' => 'ES2306 LAB F1 (F12)', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '15:00:00', 'subject' => 'PY2302 LAB F2', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'ES2306 G1', 'teacher' => 'TBD', 'room' => 'L-26'],
                    ['period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'OR2302 G1', 'teacher' => 'TBD', 'room' => 'TBD'],
                ],
                'G2' => [
                    ['period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'ES2301 G2', 'teacher' => 'TBD', 'room' => 'L-31'],
                    ['period' => 3, 'start' => '10:00:00', 'end' => '12:00:00', 'subject' => 'ES2301 LAB F2', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '15:00:00', 'subject' => 'ES2306 LAB F3 (F31)', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'ES2306 G2', 'teacher' => 'TBD', 'room' => 'L-27'],
                    ['period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'OR2302 G2', 'teacher' => 'TBD', 'room' => 'TBD'],
                ]
            ],
            'EE' => [
                'G1' => [
                    ['period' => 2, 'start' => '09:00:00', 'end' => '11:00:00', 'subject' => 'PY2301 LAB F2', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'MA2301 G1', 'teacher' => 'TBD', 'room' => 'L-30'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '14:00:00', 'subject' => 'ES2301 G1', 'teacher' => 'TBD', 'room' => 'L-28'],
                    ['period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'ES2305 G1', 'teacher' => 'TBD', 'room' => 'L-28'],
                ],
                'G2' => [
                    ['period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'MA2301 G2', 'teacher' => 'TBD', 'room' => 'L-31'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '14:00:00', 'subject' => 'ES2301 G2', 'teacher' => 'TBD', 'room' => 'L-29'],
                    ['period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'ES2305 G2', 'teacher' => 'TBD', 'room' => 'L-29'],
                    ['period' => 8, 'start' => '15:00:00', 'end' => '17:00:00', 'subject' => 'HS2351 LAB G2', 'teacher' => 'TBD', 'room' => 'TBD'],
                ]
            ],
            'PROD' => [
                'ALL' => [
                    ['period' => 3, 'start' => '10:00:00', 'end' => '12:00:00', 'subject' => 'MA2301 LAB', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '14:00:00', 'subject' => 'PY2302', 'teacher' => 'TBD', 'room' => 'L-30'],
                    ['period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'ES2301', 'teacher' => 'TBD', 'room' => 'L-30'],
                    ['period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'ES2306', 'teacher' => 'TBD', 'room' => 'L-30'],
                    ['period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'OR2302', 'teacher' => 'TBD', 'room' => 'TBD'],
                ]
            ],
            'DS' => [
                'ALL' => [
                    ['period' => 6, 'start' => '13:00:00', 'end' => '15:00:00', 'subject' => 'MA2301 LAB', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 8, 'start' => '15:00:00', 'end' => '17:00:00', 'subject' => 'ES2301 LAB / ES2305 LAB', 'teacher' => 'TBD', 'room' => 'TBD'],
                ]
            ]
        ];
    }

    private function getWednesdaySchedules(): array
    {
        return [
            'AERO' => [
                'ALL' => [
                    ['period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'CH2302', 'teacher' => 'TBD', 'room' => 'L-11'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '17:00:00', 'subject' => 'ES2303 LAB', 'teacher' => 'TBD', 'room' => 'TBD'],
                ]
            ],
            'M&C' => [
                'ALL' => [
                    ['period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'CH2301', 'teacher' => 'TBD', 'room' => 'L-15'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '17:00:00', 'subject' => 'ES2303 LAB', 'teacher' => 'TBD', 'room' => 'TBD'],
                ]
            ],
            'ECE' => [
                'G1' => [
                    ['period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'OR2302 G1', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'CH2301 G1', 'teacher' => 'TBD', 'room' => 'L-28'],
                    ['period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'ES2304 G1', 'teacher' => 'TBD', 'room' => 'L-28'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '15:00:00', 'subject' => 'MA2301 LAB G1', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 8, 'start' => '15:00:00', 'end' => '17:00:00', 'subject' => 'CH2301 LAB F1', 'teacher' => 'TBD', 'room' => 'TBD'],
                ],
                'G2' => [
                    ['period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'CH2301 G2', 'teacher' => 'TBD', 'room' => 'L-29'],
                    ['period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'ES2304 G2', 'teacher' => 'TBD', 'room' => 'L-29'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '15:00:00', 'subject' => 'CH2301 LAB F3', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 8, 'start' => '15:00:00', 'end' => '17:00:00', 'subject' => 'ES2304 LAB F2', 'teacher' => 'TBD', 'room' => 'TBD'],
                ]
            ],
            'MECH' => [
                'G1' => [
                    ['period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'ES2302 G1', 'teacher' => 'TBD', 'room' => 'L-26'],
                    ['period' => 3, 'start' => '10:00:00', 'end' => '12:00:00', 'subject' => 'CH2302 LAB F1', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '14:00:00', 'subject' => 'CH2302 G1', 'teacher' => 'TBD', 'room' => 'L-26'],
                    ['period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'OR2302 G1', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 8, 'start' => '15:00:00', 'end' => '17:00:00', 'subject' => 'MA2301 LAB G2', 'teacher' => 'TBD', 'room' => 'TBD'],
                ],
                'G2' => [
                    ['period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'ES2302 G2', 'teacher' => 'TBD', 'room' => 'L-27'],
                    ['period' => 3, 'start' => '10:00:00', 'end' => '12:00:00', 'subject' => 'ES2304 LAB F2', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '14:00:00', 'subject' => 'CH2302 G2', 'teacher' => 'TBD', 'room' => 'L-27'],
                    ['period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'OR2302 G2', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 8, 'start' => '15:00:00', 'end' => '17:00:00', 'subject' => 'ES2304 LAB F1', 'teacher' => 'TBD', 'room' => 'TBD'],
                ]
            ],
            'AI' => [
                'ALL' => [
                    ['period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'GS2302', 'teacher' => 'TBD', 'room' => 'L-27'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '17:00:00', 'subject' => 'ES2302 LAB', 'teacher' => 'TBD', 'room' => 'DH-1'],
                ]
            ],
            'VLSI' => [
                'ALL' => [
                    ['period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'GS2302', 'teacher' => 'TBD', 'room' => 'L-27'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '17:00:00', 'subject' => 'ES2302 LAB', 'teacher' => 'TBD', 'room' => 'DH-2'],
                ]
            ],
            'METTA' => [
                'ALL' => [
                    ['period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'ES2304', 'teacher' => 'TBD', 'room' => 'L-26'],
                    ['period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'ES2302', 'teacher' => 'TBD', 'room' => 'L-26'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '17:00:00', 'subject' => 'ES2307 LAB', 'teacher' => 'TBD', 'room' => 'TBD'],
                ]
            ],
            'CIVIL' => [
                'G1' => [
                    ['period' => 1, 'start' => '08:00:00', 'end' => '10:00:00', 'subject' => 'HS2351 LAB G1', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'HS2351 G1', 'teacher' => 'TBD', 'room' => 'L-30'],
                    ['period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'MA2301 G1', 'teacher' => 'TBD', 'room' => 'L-30'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '14:00:00', 'subject' => 'ES2306', 'teacher' => 'TBD', 'room' => 'L-10'],
                    ['period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'PY2302 G1', 'teacher' => 'TBD', 'room' => 'L-10'],
                ],
                'G2' => [
                    ['period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'HS2351 G2', 'teacher' => 'TBD', 'room' => 'L-31'],
                    ['period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'MA2301 G2', 'teacher' => 'TBD', 'room' => 'L-31'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '14:00:00', 'subject' => 'ES2306', 'teacher' => 'TBD', 'room' => 'L-11'],
                    ['period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'PY2302 G2', 'teacher' => 'TBD', 'room' => 'L-11'],
                    ['period' => 8, 'start' => '15:00:00', 'end' => '17:00:00', 'subject' => 'ES2306 LAB F3 (F32)', 'teacher' => 'TBD', 'room' => 'TBD'],
                ]
            ],
            'EE' => [
                'G1' => [
                    ['period' => 6, 'start' => '13:00:00', 'end' => '14:00:00', 'subject' => 'MA2301 G1', 'teacher' => 'TBD', 'room' => 'L-30'],
                    ['period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'HS2351 G1', 'teacher' => 'TBD', 'room' => 'L-30'],
                    ['period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'PY2301 G1', 'teacher' => 'TBD', 'room' => 'L-30'],
                    ['period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'ES2305 G1', 'teacher' => 'TBD', 'room' => 'L-30'],
                ],
                'G2' => [
                    ['period' => 3, 'start' => '10:00:00', 'end' => '12:00:00', 'subject' => 'ES2305 LAB F2', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '14:00:00', 'subject' => 'MA2301 G2', 'teacher' => 'TBD', 'room' => 'L-31'],
                    ['period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'HS2351 G2', 'teacher' => 'TBD', 'room' => 'L-31'],
                    ['period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'PY2301 G2', 'teacher' => 'TBD', 'room' => 'L-31'],
                    ['period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'ES2305 G2', 'teacher' => 'TBD', 'room' => 'L-31'],
                ]
            ],
            'PROD' => [
                'ALL' => [
                    ['period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'ES2301', 'teacher' => 'TBD', 'room' => 'L-11'],
                    ['period' => 3, 'start' => '10:00:00', 'end' => '12:00:00', 'subject' => 'ES2301 LAB', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '15:00:00', 'subject' => 'ES2306 LAB F1 (F12)', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'MA2301', 'teacher' => 'TBD', 'room' => 'L-15'],
                ]
            ],
            'DS' => [
                'ALL' => [
                    ['period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'MA2301', 'teacher' => 'TBD', 'room' => 'L-10'],
                    ['period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'PY2301', 'teacher' => 'TBD', 'room' => 'L-10'],
                    ['period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'ES2305', 'teacher' => 'TBD', 'room' => 'L-10'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '16:00:00', 'subject' => 'PY2301 LAB', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 9, 'start' => '16:00:00', 'end' => '17:00:00', 'subject' => 'HS2351', 'teacher' => 'TBD', 'room' => 'L-10'],
                ]
            ]
        ];
    }

    private function getThursdaySchedules(): array
    {
        return [
            'AERO' => [
                'ALL' => [
                    ['period' => 2, 'start' => '09:00:00', 'end' => '11:00:00', 'subject' => 'MA2301 LAB', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'MA2301', 'teacher' => 'TBD', 'room' => 'L-11'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '14:00:00', 'subject' => 'CH2302', 'teacher' => 'TBD', 'room' => 'L-26'],
                    ['period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'ES2304', 'teacher' => 'TBD', 'room' => 'L-26'],
                    ['period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'ES2302', 'teacher' => 'TBD', 'room' => 'L-26'],
                ]
            ],
            'M&C' => [
                'ALL' => [
                    ['period' => 2, 'start' => '09:00:00', 'end' => '11:00:00', 'subject' => 'MA2301 LAB', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'MA2301', 'teacher' => 'TBD', 'room' => 'L-11'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '14:00:00', 'subject' => 'CH2301', 'teacher' => 'TBD', 'room' => 'L-30'],
                    ['period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'ES2304', 'teacher' => 'TBD', 'room' => 'L-26'],
                    ['period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'ES2302', 'teacher' => 'TBD', 'room' => 'L-26'],
                ]
            ],
            'ECE' => [
                'G1' => [
                    ['period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'ES2302 G1', 'teacher' => 'TBD', 'room' => 'L-26'],
                    ['period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'MA2301 G1', 'teacher' => 'TBD', 'room' => 'L-26'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '17:00:00', 'subject' => 'ES2307 LAB G1', 'teacher' => 'TBD', 'room' => 'TBD'],
                ],
                'G2' => [
                    ['period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'ES2302 G2', 'teacher' => 'TBD', 'room' => 'L-27'],
                    ['period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'MA2301 G2', 'teacher' => 'TBD', 'room' => 'L-27'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '17:00:00', 'subject' => 'ES2302 LAB G2', 'teacher' => 'TBD', 'room' => 'DH-3, DH-4'],
                ]
            ],
            'MECH' => [
                'G1' => [
                    ['period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'MA2301 G1', 'teacher' => 'TBD', 'room' => 'L-28'],
                    ['period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'CH2302 G1', 'teacher' => 'TBD', 'room' => 'L-28'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '15:00:00', 'subject' => 'CH2302 LAB F2', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 8, 'start' => '15:00:00', 'end' => '17:00:00', 'subject' => 'MA2301 LAB G1', 'teacher' => 'TBD', 'room' => 'TBD'],
                ],
                'G2' => [
                    ['period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'MA2301 G2', 'teacher' => 'TBD', 'room' => 'L-29'],
                    ['period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'CH2302 G2', 'teacher' => 'TBD', 'room' => 'L-29'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '15:00:00', 'subject' => 'ES2304 LAB F3', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 8, 'start' => '15:00:00', 'end' => '17:00:00', 'subject' => 'CH2302 LAB F3', 'teacher' => 'TBD', 'room' => 'TBD'],
                ]
            ],
            'AI' => [
                'ALL' => [
                    ['period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'MA2301', 'teacher' => 'TBD', 'room' => 'L-15'],
                    ['period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'CH2301', 'teacher' => 'TBD', 'room' => 'L-15'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '17:00:00', 'subject' => 'ES2303 LAB', 'teacher' => 'TBD', 'room' => 'TBD'],
                ]
            ],
            'VLSI' => [
                'ALL' => [
                    ['period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'MA2301', 'teacher' => 'TBD', 'room' => 'L-15'],
                    ['period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'CH2301', 'teacher' => 'TBD', 'room' => 'L-15'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '17:00:00', 'subject' => 'ES2303 LAB', 'teacher' => 'TBD', 'room' => 'TBD'],
                ]
            ],
            'METTA' => [
                'ALL' => [
                    ['period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'MA2301', 'teacher' => 'TBD', 'room' => 'L-10'],
                    ['period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'CH2302', 'teacher' => 'TBD', 'room' => 'L-10'],
                    ['period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'ES2304', 'teacher' => 'TBD', 'room' => 'L-10'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '17:00:00', 'subject' => 'ES2302 LAB', 'teacher' => 'TBD', 'room' => 'DH-1, DH-2'],
                ]
            ],
            'CIVIL' => [
                'G1' => [
                    ['period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'GS2301 G1', 'teacher' => 'TBD', 'room' => 'L-26'],
                    ['period' => 3, 'start' => '10:00:00', 'end' => '12:00:00', 'subject' => 'ES2301 LAB F1', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '14:00:00', 'subject' => 'ES2301 G1', 'teacher' => 'TBD', 'room' => 'L-28'],
                    ['period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'ES2306 G1', 'teacher' => 'TBD', 'room' => 'L-28'],
                    ['period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'HS2351 G1', 'teacher' => 'TBD', 'room' => 'L-28'],
                ],
                'G2' => [
                    ['period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'GS2301 G2', 'teacher' => 'TBD', 'room' => 'L-27'],
                    ['period' => 3, 'start' => '10:00:00', 'end' => '12:00:00', 'subject' => 'ES2306 LAB F2 (F21)', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '14:00:00', 'subject' => 'ES2301 G2', 'teacher' => 'TBD', 'room' => 'L-29'],
                    ['period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'ES2306 G2', 'teacher' => 'TBD', 'room' => 'L-29'],
                    ['period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'HS2351 G2', 'teacher' => 'TBD', 'room' => 'L-29'],
                ]
            ],
            'EE' => [
                'G1' => [
                    ['period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'PY2301 G1', 'teacher' => 'TBD', 'room' => 'L-30'],
                    ['period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'GS2301 G1', 'teacher' => 'TBD', 'room' => 'L-30'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '15:00:00', 'subject' => 'PY2301 LAB F1', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 8, 'start' => '15:00:00', 'end' => '17:00:00', 'subject' => 'ES2301 LAB F1', 'teacher' => 'TBD', 'room' => 'TBD'],
                ],
                'G2' => [
                    ['period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'PY2301 G2', 'teacher' => 'TBD', 'room' => 'L-31'],
                    ['period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'GS2301 G2', 'teacher' => 'TBD', 'room' => 'L-31'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '15:00:00', 'subject' => 'MA2301 LAB G2', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 8, 'start' => '15:00:00', 'end' => '17:00:00', 'subject' => 'ES2305 LAB F3', 'teacher' => 'TBD', 'room' => 'TBD'],
                ]
            ],
            'PROD' => [
                'ALL' => [
                    ['period' => 3, 'start' => '10:00:00', 'end' => '12:00:00', 'subject' => 'HS2351 LAB', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '14:00:00', 'subject' => 'ES2306', 'teacher' => 'TBD', 'room' => 'L-10'],
                    ['period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'MA2301', 'teacher' => 'TBD', 'room' => 'L-10'],
                    ['period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'PY2302', 'teacher' => 'TBD', 'room' => 'L-10'],
                ]
            ],
            'DS' => [
                'ALL' => [
                    ['period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'MA2301', 'teacher' => 'TBD', 'room' => 'L-11'],
                    ['period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'ES2301', 'teacher' => 'TBD', 'room' => 'L-11'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '14:00:00', 'subject' => 'HS2351', 'teacher' => 'TBD', 'room' => 'L-27'],
                    ['period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'ES2305', 'teacher' => 'TBD', 'room' => 'L-27'],
                ]
            ],
            'BDES' => [
                'ALL' => [
                    ['period' => 6, 'start' => '13:00:00', 'end' => '15:00:00', 'subject' => 'HS2351 LAB', 'teacher' => 'TBD', 'room' => 'TBD'],
                ]
            ]
        ];
    }

    private function getFridaySchedules(): array
    {
        return [
            'AERO' => [
                'ALL' => [
                    ['period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'OR2302', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'GS2302', 'teacher' => 'TBD', 'room' => 'L-15'],
                    ['period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'ES2304', 'teacher' => 'TBD', 'room' => 'L-15'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '17:00:00', 'subject' => 'ES2307 LAB', 'teacher' => 'TBD', 'room' => 'TBD'],
                ]
            ],
            'M&C' => [
                'ALL' => [
                    ['period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'GS2302', 'teacher' => 'TBD', 'room' => 'L-15'],
                    ['period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'ES2304', 'teacher' => 'TBD', 'room' => 'L-15'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '17:00:00', 'subject' => 'ES2307 LAB', 'teacher' => 'TBD', 'room' => 'TBD'],
                ]
            ],
            'ECE' => [
                'G1' => [
                    ['period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'CH2301 G1', 'teacher' => 'TBD', 'room' => 'L-30'],
                    ['period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'ES2304 G1', 'teacher' => 'TBD', 'room' => 'L-30'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '15:00:00', 'subject' => 'CH2301 LAB F2', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 8, 'start' => '15:00:00', 'end' => '17:00:00', 'subject' => 'MA2301 LAB G2', 'teacher' => 'TBD', 'room' => 'TBD'],
                ],
                'G2' => [
                    ['period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'OR2302 G2', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'CH2301 G2', 'teacher' => 'TBD', 'room' => 'L-31'],
                    ['period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'ES2304 G2', 'teacher' => 'TBD', 'room' => 'L-31'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '15:00:00', 'subject' => 'ES2304 LAB F3', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 8, 'start' => '15:00:00', 'end' => '17:00:00', 'subject' => 'ES2304 LAB F1', 'teacher' => 'TBD', 'room' => 'TBD'],
                ]
            ],
            'MECH' => [
                'G1' => [
                    ['period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'ES2304 G1', 'teacher' => 'TBD', 'room' => 'L-28'],
                    ['period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'GS2302 G1', 'teacher' => 'TBD', 'room' => 'L-28'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '17:00:00', 'subject' => 'ES2303 LAB G1', 'teacher' => 'TBD', 'room' => 'TBD'],
                ],
                'G2' => [
                    ['period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'ES2304 G2', 'teacher' => 'TBD', 'room' => 'L-29'],
                    ['period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'GS2302 G2', 'teacher' => 'TBD', 'room' => 'L-29'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '17:00:00', 'subject' => 'ES2302 LAB G2', 'teacher' => 'TBD', 'room' => 'DH-1, DH-2'],
                ]
            ],
            'AI' => [
                'ALL' => [
                    ['period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'ES2304', 'teacher' => 'TBD', 'room' => 'L-27'],
                    ['period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'ES2302', 'teacher' => 'TBD', 'room' => 'L-27'],
                    ['period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'CH2301', 'teacher' => 'TBD', 'room' => 'L-27'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '15:00:00', 'subject' => 'MA2301 LAB', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'MA2301', 'teacher' => 'TBD', 'room' => 'L-11'],
                ]
            ],
            'VLSI' => [
                'ALL' => [
                    ['period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'ES2304', 'teacher' => 'TBD', 'room' => 'L-27'],
                    ['period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'ES2302', 'teacher' => 'TBD', 'room' => 'L-27'],
                    ['period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'CH2301', 'teacher' => 'TBD', 'room' => 'L-27'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '15:00:00', 'subject' => 'MA2301 LAB', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'MA2301', 'teacher' => 'TBD', 'room' => 'L-11'],
                ]
            ],
            'METTA' => [
                'ALL' => [
                    ['period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'ES2302', 'teacher' => 'TBD', 'room' => 'L-28'],
                    ['period' => 3, 'start' => '10:00:00', 'end' => '12:00:00', 'subject' => 'CH2302 LAB / ES2304 LAB', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '14:00:00', 'subject' => 'GS2302', 'teacher' => 'TBD', 'room' => 'L-26'],
                    ['period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'MA2301', 'teacher' => 'TBD', 'room' => 'L-26'],
                ]
            ],
            'CIVIL' => [
                'G1' => [
                    ['period' => 2, 'start' => '09:00:00', 'end' => '11:00:00', 'subject' => 'MA2301 LAB G1', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'MA2301 G1', 'teacher' => 'TBD', 'room' => 'L-10'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '14:00:00', 'subject' => 'ES2301 G1', 'teacher' => 'TBD', 'room' => 'L-28'],
                    ['period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'PY2302 G1', 'teacher' => 'TBD', 'room' => 'L-28'],
                    ['period' => 8, 'start' => '15:00:00', 'end' => '17:00:00', 'subject' => 'PY2302 LAB F3', 'teacher' => 'TBD', 'room' => 'TBD'],
                ],
                'G2' => [
                    ['period' => 2, 'start' => '09:00:00', 'end' => '11:00:00', 'subject' => 'HS2351 LAB G2', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'MA2301 G2', 'teacher' => 'TBD', 'room' => 'L-11'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '14:00:00', 'subject' => 'ES2301 G2', 'teacher' => 'TBD', 'room' => 'L-29'],
                    ['period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'PY2302 G2', 'teacher' => 'TBD', 'room' => 'L-29'],
                    ['period' => 8, 'start' => '15:00:00', 'end' => '17:00:00', 'subject' => 'ES2306 LAB F2 (F22)', 'teacher' => 'TBD', 'room' => 'TBD'],
                ]
            ],
            'EE' => [
                'G1' => [
                    ['period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'OR2302 G1', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 3, 'start' => '10:00:00', 'end' => '12:00:00', 'subject' => 'ES2305 LAB F1', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '14:00:00', 'subject' => 'MA2301 G1', 'teacher' => 'TBD', 'room' => 'L-30'],
                    ['period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'ES2301 G1', 'teacher' => 'TBD', 'room' => 'L-30'],
                    ['period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'ES2305 G1', 'teacher' => 'TBD', 'room' => 'L-30'],
                ],
                'G2' => [
                    ['period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'OR2302 G2', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 3, 'start' => '10:00:00', 'end' => '12:00:00', 'subject' => 'ES2301 LAB F2', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '14:00:00', 'subject' => 'MA2301 G2', 'teacher' => 'TBD', 'room' => 'L-31'],
                    ['period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'ES2301 G2', 'teacher' => 'TBD', 'room' => 'L-31'],
                    ['period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'ES2305 G2', 'teacher' => 'TBD', 'room' => 'L-31'],
                ]
            ],
            'PROD' => [
                'ALL' => [
                    ['period' => 3, 'start' => '10:00:00', 'end' => '12:00:00', 'subject' => 'PY2302 LAB', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '14:00:00', 'subject' => 'PY2302', 'teacher' => 'TBD', 'room' => 'L-27'],
                    ['period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'GS2301', 'teacher' => 'TBD', 'room' => 'L-27'],
                    ['period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'HS2351', 'teacher' => 'TBD', 'room' => 'L-27'],
                ]
            ],
            'DS' => [
                'ALL' => [
                    ['period' => 2, 'start' => '09:00:00', 'end' => '10:00:00', 'subject' => 'ES2301', 'teacher' => 'TBD', 'room' => 'L-26'],
                    ['period' => 3, 'start' => '10:00:00', 'end' => '11:00:00', 'subject' => 'PY2301', 'teacher' => 'TBD', 'room' => 'L-26'],
                    ['period' => 4, 'start' => '11:00:00', 'end' => '12:00:00', 'subject' => 'MA2301', 'teacher' => 'TBD', 'room' => 'L-26'],
                    ['period' => 6, 'start' => '13:00:00', 'end' => '15:00:00', 'subject' => 'ES2305 LAB / ES2301 LAB', 'teacher' => 'TBD', 'room' => 'TBD'],
                    ['period' => 8, 'start' => '15:00:00', 'end' => '17:00:00', 'subject' => 'HS2351 LAB', 'teacher' => 'TBD', 'room' => 'TBD'],
                ]
            ],
            'BDES' => [
                'ALL' => [
                    ['period' => 7, 'start' => '14:00:00', 'end' => '15:00:00', 'subject' => 'GS2301', 'teacher' => 'TBD', 'room' => 'L-27'],
                    ['period' => 8, 'start' => '15:00:00', 'end' => '16:00:00', 'subject' => 'HS2351', 'teacher' => 'TBD', 'room' => 'L-27'],
                ]
            ]
        ];
    }

    private function seedSlot(int $classId, array $slot, int $dayOfWeek): void
    {
        Timetable::updateOrCreate(
            [
                'class_id'    => $classId,
                'type'        => 'weekly',
                'day_of_week' => $dayOfWeek,
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
