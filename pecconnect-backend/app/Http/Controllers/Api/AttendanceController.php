<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AttendanceSubject;
use App\Models\AttendanceLog;
use Illuminate\Support\Facades\DB;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $subjects = AttendanceSubject::where('user_id', $request->user()->id)
            ->with(['logs' => function($query) {
                $query->latest();
            }])
            ->get();
            
        return response()->json($subjects);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'target_percentage' => 'nullable|integer|min:1|max:100'
        ]);

        $subject = AttendanceSubject::create([
            'user_id' => $request->user()->id,
            'name' => $request->name,
            'target_percentage' => $request->target_percentage ?? 75,
            'attended_classes' => 0,
            'bunked_classes' => 0
        ]);
        
        $subject->load('logs');

        return response()->json($subject, 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'nullable|string|max:255',
            'target_percentage' => 'nullable|integer|min:1|max:100'
        ]);

        $subject = AttendanceSubject::where('user_id', $request->user()->id)->findOrFail($id);
        
        if ($request->has('name')) {
            $subject->name = $request->name;
        }
        if ($request->has('target_percentage')) {
            $subject->target_percentage = $request->target_percentage;
        }
        $subject->save();

        return response()->json($subject->fresh('logs'));
    }

    public function updateLog(Request $request, $id)
    {
        $request->validate([
            'type' => 'required|in:attended,bunked'
        ]);

        $subject = AttendanceSubject::where('user_id', $request->user()->id)->findOrFail($id);
        $type = $request->type;

        DB::transaction(function () use ($subject, $type, $request) {
            // Insert audit log
            AttendanceLog::create([
                'user_id' => $request->user()->id,
                'attendance_subject_id' => $subject->id,
                'type' => $type
            ]);

            // Recount directly from logs to guarantee zero drift and prevent negative counts
            $subject->attended_classes = AttendanceLog::where('attendance_subject_id', $subject->id)
                ->where('type', 'attended')
                ->count();
            $subject->bunked_classes = AttendanceLog::where('attendance_subject_id', $subject->id)
                ->where('type', 'bunked')
                ->count();
            $subject->save();
        });

        return response()->json($subject->fresh('logs'));
    }

    public function destroyLog(Request $request, $logId)
    {
        $log = AttendanceLog::where('user_id', $request->user()->id)->findOrFail($logId);
        $subject = $log->subject;

        DB::transaction(function () use ($log, $subject) {
            $log->delete();

            // Recount directly from logs after deletion to guarantee zero drift
            $subject->attended_classes = AttendanceLog::where('attendance_subject_id', $subject->id)
                ->where('type', 'attended')
                ->count();
            $subject->bunked_classes = AttendanceLog::where('attendance_subject_id', $subject->id)
                ->where('type', 'bunked')
                ->count();
            $subject->save();
        });

        return response()->json($subject->fresh('logs'));
    }

    public function resetStats(Request $request, $id)
    {
        $subject = AttendanceSubject::where('user_id', $request->user()->id)->findOrFail($id);

        DB::transaction(function () use ($subject) {
            AttendanceLog::where('attendance_subject_id', $subject->id)->delete();
            $subject->attended_classes = 0;
            $subject->bunked_classes = 0;
            $subject->save();
        });

        return response()->json($subject->fresh('logs'));
    }

    public function destroy(Request $request, $id)
    {
        $subject = AttendanceSubject::where('user_id', $request->user()->id)->findOrFail($id);
        $subject->delete();
        
        return response()->json(['message' => 'Deleted successfully']);
    }
}
