<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Timetable;
use App\Models\Announcement;
use App\Models\Holiday;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TimetableController extends Controller
{
    /**
     * Get all timetable entries for the user's class (Weekly + Exceptions) + Holidays
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

        // Return all declared holidays for this class
        $holidays = Holiday::where('class_id', $user->class_id)
            ->get();

        // Backward compatibility: old app expects raw array. New app sends ?v=2
        if ($request->query('v') === '2') {
            return response()->json([
                'classes' => $classes,
                'holidays' => $holidays
            ], 200);
        }

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
        $daysMap = [1 => 'Monday', 2 => 'Tuesday', 3 => 'Wednesday', 4 => 'Thursday', 5 => 'Friday', 6 => 'Saturday', 7 => 'Sunday'];
        $dateStr = $timetable->type === 'weekly' 
            ? "Every " . ($daysMap[$timetable->day_of_week] ?? 'Week')
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
     * Declare a Full Day Holiday
     */
    public function declareHoliday(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            if ($user->role !== 'cr' && $user->role !== 'superadmin') {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            if (!$user->class_id) {
                return response()->json(['message' => 'Please select a class before declaring a holiday.'], 400);
            }

            $validated = $request->validate([
                'date' => 'required|date',
                'reason' => 'nullable|string|max:255',
            ]);

            // Format date to Y-m-d standard
            $cleanDate = date('Y-m-d', strtotime($validated['date']));

            // Check if holiday already exists for this date
            $existingHoliday = Holiday::where('class_id', $user->class_id)
                ->where('date', $cleanDate)
                ->first();

            if ($existingHoliday) {
                return response()->json(['message' => 'A holiday is already declared for this date.'], 400);
            }

            $holiday = Holiday::create([
                'class_id' => $user->class_id,
                'date' => $cleanDate,
                'reason' => $validated['reason'] ?? null,
                'declared_by' => $user->id,
            ]);

            // Auto-generate Announcement
            $dateStr = date('l, M j, Y', strtotime($holiday->date));
            $reasonStr = $holiday->reason ? "\n**Reason:** {$holiday->reason}" : "";

            Announcement::create([
                'title' => 'Holiday Declared 🌴',
                'body' => "**{$dateStr}** has been declared a full-day holiday for our class! No classes will be held.{$reasonStr}",
                'class_id' => $holiday->class_id,
                'posted_by' => $user->id,
            ]);

            return response()->json(['message' => 'Holiday declared successfully', 'holiday' => $holiday], 201);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Holiday Error: ' . $e->getMessage());
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove / Delete a declared Holiday
     */
    public function destroyHoliday(Request $request, $id): JsonResponse
    {
        $user = $request->user();
        if ($user->role !== 'cr' && $user->role !== 'superadmin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $holiday = Holiday::findOrFail($id);

        if ($user->role !== 'superadmin' && $holiday->class_id !== $user->class_id) {
            return response()->json(['message' => 'Unauthorized: Cannot remove holiday for another class'], 403);
        }

        $dateStr = date('l, M j, Y', strtotime($holiday->date));
        $classId = $holiday->class_id;
        $holiday->delete();

        // Auto-generate Announcement
        Announcement::create([
            'title' => 'Holiday Cancelled 📅',
            'body' => "The holiday on **{$dateStr}** has been cancelled. Regular timetable schedule will resume.",
            'class_id' => $classId,
            'posted_by' => $user->id,
        ]);

        return response()->json(['message' => 'Holiday removed successfully'], 200);
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
                'type' => 'required|in:cancelled,rescheduled',
                'reason' => 'nullable|string|max:255',
                'start_time' => 'required_if:type,rescheduled|date_format:H:i',
                'end_time' => 'required_if:type,rescheduled|date_format:H:i|after:start_time',
                'room' => 'nullable|string|max:100',
            ]);

            $originalTimetable = Timetable::findOrFail($validated['timetable_id']);

            if ($user->role !== 'superadmin' && $originalTimetable->class_id !== $user->class_id) {
                return response()->json(['message' => 'Unauthorized: Cannot override a timetable from another class'], 403);
            }

            $existingOverride = Timetable::where('original_timetable_id', $originalTimetable->id)
                ->where('date', $validated['date'])
                ->first();

            if ($existingOverride) {
                $existingOverride->delete(); // Replace the old override
            }

            $override = Timetable::create([
                'class_id' => $user->class_id,
                'type' => $validated['type'], 
                'original_timetable_id' => $originalTimetable->id,
                'date' => $validated['date'],
                'start_time' => $validated['type'] === 'rescheduled' ? $validated['start_time'] : $originalTimetable->getRawOriginal('start_time'),
                'end_time' => $validated['type'] === 'rescheduled' ? $validated['end_time'] : $originalTimetable->getRawOriginal('end_time'),
                'subject' => $originalTimetable->subject,
                'teacher' => $originalTimetable->teacher,
                'room' => $validated['type'] === 'rescheduled' ? ($validated['room'] ?? $originalTimetable->room) : $originalTimetable->room,
                'reason' => $validated['reason'] ?? null,
                'period_no' => $originalTimetable->period_no,
            ]);

            // Auto-generate Announcement
            $dateStr = date('M j, Y', strtotime($override->date));
            $reasonStr = $override->reason ? "\n**Note:** {$override->reason}" : "";
            
            if ($override->type === 'cancelled') {
                $title = 'Class Cancelled';
                $body = "The class for **{$override->subject}** scheduled on **{$dateStr}** has been cancelled.{$reasonStr}";
            } else {
                $title = 'Class Rescheduled';
                $body = "The class for **{$override->subject}** on **{$dateStr}** has been rescheduled.\n\n**New Time:** " . date('h:i A', strtotime($override->start_time)) . " - " . date('h:i A', strtotime($override->end_time)) . "\n**New Room:** " . ($override->room ?? 'TBA') . "{$reasonStr}";
            }

            Announcement::create([
                'title' => $title,
                'body' => $body,
                'class_id' => $override->class_id,
                'posted_by' => $user->id,
            ]);

            return response()->json(['message' => "Class {$override->type} successfully", 'exception' => $override], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Illuminate\Support\Facades\Log::error('Validation Error: ' . json_encode($e->errors()));
            throw $e;
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Timetable Error: ' . $e->getMessage() . ' Trace: ' . $e->getTraceAsString());
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    /**
     * Update a permanent timetable entry (Weekly or Single)
     */
    public function update(Request $request, Timetable $timetable): JsonResponse
    {
        $user = $request->user();
        if (($user->role !== 'cr' || $user->class_id !== $timetable->class_id) && $user->role !== 'superadmin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'subject' => 'required|string|max:255',
            'teacher' => 'nullable|string|max:255',
            'room' => 'nullable|string|max:100',
        ]);

        $timetable->update($validated);

        return response()->json(['message' => 'Timetable routine updated successfully', 'timetable' => $timetable], 200);
    }
}
