<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CourseClass;
use App\Models\ExamDatesheet;
use App\Models\Timetable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DatesheetController extends Controller
{
    /**
     * Get the official CSE Department Mid Term Examination Datesheet (1st - 8th October 2026).
     */
    public function index(Request $request): JsonResponse
    {
        $datesheet = [
            'notice_no' => 'PEC/CSE/265',
            'notice_date' => '2026-09-25',
            'title' => 'CSE Department Datesheet for Mid Term Examinations',
            'period' => '1st - 8th October 2026',
            'department' => 'Computer Science & Engineering',
            'institution' => 'Punjab Engineering College (Deemed to be University), Chandigarh',
            'branches' => [
                ['id' => 'all', 'label' => 'All Branches (Master Grid)', 'semester' => 'All', 'branch' => 'All'],
                ['id' => '1st_sem', 'label' => '1st Sem (Common)', 'semester' => '1st Sem', 'branch' => 'Institute Common'],
                ['id' => '3rd_cse', 'label' => '3rd Sem CSE', 'semester' => '3rd Sem', 'branch' => 'CSE'],
                ['id' => '3rd_ds', 'label' => '3rd Sem DS', 'semester' => '3rd Sem', 'branch' => 'Data Science'],
                ['id' => '3rd_ai', 'label' => '3rd Sem AI', 'semester' => '3rd Sem', 'branch' => 'AI'],
                ['id' => '5th_cse', 'label' => '5th Sem CSE', 'semester' => '5th Sem', 'branch' => 'CSE'],
                ['id' => '5th_ds', 'label' => '5th Sem DS', 'semester' => '5th Sem', 'branch' => 'Data Science'],
                ['id' => '5th_ai', 'label' => '5th Sem AI', 'semester' => '5th Sem', 'branch' => 'AI'],
                ['id' => '7th_cse', 'label' => '7th Sem CSE', 'semester' => '7th Sem', 'branch' => 'CSE'],
                ['id' => '7th_ds', 'label' => '7th Sem DS', 'semester' => '7th Sem', 'branch' => 'Data Science'],
                ['id' => '7th_ai', 'label' => '7th Sem AI', 'semester' => '7th Sem', 'branch' => 'AI'],
                ['id' => 'mtech_cse', 'label' => '1st Sem M.Tech CSE', 'semester' => '1st Sem MTech', 'branch' => 'MTech CSE'],
            ],
            'instructions' => [
                'Students must occupy their allotted seats 15 minutes before the commencement of the examination.',
                'Carrying Institute Identity Card and Mid-Term Admit Slip is mandatory.',
                'Mobile phones, smartwatches, programmable calculators, or any unauthorized electronic gadgets are strictly banned inside examination halls.',
                'Seating centers (DH1 to DH5, L10 to L31) will be displayed on the department notice board.',
            ],
            'schedule' => [
                // ==========================================
                // DAY 1: 01/10/2026 (THURSDAY)
                // ==========================================
                [
                    'id' => 'slot_1',
                    'date' => '2026-10-01',
                    'day' => 'Thursday',
                    'time' => '9:30 AM - 11:00 AM',
                    'start_time' => '09:30',
                    'end_time' => '11:00',
                    'coordinator' => 'Dr. Mamta Dabra (ES2301)',
                    'classes' => [
                        '1st_sem' => [
                            'code' => 'ES 2301 (Pool A)',
                            'subject' => 'Introduction to Computer Programming',
                            'rooms' => 'DH1, DH2, DH3, DH4, DH5, L26, L27, L28, L29, L30, L31 (506)',
                            'note' => 'Backlog students',
                            'is_backlog' => true,
                        ],
                        '3rd_cse' => [
                            'code' => 'ES 2301',
                            'subject' => 'Introduction to Computer Programming (Backlog)',
                            'rooms' => 'DH1, DH2, DH3, DH4, DH5, L26, L27, L28, L29, L30, L31',
                            'is_backlog' => true,
                        ],
                        '3rd_ds' => [
                            'code' => 'ES 2301',
                            'subject' => 'Introduction to Computer Programming (Backlog)',
                            'rooms' => 'DH1, DH2, DH3, DH4, DH5, L26, L27, L28, L29, L30, L31',
                            'is_backlog' => true,
                        ],
                        '3rd_ai' => [
                            'code' => 'ES 2301',
                            'subject' => 'Introduction to Computer Programming (Backlog)',
                            'rooms' => 'DH1, DH2, DH3, DH4, DH5, L26, L27, L28, L29, L30, L31',
                            'is_backlog' => true,
                        ],
                        'mtech_cse' => [
                            'code' => 'CSR 1101',
                            'subject' => 'Advanced Data Structures & Algorithms',
                            'rooms' => 'CSE Dept Rooms',
                        ],
                    ],
                ],
                [
                    'id' => 'slot_2',
                    'date' => '2026-10-01',
                    'day' => 'Thursday',
                    'time' => '11:30 AM - 1:00 PM',
                    'start_time' => '11:30',
                    'end_time' => '13:00',
                    'coordinator' => null,
                    'classes' => [
                        '1st_sem' => [
                            'code' => 'CH 2301 (Pool B)',
                            'subject' => 'Applied Chemistry I (ECE, M&C, AI-VLSI)',
                            'rooms' => 'DH1, DH2, L10, L11 (231)',
                        ],
                        '7th_cse' => [
                            'code' => 'HSM-III: MHN4004 / MHN4005',
                            'subject' => 'Humanities Elective: MHN4004 / MHN4005',
                            'rooms' => 'DH3, DH4, L26, L27, L28, L29, L30, L31 (121 - 178 - 299)',
                        ],
                        '7th_ds' => [
                            'code' => 'HSM-III: MHN4004 / MHN4005',
                            'subject' => 'Humanities Elective: MHN4004 / MHN4005',
                            'rooms' => 'DH3, DH4, L26, L27, L28, L29, L30, L31 (121 - 178 - 299)',
                        ],
                        '7th_ai' => [
                            'code' => 'HSM-III: MHN4004 / MHN4005',
                            'subject' => 'Humanities Elective: MHN4004 / MHN4005',
                            'rooms' => 'DH3, DH4, L26, L27, L28, L29, L30, L31 (121 - 178 - 299)',
                        ],
                    ],
                ],
                [
                    'id' => 'slot_3',
                    'date' => '2026-10-01',
                    'day' => 'Thursday',
                    'time' => '1:30 PM - 3:00 PM',
                    'start_time' => '13:30',
                    'end_time' => '15:00',
                    'coordinator' => null,
                    'classes' => [
                        '1st_sem' => [
                            'code' => 'CH 2302 (Pool B)',
                            'subject' => 'Applied Chemistry II (Aero, Meta, Mech) / CH 2301/2302 Backlog',
                            'rooms' => 'DH1, DH2, DH3, DH4 (231)',
                            'is_backlog' => true,
                        ],
                        '3rd_cse' => [
                            'code' => 'CH 2301 / CH 2302',
                            'subject' => 'Applied Chemistry I / II (Backlog)',
                            'rooms' => 'DH1, DH2, DH3, DH4',
                            'is_backlog' => true,
                        ],
                        '3rd_ds' => [
                            'code' => 'CH 2301 / CH 2302',
                            'subject' => 'Applied Chemistry I / II (Backlog)',
                            'rooms' => 'DH1, DH2, DH3, DH4',
                            'is_backlog' => true,
                        ],
                        '3rd_ai' => [
                            'code' => 'CH 2301 / CH 2302',
                            'subject' => 'Applied Chemistry I / II (Backlog)',
                            'rooms' => 'DH1, DH2, DH3, DH4',
                            'is_backlog' => true,
                        ],
                    ],
                ],
                [
                    'id' => 'slot_4',
                    'date' => '2026-10-01',
                    'day' => 'Thursday',
                    'time' => '3:30 PM - 5:00 PM',
                    'start_time' => '15:30',
                    'end_time' => '17:00',
                    'coordinator' => 'Dr. Satnam Kaur (OOP)',
                    'classes' => [
                        '3rd_cse' => [
                            'code' => 'CTN 304',
                            'subject' => 'Object Oriented Programming',
                            'rooms' => 'CSE Dept Halls',
                        ],
                        '3rd_ds' => [
                            'code' => 'DSN 3003',
                            'subject' => 'Operating Systems',
                            'rooms' => 'CSE Dept Halls',
                        ],
                        '3rd_ai' => [
                            'code' => 'AIN 3002',
                            'subject' => 'Object Oriented Programming',
                            'rooms' => 'CSE Dept Halls',
                        ],
                        '7th_cse' => [
                            'code' => 'HSM-III: MHN4001, MHN4002, MHN4003',
                            'subject' => 'Humanities Elective (MHN4001 / MHN4002 / MHN4003)',
                            'rooms' => 'DH1, DH2, DH3, DH4, L10, L26, L27, L28, L29, L30, L31 (172 - 130 - 191 - 493)',
                        ],
                        '7th_ds' => [
                            'code' => 'HSM-III: MHN4001, MHN4002, MHN4003',
                            'subject' => 'Humanities Elective (MHN4001 / MHN4002 / MHN4003)',
                            'rooms' => 'DH1, DH2, DH3, DH4, L10, L26, L27, L28, L29, L30, L31',
                        ],
                        '7th_ai' => [
                            'code' => 'HSM-III: MHN4001, MHN4002, MHN4003',
                            'subject' => 'Humanities Elective (MHN4001 / MHN4002 / MHN4003)',
                            'rooms' => 'DH1, DH2, DH3, DH4, L10, L26, L27, L28, L29, L30, L31',
                        ],
                    ],
                ],

                // ==========================================
                // DAY 2: 05/10/2026 (MONDAY)
                // ==========================================
                [
                    'id' => 'slot_5',
                    'date' => '2026-10-05',
                    'day' => 'Monday',
                    'time' => '9:30 AM - 11:00 AM',
                    'start_time' => '09:30',
                    'end_time' => '11:00',
                    'coordinator' => 'CSN5001 - Dr. Sandeep Harit',
                    'classes' => [
                        '1st_sem' => [
                            'code' => 'MA 2301 (Pool A)',
                            'subject' => 'Calculus',
                            'rooms' => 'DH1, DH2, DH3, DH4, DH5, T3, L10, L11, L26, L27, L28 (506)',
                        ],
                        '5th_cse' => [
                            'code' => 'CSN 5001',
                            'subject' => 'Theory of Computation (TOC)',
                            'rooms' => 'CSE Dept Halls',
                        ],
                        '5th_ai' => [
                            'code' => 'AIN 5001',
                            'subject' => 'Theory of Computation (TOC)',
                            'rooms' => 'CSE Dept Halls',
                        ],
                        '7th_cse' => [
                            'code' => 'CSE 1013',
                            'subject' => 'Digital Image Processing',
                            'rooms' => 'CSE Dept Halls',
                        ],
                        '7th_ds' => [
                            'code' => 'DSE 1013',
                            'subject' => 'Digital Image Processing',
                            'rooms' => 'CSE Dept Halls',
                        ],
                        'mtech_cse' => [
                            'code' => 'Dept. Elective-I: CSR 1202',
                            'subject' => 'Explainable AI',
                            'rooms' => 'CSE Dept Rooms',
                        ],
                    ],
                ],
                [
                    'id' => 'slot_6',
                    'date' => '2026-10-05',
                    'day' => 'Monday',
                    'time' => '11:30 AM - 1:00 PM',
                    'start_time' => '11:30',
                    'end_time' => '13:00',
                    'coordinator' => null,
                    'classes' => [
                        '5th_ds' => [
                            'code' => 'DSN 5003',
                            'subject' => 'Software Engineering',
                            'rooms' => 'CSE Dept Halls',
                        ],
                    ],
                ],
                [
                    'id' => 'slot_7',
                    'date' => '2026-10-05',
                    'day' => 'Monday',
                    'time' => '1:30 PM - 3:00 PM',
                    'start_time' => '13:30',
                    'end_time' => '15:00',
                    'coordinator' => 'Other dept',
                    'classes' => [
                        '1st_sem' => [
                            'code' => 'MA 2301 (Pool B)',
                            'subject' => 'Calculus (All Backlog students of B.Tech 1st Sem Maths*)',
                            'rooms' => 'DH1, DH2, DH3, DH4, DH5, L10, L11, L26, L27, L28 (462 - *)',
                            'is_backlog' => true,
                        ],
                        '3rd_cse' => [
                            'code' => 'MA 2301',
                            'subject' => 'Calculus (Backlog Students)',
                            'rooms' => 'DH1, DH2, DH3, DH4, DH5, L10, L11, L26, L27, L28',
                            'is_backlog' => true,
                        ],
                        '3rd_ds' => [
                            'code' => 'MA 2301',
                            'subject' => 'Calculus (Backlog Students)',
                            'rooms' => 'DH1, DH2, DH3, DH4, DH5, L10, L11, L26, L27, L28',
                            'is_backlog' => true,
                        ],
                        '3rd_ai' => [
                            'code' => 'MA 2301',
                            'subject' => 'Calculus (Backlog Students)',
                            'rooms' => 'DH1, DH2, DH3, DH4, DH5, L10, L11, L26, L27, L28',
                            'is_backlog' => true,
                        ],
                        'mtech_cse' => [
                            'code' => 'DERM',
                            'subject' => 'DERM',
                            'rooms' => 'L30 - L31',
                        ],
                    ],
                ],
                [
                    'id' => 'slot_8',
                    'date' => '2026-10-05',
                    'day' => 'Monday',
                    'time' => '3:30 PM - 5:00 PM',
                    'start_time' => '15:30',
                    'end_time' => '17:00',
                    'coordinator' => 'CTN301 - Mayank Gupta',
                    'classes' => [
                        '3rd_cse' => [
                            'code' => 'CTN 301',
                            'subject' => 'Data Structures',
                            'rooms' => 'CSE Dept Halls',
                        ],
                        '3rd_ds' => [
                            'code' => 'DSN 3001',
                            'subject' => 'Data Structures',
                            'rooms' => 'CSE Dept Halls',
                        ],
                        '3rd_ai' => [
                            'code' => 'AIN 3001',
                            'subject' => 'Data Structures',
                            'rooms' => 'CSE Dept Halls',
                        ],
                        '7th_cse' => [
                            'code' => 'CSE 1009',
                            'subject' => 'Wireless & Mobile Networks',
                            'rooms' => 'CSE Dept Halls',
                        ],
                        '7th_ds' => [
                            'code' => 'DSE 1009',
                            'subject' => 'Wireless & Mobile Networks',
                            'rooms' => 'CSE Dept Halls',
                        ],
                        '7th_ai' => [
                            'code' => 'AIE 1009',
                            'subject' => 'Natural Language Processing',
                            'rooms' => 'CSE Dept Halls',
                        ],
                    ],
                ],

                // ==========================================
                // DAY 3: 06/10/2026 (TUESDAY)
                // ==========================================
                [
                    'id' => 'slot_9',
                    'date' => '2026-10-06',
                    'day' => 'Tuesday',
                    'time' => '9:30 AM - 11:00 AM',
                    'start_time' => '09:30',
                    'end_time' => '11:00',
                    'coordinator' => 'Dr. Shilpa (DBMS)',
                    'classes' => [
                        '1st_sem' => [
                            'code' => 'ES 2302 (Pool B)',
                            'subject' => 'Engineering Drawing with CAD software (ECE, M&C, AI-VLSI)',
                            'rooms' => 'DH1 - DH5 (231)',
                        ],
                        '5th_cse' => [
                            'code' => 'CSN 5004',
                            'subject' => 'Database Management Systems (DBMS)',
                            'rooms' => 'CSE Dept Halls',
                        ],
                        '5th_ds' => [
                            'code' => 'DSN 5004',
                            'subject' => 'Internet of Things (IoT)',
                            'rooms' => 'CSE Dept Halls',
                        ],
                        '5th_ai' => [
                            'code' => 'AIN 5002',
                            'subject' => 'Deep Learning',
                            'rooms' => 'CSE Dept Halls',
                        ],
                        'mtech_cse' => [
                            'code' => 'CSR 1102',
                            'subject' => 'AI & Data Analysis',
                            'rooms' => 'CSE Dept Rooms',
                        ],
                    ],
                ],
                [
                    'id' => 'slot_10',
                    'date' => '2026-10-06',
                    'day' => 'Tuesday',
                    'time' => '11:30 AM - 1:00 PM',
                    'start_time' => '11:30',
                    'end_time' => '13:00',
                    'coordinator' => null,
                    'classes' => [
                        '5th_cse' => [
                            'code' => 'CSM 1003',
                            'subject' => 'Minor: Database Management Systems (MSC B.Tech 3rd year)',
                            'rooms' => 'CSE Dept Halls',
                            'is_minor' => true,
                        ],
                        '5th_ds' => [
                            'code' => 'DSM 1003',
                            'subject' => 'Minor: ATDS (MSC B.Tech 3rd year)',
                            'rooms' => 'CSE Dept Halls',
                            'is_minor' => true,
                        ],
                        '5th_ai' => [
                            'code' => 'AIM 1003',
                            'subject' => 'Minor: HMI (Human Machine Interface) (MSC B.Tech 3rd year)',
                            'rooms' => 'CSE Dept Halls',
                            'is_minor' => true,
                         ],
                     ],
                 ],
             ],
         ];

        // Check if database records exist to serve dynamic content
        try {
            $dbRecords = ExamDatesheet::orderBy('exam_date')->orderBy('start_time')->get();

            if ($dbRecords->isNotEmpty()) {
                $grouped = $dbRecords->groupBy(function ($item) {
                    $d = is_string($item->exam_date) ? substr($item->exam_date, 0, 10) : $item->exam_date->format('Y-m-d');
                    return $d . '_' . $item->start_time;
                });

                $dbSchedule = [];
                $slotIdx = 1;
                foreach ($grouped as $key => $slotRecords) {
                    $firstSlot = $slotRecords->first();
                    $dateStr = is_string($firstSlot->exam_date) ? substr($firstSlot->exam_date, 0, 10) : $firstSlot->exam_date->format('Y-m-d');
                    $classes = [];
                    $coordinator = null;

                    foreach ($slotRecords as $rec) {
                        if (!empty($rec->coordinator_duty) && !$coordinator) {
                            $coordinator = $rec->coordinator_duty;
                        }
                        $classes[$rec->branch_key] = [
                            'code' => $rec->subject_code,
                            'subject' => $rec->subject_name,
                            'rooms' => $rec->seating_rooms,
                            'coordinator' => $rec->coordinator_duty,
                            'is_backlog' => (bool) $rec->is_backlog,
                            'is_minor' => (bool) $rec->is_minor,
                            'note' => $rec->notes,
                        ];
                    }

                    $dbSchedule[] = [
                        'id' => 'slot_' . $slotIdx++,
                        'date' => $dateStr,
                        'day' => $firstSlot->day_name,
                        'time' => $firstSlot->time_slot,
                        'start_time' => $firstSlot->start_time,
                        'end_time' => $firstSlot->end_time,
                        'coordinator' => $coordinator,
                        'classes' => $classes,
                    ];
                }

                $datesheet['schedule'] = $dbSchedule;
                if ($first = $dbRecords->first()) {
                    $datesheet['notice_no'] = $first->notice_no ?? $datesheet['notice_no'];
                    $datesheet['notice_date'] = is_string($first->notice_date) ? substr($first->notice_date, 0, 10) : ($first->notice_date?->format('Y-m-d') ?? $datesheet['notice_date']);
                }
            }
        } catch (\Throwable $e) {
            // Silently fall back to built-in datesheet if DB table issue occurs
        }

        // Map class and schedule for authenticated student or requested class_id
        $classId = $request->query('class_id') ? (int) $request->query('class_id') : ($request->user('sanctum')?->class_id ?? null);
        $datesheet['user_mapping'] = $this->mapUserToExams($classId, $request->user('sanctum'));

        return response()->json([
            'status' => 'success',
            'data' => $datesheet,
        ], 200);
    }

    /**
     * Map a CourseClass ID or authenticated user to the appropriate Datesheet branch and extract their personalized exams.
     */
    protected function mapUserToExams(?int $classId, ?object $user): array
    {
        $targetClassId = $classId ?? $user?->class_id;
        if (!$targetClassId) {
            return [
                'has_mapping' => false,
                'branch_key' => '3rd_cse',
                'class_info' => null,
                'my_exams' => [],
                'backlog_exams' => [],
                'minor_exams' => [],
            ];
        }

        $courseClass = CourseClass::with('branch')->find($targetClassId);
        if (!$courseClass) {
            return [
                'has_mapping' => false,
                'branch_key' => '3rd_cse',
                'class_info' => null,
                'my_exams' => [],
                'backlog_exams' => [],
                'minor_exams' => [],
            ];
        }

        $year = (int) $courseClass->year;
        $branchCode = strtoupper($courseClass->branch?->code ?? '');
        $branchName = strtoupper($courseClass->branch?->name ?? '');
        $groupName = strtoupper($courseClass->group_name ?? '');

        // Determine branch_key
        $branchKey = '3rd_cse';
        $isFirstYear = ($year === 1);

        if ($isFirstYear) {
            $branchKey = '1st_sem';
        } elseif ($year === 2) {
            if (str_contains($branchCode, 'AI') || str_contains($groupName, 'AI') || str_contains($branchName, 'ARTIFICIAL')) {
                $branchKey = '3rd_ai';
            } elseif (str_contains($branchCode, 'DS') || str_contains($groupName, 'DS') || str_contains($branchName, 'DATA')) {
                $branchKey = '3rd_ds';
            } elseif (str_contains($branchCode, 'CSE') || str_contains($groupName, 'CSE')) {
                $branchKey = '3rd_cse';
            } else {
                $branchKey = '3rd_cse';
            }
        } elseif ($year === 3) {
            if (str_contains($branchCode, 'AI') || str_contains($groupName, 'AI')) {
                $branchKey = '5th_ai';
            } elseif (str_contains($branchCode, 'DS') || str_contains($groupName, 'DS')) {
                $branchKey = '5th_ds';
            } else {
                $branchKey = '5th_cse';
            }
        } elseif ($year === 4) {
            if (str_contains($branchCode, 'AI') || str_contains($groupName, 'AI')) {
                $branchKey = '7th_ai';
            } elseif (str_contains($branchCode, 'DS') || str_contains($groupName, 'DS')) {
                $branchKey = '7th_ds';
            } else {
                $branchKey = '7th_cse';
            }
        }

        // Get regular timetable subjects for this class to cross-match
        $weeklyTimetables = Timetable::where('class_id', $targetClassId)
            ->where('type', 'weekly')
            ->get();

        $timetableSubjects = $weeklyTimetables->pluck('subject')->filter()->unique()->values()->all();

        // Query exams for this student
        $allExams = ExamDatesheet::orderBy('exam_date')->orderBy('start_time')->get();

        $myExams = [];
        $backlogExams = [];
        $minorExams = [];

        foreach ($allExams as $exam) {
            $matchedWeekly = null;
            foreach ($timetableSubjects as $sub) {
                $subUpper = strtoupper($sub);
                $codeUpper = strtoupper($exam->subject_code);
                $nameUpper = strtoupper($exam->subject_name);

                if (
                    str_contains($codeUpper, substr($subUpper, 0, 6)) ||
                    (str_contains($subUpper, 'OOP') && str_contains($nameUpper, 'ORIENTED')) ||
                    (str_contains($subUpper, 'DATA STR') && str_contains($nameUpper, 'DATA STRUCTURE')) ||
                    (str_contains($subUpper, 'DSML') && str_contains($nameUpper, 'MACHINE LEARNING')) ||
                    (str_contains($subUpper, 'DSCS') && str_contains($nameUpper, 'DISCRETE')) ||
                    (str_contains($subUpper, 'TOC') && str_contains($nameUpper, 'TOC')) ||
                    (str_contains($subUpper, 'DBMS') && str_contains($nameUpper, 'DATABASE')) ||
                    (str_contains($subUpper, 'SE') && str_contains($nameUpper, 'SOFTWARE')) ||
                    (str_contains($subUpper, 'SC') && str_contains($nameUpper, 'SOFT COMPUTING')) ||
                    (str_contains($subUpper, 'NETWORK') && str_contains($nameUpper, 'NETWORK')) ||
                    (str_contains($subUpper, 'PYTHON') && str_contains($nameUpper, 'PYTHON')) ||
                    (str_contains($subUpper, 'CALCULUS') && str_contains($nameUpper, 'CALCULUS')) ||
                    (str_contains($subUpper, 'CHEM') && str_contains($nameUpper, 'CHEM')) ||
                    (str_contains($subUpper, 'CAD') && str_contains($nameUpper, 'CAD'))
                ) {
                    $matchedWeekly = $sub;
                    break;
                }
            }

            $dateStr = is_string($exam->exam_date) ? substr($exam->exam_date, 0, 10) : $exam->exam_date->format('Y-m-d');
            $now = time();
            $examTs = strtotime($dateStr . ' ' . $exam->start_time);
            $daysDiff = $examTs > $now ? (int) ceil(($examTs - $now) / 86400) : 0;

            $examItem = [
                'id' => $exam->id,
                'exam_date' => $dateStr,
                'day_name' => $exam->day_name,
                'time_slot' => $exam->time_slot,
                'start_time' => $exam->start_time,
                'end_time' => $exam->end_time,
                'branch_key' => $exam->branch_key,
                'semester' => $exam->semester,
                'branch_name' => $exam->branch_name,
                'subject_code' => $exam->subject_code,
                'subject_name' => $exam->subject_name,
                'seating_rooms' => $exam->seating_rooms,
                'coordinator_duty' => $exam->coordinator_duty,
                'is_backlog' => (bool) $exam->is_backlog,
                'is_minor' => (bool) $exam->is_minor,
                'notes' => $exam->notes,
                'matched_regular_subject' => $matchedWeekly,
                'days_until' => $daysDiff,
            ];

            if ($exam->is_minor) {
                if ($exam->branch_key === $branchKey || str_contains($branchKey, '5th')) {
                    $minorExams[] = $examItem;
                }
            } elseif ($exam->is_backlog) {
                if ($exam->branch_key === $branchKey || ($isFirstYear && $exam->branch_key === '1st_sem')) {
                    $backlogExams[] = $examItem;
                }
            } else {
                // Regular Exam
                if ($exam->branch_key === $branchKey) {
                    $myExams[] = $examItem;
                } elseif ($isFirstYear && $exam->branch_key === '1st_sem') {
                    $isPoolB = in_array($branchCode, ['ECE', 'M&C', 'VLSI', 'AERO', 'ME', 'METTA']);
                    $code = strtoupper($exam->subject_code);
                    $name = strtoupper($exam->subject_name);

                    if ($isPoolB) {
                        if (str_contains($code, 'POOL B') || (str_contains($name, $branchCode) && !str_contains($code, 'POOL A'))) {
                            $myExams[] = $examItem;
                        }
                    } else {
                        if (str_contains($code, 'POOL A') || (!str_contains($code, 'POOL B') && !str_contains($name, 'POOL B'))) {
                            $myExams[] = $examItem;
                        }
                    }
                }
            }
        }

        return [
            'has_mapping' => true,
            'branch_key' => $branchKey,
            'class_info' => [
                'class_id' => $courseClass->id,
                'year' => $courseClass->year,
                'group_name' => $courseClass->group_name,
                'branch_code' => $courseClass->branch?->code,
                'branch_name' => $courseClass->branch?->name,
            ],
            'my_exams' => $myExams,
            'backlog_exams' => $backlogExams,
            'minor_exams' => $minorExams,
        ];
    }
}
