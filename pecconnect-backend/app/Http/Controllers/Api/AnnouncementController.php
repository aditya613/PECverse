<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AnnouncementController extends Controller
{
    /**
     * Fetch personalized feed of announcements for the logged-in user
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        // If user is not yet assigned to a class, only show global announcements
        if (!$user->class_id) {
            $announcements = Announcement::whereNull('class_id')
                ->whereNull('branch_id')
                ->latest()
                ->get();
        } else {
            // Show global + their branch + their specific class
            $class = $user->courseClass;
            $announcements = Announcement::where(function($query) use ($class) {
                $query->whereNull('class_id')->whereNull('branch_id') // Global
                      ->orWhere('branch_id', $class->branch_id) // Branch wide
                      ->orWhere('class_id', $class->id); // Class specific
            })->latest()->get();
        }

        return response()->json($announcements, 200);
    }

    /**
     * Create a new announcement (CR or Admin only)
     */
    public function store(Request $request): JsonResponse
    {
        if ($request->user()->role === 'student') {
            return response()->json(['message' => 'Unauthorized. Only CRs and Admins can post.'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'class_id' => 'nullable|exists:classes,id',
            'branch_id' => 'nullable|exists:branches,id',
            'attachment_url' => 'nullable|url',
        ]);

        $validated['posted_by'] = $request->user()->id;

        // CRs can only post to their own class or branch.
        if ($request->user()->role === 'cr') {
            if (isset($validated['class_id']) && $validated['class_id'] != $request->user()->class_id) {
                return response()->json(['message' => 'Unauthorized to post to a different class.'], 403);
            }
            if (isset($validated['branch_id']) && $validated['branch_id'] != $request->user()->courseClass->branch_id) {
                return response()->json(['message' => 'Unauthorized to post to a different branch.'], 403);
            }
            // Default to their own class if they didn't explicitly target a branch or class
            if (!isset($validated['class_id']) && !isset($validated['branch_id'])) {
                $validated['class_id'] = $request->user()->class_id;
            }
        }

        $announcement = Announcement::create($validated);

        // Push Notifications are now handled automatically by the Announcement model's 'created' event.

        return response()->json([
            'message' => 'Announcement posted successfully',
            'announcement' => $announcement->load('author')
        ], 201);
    }

    /**
     * Delete an announcement
     */
    public function destroy(Request $request, Announcement $announcement): JsonResponse
    {
        $user = $request->user();
        
        // Only the creator or a superadmin can delete an announcement
        if ($user->role !== 'superadmin' && $announcement->posted_by !== $user->id) {
            return response()->json(['message' => 'Unauthorized to delete this announcement.'], 403);
        }

        $announcement->delete();

        return response()->json(['message' => 'Announcement deleted successfully'], 200);
    }
}
