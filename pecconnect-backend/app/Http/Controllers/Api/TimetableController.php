<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Timetable;
use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TimetableController extends Controller
{
    /**
     * Get all timetable entries for the user's class (Weekly + Exceptions)
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        if (!$user->class_id) {
            return response()->json(['message' => 'Please join a class first to view your timetable.'], 400);
        }

        // Return all classes for the user's class ID. The frontend will merge base weekly and date-specific classes.
        $classes = Timetable::where('class_id', $user->class_id)
            ->orderBy('start_time')
            ->get();

        return response()->json($classes, 200);
    }

    /**
     * Create a new timetable entry (Weekly Template or Single Extra Class) - CR Only
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        if ($user->role !== 'cr' && $user->role !== 'superadmin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'type' => 'required|in:weekly,single',
            'day_of_week' => 'required_if:type,weekly|nullable|integer|min:1|max:7',
            'date' => 'required_if:type,single|nullable|date',
            'period_no' => 'nullable|integer|min:1',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'subject' => 'required|string|max:255',
            'teacher' => 'nullable|string|max:255',
            'room' => 'nullable|string|max:100',
        ]);

        $validated['class_id'] = $user->class_id;

        $timetable = Timetable::create($validated);

        // Auto-generate Announcement
        $dateStr = $timetable->type === 'weekly' 
            ? "Every " . config('app.days')[$timetable->day_of_week] ?? 'Week'
            : date('M j, Y', strtotime($timetable->date));
            
        Announcement::create([
            'title' => 'New Class Scheduled',
            'body' => "A new {$timetable->type} class for **{$timetable->subject}** has been scheduled.\n\n**When:** {$dateStr} at " . date('h:i A', strtotime($timetable->start_time)) . "\n**Room:** " . ($timetable->room ?? 'TBA') . "\n**Teacher:** " . ($timetable->teacher ?? 'TBA'),
            'class_id' => $timetable->class_id,
            'posted_by' => $user->id,
        ]);

        return response()->json(['message' => 'Class scheduled successfully', 'timetable' => $timetable], 201);
    }

    /**
     * Delete a timetable entry (Weekly or Single)
     */
    public function destroy(Request $request, Timetable $timetable): JsonResponse
    {
        $user = $request->user();
        if (($user->role !== 'cr' || $user->class_id !== $timetable->class_id) && $user->role !== 'superadmin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $classId = $timetable->class_id;
        $subject = $timetable->subject;
        $type = $timetable->type;
        $timetable->delete();

        // Auto-generate Announcement
        Announcement::create([
            'title' => 'Class Removed',
            'body' => "The {$type} class for **{$subject}** has been permanently removed from the timetable.",
            'class_id' => $classId,
            'posted_by' => $user->id,
        ]);

        return response()->json(['message' => 'Class removed'], 200);
    }

    /**
     * Add an Override Exception (Cancel/Reschedule)
     */
    public function storeException(Request $request): JsonResponse
    {
        error_log("STORE EXCEPTION CALLED: " . json_encode($request->all()));
        try {
            $user = $request->user();
            if ($user->role !== 'cr' && $user->role !== 'superadmin') {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $validated = $request->validate([
                'timetable_id' => 'required|exists:timetables,id',
                'date' => 'required|date',
                'type' => 'required|in:cancelled', // Only cancellations supported now
                'reason' => 'nullable|string|max:255',
            ]);

            $originalTimetable = Timetable::findOrFail($validated['timetable_id']);

            // Security: Ensure CRs can only override timetables in their own class
            if ($user->role !== 'superadmin' && $originalTimetable->class_id !== $user->class_id) {
                return response()->json(['message' => 'Unauthorized: Cannot override a timetable from another class'], 403);
            }

            // We allow overriding both 'weekly' and 'single' classes now, so no check is needed here.

            // Check if there is already an exception for this class on this date
            $existingOverride = Timetable::where('original_timetable_id', $originalTimetable->id)
                ->where('date', $validated['date'])
                ->first();

            if ($existingOverride) {
                $existingOverride->delete(); // Replace the old override
            }

            $override = Timetable::create([
                'class_id' => $user->class_id,
                'type' => $validated['type'], // Always 'cancelled'
                'original_timetable_id' => $originalTimetable->id,
                'date' => $validated['date'],
                'start_time' => $originalTimetable->getRawOriginal('start_time'),
                'end_time' => $originalTimetable->getRawOriginal('end_time'),
                'subject' => $originalTimetable->subject,
                'teacher' => $originalTimetable->teacher,
                'room' => $originalTimetable->room,
                'reason' => $validated['reason'] ?? null,
                'period_no' => $originalTimetable->period_no,
            ]);

            // Auto-generate Announcement
            $dateStr = date('M j, Y', strtotime($override->date));
            $reasonStr = $override->reason ? "\n**Reason:** {$override->reason}" : "";
            Announcement::create([
                'title' => 'Class Cancelled',
                'body' => "The class for **{$override->subject}** scheduled on **{$dateStr}** has been cancelled.{$reasonStr}",
                'class_id' => $override->class_id,
                'posted_by' => $user->id,
            ]);

            return response()->json(['message' => 'Class cancelled successfully', 'exception' => $override], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Illuminate\Support\Facades\Log::error('Validation Error: ' . json_encode($e->errors()));
            throw $e;
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Timetable Error: ' . $e->getMessage() . ' Trace: ' . $e->getTraceAsString());
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}
