<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CourseClass;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ClassMemberController extends Controller
{
    /**
     * Get the roster of students enrolled in the authenticated user's class.
     * 
     * Security & Privacy Guarantees:
     * - Strictly scoped to $request->user()->class_id. Students can NEVER view other classes.
     * - Email addresses, phone numbers, tokens, and passwords are completely excluded.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            if (!$user->class_id) {
                return response()->json([
                    'message' => 'You have not joined a class yet. Please set your class in Profile first.',
                    'class' => null,
                    'stats' => [
                        'total_enrolled' => 0,
                        'is_viewer_cr' => false,
                    ],
                    'members' => [],
                ], 400);
            }

            // Retrieve class details with branch and CR information
            $courseClass = CourseClass::with(['branch:id,name,code', 'cr:id,name,roll_no,profile_photo'])
                ->find($user->class_id);

            if (!$courseClass) {
                return response()->json([
                    'message' => 'Class not found. Please re-select your class in Profile.',
                ], 404);
            }

            $isViewerCr = ($user->role === 'cr' || $user->role === 'superadmin' || $courseClass->cr_user_id === $user->id);

            $search = trim((string) $request->query('search', ''));
            $sort = $request->query('sort', 'roll_no'); // 'roll_no', 'name', 'latest'

            // Query ONLY users belonging to this specific class
            $query = User::where('class_id', $user->class_id)
                ->select([
                    'id',
                    'name',
                    'roll_no',
                    'role',
                    'profile_photo',
                    'created_at',
                ]);

            // Optional search by name or roll number
            if ($search !== '') {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('roll_no', 'like', "%{$search}%");
                });
            }

            // Sort logic
            switch ($sort) {
                case 'name':
                    $query->orderBy('name', 'asc');
                    break;
                case 'latest':
                    $query->orderBy('created_at', 'desc');
                    break;
                case 'roll_no':
                default:
                    // Order by roll_no naturally; put nulls/empty roll numbers at the end
                    $query->orderByRaw("CASE WHEN roll_no IS NULL OR roll_no = '' THEN 1 ELSE 0 END, roll_no ASC, name ASC");
                    break;
            }

            $members = $query->get()->map(function ($member) use ($courseClass) {
                return [
                    'id' => $member->id,
                    'name' => $member->name,
                    'roll_no' => $member->roll_no ? strtoupper($member->roll_no) : null,
                    'profile_photo' => $member->profile_photo,
                    'role' => $member->role,
                    'is_cr' => ($member->role === 'cr' || $courseClass->cr_user_id === $member->id),
                    'joined_at' => $member->created_at ? $member->created_at->toISOString() : null,
                ];
            });

            // Overall class headcount (unfiltered)
            $totalEnrolled = User::where('class_id', $user->class_id)->count();

            return response()->json([
                'class' => [
                    'id' => $courseClass->id,
                    'group_name' => $courseClass->group_name,
                    'year' => $courseClass->year,
                    'branch' => $courseClass->branch?->name ?? 'Punjab Engineering College',
                    'branch_code' => $courseClass->branch?->code ?? null,
                    'cr' => $courseClass->cr ? [
                        'id' => $courseClass->cr->id,
                        'name' => $courseClass->cr->name,
                        'roll_no' => $courseClass->cr->roll_no ? strtoupper($courseClass->cr->roll_no) : null,
                    ] : null,
                ],
                'stats' => [
                    'total_enrolled' => $totalEnrolled,
                    'matching_count' => $members->count(),
                    'is_viewer_cr' => $isViewerCr,
                ],
                'members' => $members,
            ], 200);

        } catch (\Throwable $e) {
            Log::error('ClassMemberController index error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Unable to load class members at this time.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}
