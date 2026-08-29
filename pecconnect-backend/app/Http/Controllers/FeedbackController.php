<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Feedback;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FeedbackController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'message' => 'required|string|max:2000',
            'type' => 'required|in:bug,suggestion,general',
        ]);

        $feedback = Feedback::create([
            'user_id' => $request->user()->id,
            'message' => $validated['message'],
            'type' => $validated['type'],
        ]);

        $webhookUrl = config('services.discord.feedback_webhook') ?: env('DISCORD_FEEDBACK_WEBHOOK_URL');
        
        if ($webhookUrl) {
            try {
                $color = match($feedback->type) {
                    'bug' => 16711680, // Red
                    'suggestion' => 65280, // Green
                    default => 3447003, // Blue
                };

                $userName = (string) ($request->user()->name ?: 'Unknown');
                $userRoll = (string) ($request->user()->roll_no ?: 'N/A');
                $userEmail = (string) ($request->user()->email ?: 'N/A');

                $response = Http::timeout(10)->post($webhookUrl, [
                    'embeds' => [
                        [
                            'title' => '📢 New App Feedback Received',
                            'description' => $feedback->message,
                            'color' => $color,
                            'fields' => [
                                ['name' => 'Type', 'value' => ucfirst($feedback->type), 'inline' => true],
                                ['name' => 'User', 'value' => $userName, 'inline' => true],
                                ['name' => 'Roll No', 'value' => $userRoll, 'inline' => true],
                                ['name' => 'Email', 'value' => $userEmail, 'inline' => false],
                            ],
                            'timestamp' => now()->toIso8601String(),
                        ]
                    ]
                ]);

                if (!$response->successful()) {
                    Log::error("Discord webhook returned non-success status [{$response->status()}]: " . $response->body());
                }
            } catch (\Exception $e) {
                Log::error("Failed to send Discord webhook: " . $e->getMessage());
            }
        } else {
            Log::warning("DISCORD_FEEDBACK_WEBHOOK_URL is not configured in .env or config. Feedback #{$feedback->id} saved to DB without notification.");
        }

        return response()->json([
            'message' => 'Feedback submitted successfully',
            'feedback' => $feedback
        ], 201);
    }
}
