<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SeniorAdvice;
use App\Models\SeniorQuestion;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SeniorAdviceController extends Controller
{
    /**
     * Get all senior advice cards
     */
    public function index(Request $request): JsonResponse
    {
        $category = $request->query('category');

        $query = SeniorAdvice::query();

        if ($category && strtolower($category) !== 'all') {
            $query->where('category', $category);
        }

        $advices = $query->orderBy('likes_count', 'desc')->get();

        return response()->json(['advices' => $advices], 200);
    }

    /**
     * Like an advice card
     */
    public function like($id): JsonResponse
    {
        $advice = SeniorAdvice::findOrFail($id);
        $advice->increment('likes_count');

        return response()->json([
            'message' => 'Liked successfully',
            'likes_count' => $advice->likes_count,
        ], 200);
    }

    /**
     * Ask an anonymous question to seniors
     */
    public function askQuestion(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'question' => 'required|string|max:500',
            'device_id' => 'nullable|string',
        ]);

        $fresher = $request->authenticated_fresher;

        $question = SeniorQuestion::create([
            'question' => $validated['question'],
            'device_id' => $fresher ? $fresher->device_id : ($validated['device_id'] ?? null),
            'user_id' => null,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Question submitted! Seniors will answer soon.',
            'question' => $question,
        ], 201);
    }

    /**
     * Get list of answered questions
     */
    public function getQuestions(): JsonResponse
    {
        $questions = SeniorQuestion::where('status', 'answered')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['questions' => $questions], 200);
    }
    /**
     * Get list of pending questions (for logged-in seniors)
     */
    public function getPendingQuestions(): JsonResponse
    {
        $questions = SeniorQuestion::where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['questions' => $questions], 200);
    }

    /**
     * Answer a pending question (for logged-in seniors)
     */
    public function answerQuestion(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'answer' => 'required|string|max:1000',
            'category' => 'required|string',
            'title' => 'required|string|max:200',
        ]);

        $question = SeniorQuestion::findOrFail($id);

        if ($question->status === 'answered') {
            return response()->json(['message' => 'Question is already answered'], 400);
        }

        $user = $request->user();

        // Mark question as answered
        $question->update([
            'status' => 'answered',
            'answer' => $validated['answer'],
            'answered_by' => $user->id,
        ]);

        // Create the public Advice card
        $advice = SeniorAdvice::create([
            'title' => $validated['title'],
            'content' => "Q: " . $question->question . "\n\nA: " . $validated['answer'],
            'category' => $validated['category'],
            'author_name' => $user->name,
            'author_batch' => $user->batch ?? 'Senior',
        ]);

        return response()->json([
            'message' => 'Answer posted successfully!',
            'advice' => $advice
        ], 200);
    }

    /**
     * Delete a pending question (for freshers)
     */
    public function deleteQuestion(Request $request, $id): JsonResponse
    {
        $fresher = $request->authenticated_fresher;
        $question = SeniorQuestion::findOrFail($id);

        if ($question->device_id !== $fresher->device_id) {
            return response()->json(['message' => 'Unauthorized to delete this question.'], 403);
        }

        if ($question->status !== 'pending') {
            return response()->json(['message' => 'Cannot delete an answered question.'], 400);
        }

        $question->delete();

        return response()->json(['message' => 'Question deleted successfully'], 200);
    }

    /**
     * Delete an advice card (for seniors)
     */
    public function deleteAdvice(Request $request, $id): JsonResponse
    {
        $user = $request->user();
        $advice = SeniorAdvice::findOrFail($id);

        // Optional: Check if the user is the author. 
        // Currently, SeniorAdvice doesn't store author_id explicitly, just author_name.
        // But SeniorQuestion stores answered_by. We could find the question and check.
        // For now, allow any senior to delete advice if they need to moderate, or strictly check.
        
        $advice->delete();

        return response()->json(['message' => 'Advice deleted successfully'], 200);
    }
}
