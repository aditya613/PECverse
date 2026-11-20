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
     * Get the official CSE Department End Term Examination Datesheet (Revision II) (26th November – 5th December 2026).
     */
    public function index(Request $request): JsonResponse
    {
        $datesheet = [
            'notice_no' => 'PEC/CSE/326',
            'notice_date' => '2026-11-20',
            'title' => 'CSE Department Datesheet for End Term Examinations (Revision II)',
            'period' => '26th November – 5th December 2026',
            'department' => 'Computer Science & Engineering',
            'institution' => 'Punjab Engineering College (Deemed to be University), Chandigarh',
            'branches' => [
                ['id' => 'all', 'label' => 'All Branches (Master Grid)', 'semester' => 'All', 'branch' => 'All'],
                ['id' => '1st_sem', 'label' => '1st Sem (Central / Backlog)', 'semester' => '1st Sem', 'branch' => 'Institute Common'],
                ['id' => '3rd_cse', 'label' => '3rd Sem CSE', 'semester' => '3rd Sem', 'branch' => 'CSE'],
                ['id' => '3rd_ds', 'label' => '3rd Sem DS', 'semester' => '3rd Sem', 'branch' => 'Data Science'],
                ['id' => '3rd_ai', 'label' => '3rd Sem AI', 'semester' => '3rd Sem', 'branch' => 'AI'],
                ['id' => '5th_cse', 'label' => '5th Sem CSE', 'semester' => '5th Sem', 'branch' => 'CSE'],
                ['id' => '5th_ds', 'label' => '5th Sem DS', 'semester' => '5th Sem', 'branch' => 'Data Science'],
                ['id' => '5th_ai', 'label' => '5th Sem AI', 'semester' => '5th Sem', 'branch' => 'AI'],
                ['id' => '7th_cse', 'label' => '7th Sem CSE', 'semester' => '7th Sem', 'branch' => 'CSE'],
                ['id' => '7th_ds', 'label' => '7th Sem DS', 'semester' => '7th Sem', 'branch' => 'Data Science'],
                ['id' => '7th_ai', 'label' => '7th Sem AI', 'semester' => '7th Sem', 'branch' => 'AI'],
            ],
            'instructions' => [
                'Students must occupy their allotted seats 15 minutes before the commencement of the examination.',
                'Carrying Institute Identity Card and End-Term Admit Card is mandatory.',
                'Mobile phones, smartwatches, programmable calculators, or any unauthorized electronic gadgets are strictly banned inside examination halls.',
                'Seating centers (DH1 to DH5, L10, L26 to L31) will be displayed on the department notice board.',
                'Backlog papers of 1st-semester courses for 3rd-semester students will be held as per the central datesheet.',
            ],
            'schedule' => [],
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
            // Silently fall back
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
                'is_covered_branch' => false,
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
                'is_covered_branch' => false,
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
        $isCoveredBranch = true;

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
                $isCoveredBranch = false;
                $branchKey = '3rd_cse';
            }
        } elseif ($year === 3) {
            if (str_contains($branchCode, 'AI') || str_contains($groupName, 'AI')) {
                $branchKey = '5th_ai';
            } elseif (str_contains($branchCode, 'DS') || str_contains($groupName, 'DS')) {
                $branchKey = '5th_ds';
            } elseif (str_contains($branchCode, 'CSE') || str_contains($groupName, 'CSE')) {
                $branchKey = '5th_cse';
            } else {
                $isCoveredBranch = false;
                $branchKey = '5th_cse';
            }
        } elseif ($year === 4) {
            if (str_contains($branchCode, 'AI') || str_contains($groupName, 'AI')) {
                $branchKey = '7th_ai';
            } elseif (str_contains($branchCode, 'DS') || str_contains($groupName, 'DS')) {
                $branchKey = '7th_ds';
            } elseif (str_contains($branchCode, 'CSE') || str_contains($groupName, 'CSE')) {
                $branchKey = '7th_cse';
            } else {
                $isCoveredBranch = false;
                $branchKey = '7th_cse';
            }
        } else {
            $isCoveredBranch = false;
            $branchKey = '3rd_cse';
        }

        // Fetch user's regular subjects from Timetable
        $regularSubjects = Timetable::where('class_id', $targetClassId)
            ->whereNotNull('subject_name')
            ->distinct()
            ->pluck('subject_name')
            ->toArray();

        // Query branch exams from ExamDatesheet table
        $allExams = ExamDatesheet::where('branch_key', $branchKey)
            ->orderBy('exam_date')
            ->orderBy('start_time')
            ->get();

        $myExams = [];
        $backlogExams = [];
        $minorExams = [];

        foreach ($allExams as $exam) {
            $formatted = [
                'id' => $exam->id,
                'exam_date' => is_string($exam->exam_date) ? substr($exam->exam_date, 0, 10) : $exam->exam_date->format('Y-m-d'),
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
                'matched_regular_subject' => null,
            ];

            // Match with student's timetable subjects
            foreach ($regularSubjects as $regSub) {
                if (stripos($exam->subject_name, $regSub) !== false || stripos($regSub, $exam->subject_name) !== false) {
                    $formatted['matched_regular_subject'] = $regSub;
                    break;
                }
            }

            if ($exam->is_backlog) {
                $backlogExams[] = $formatted;
            } elseif ($exam->is_minor) {
                $minorExams[] = $formatted;
            } else {
                $myExams[] = $formatted;
            }
        }

        return [
            'has_mapping' => true,
            'is_covered_branch' => $isCoveredBranch,
            'notice_message' => $isCoveredBranch ? null : "End term datesheet for {$branchName} is currently under preparation by your department and will appear once published.",
            'branch_key' => $branchKey,
            'class_info' => [
                'class_id' => $courseClass->id,
                'year' => $year,
                'group_name' => $courseClass->group_name,
                'branch_code' => $branchCode,
                'branch_name' => $courseClass->branch?->name ?? 'Computer Science',
            ],
            'my_exams' => $myExams,
            'backlog_exams' => $backlogExams,
            'minor_exams' => $minorExams,
        ];
    }
}
