<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Note;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class NoteController extends Controller
{
    /**
     * Fetch notes for the user's class
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        if (!$user->class_id) {
            return response()->json(['message' => 'Please join a class first to view notes.'], 400);
        }

        // Optional filtering by subject
        $query = Note::where('class_id', $user->class_id);
        
        if ($request->has('subject')) {
            $query->where('subject', 'like', '%' . $request->subject . '%');
        }

        return response()->json($query->latest()->get(), 200);
    }

    /**
     * Create a new note entry
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        if ($user->role === 'student') {
            return response()->json(['message' => 'Unauthorized. Only CRs can upload notes currently.'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subject' => 'required|string|max:255',
            'file_url' => 'required|url',
            'file_type' => 'nullable|string|max:50',
        ]);

        $validated['class_id'] = $user->class_id;
        $validated['uploaded_by'] = $user->id;

        $note = Note::create($validated);

        return response()->json(['message' => 'Note uploaded successfully', 'note' => $note->load('uploader')], 201);
    }

    /**
     * Increment download count when a user downloads the note
     */
    public function incrementDownloads(Note $note): JsonResponse
    {
        $note->increment('downloads_count');
        return response()->json(['message' => 'Count incremented', 'downloads_count' => $note->downloads_count], 200);
    }

    /**
     * Delete a note
     */
    public function destroy(Request $request, Note $note): JsonResponse
    {
        $user = $request->user();
        
        if ($user->role !== 'superadmin' && $note->uploaded_by !== $user->id) {
            return response()->json(['message' => 'Unauthorized to delete this note.'], 403);
        }

        $note->delete();

        return response()->json(['message' => 'Note deleted successfully'], 200);
    }
}
