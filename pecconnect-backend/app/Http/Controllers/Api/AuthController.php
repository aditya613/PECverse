<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    /**
     * Handle Google Sign-in via API (Mobile App sends token)
     */
    public function googleLogin(Request $request): JsonResponse
    {
        $request->validate([
            'token' => 'required|string', // The access_token from Expo Google Login
        ]);

        try {
            // Retrieve user details from Google using the access token
            $googleUser = Socialite::driver('google')->stateless()->userFromToken($request->token);
            
            // SECURITY: Ensure the email belongs to the pec.edu.in domain
            if (!Str::endsWith($googleUser->email, '@pec.edu.in')) {
                return response()->json([
                    'message' => 'Unauthorized. Please login with your official @pec.edu.in email address.'
                ], 403);
            }

            $rawName = $googleUser->name;
            $cleanName = $rawName;
            $rollNo = null;

            // Extract roll number from the name if it exists (e.g. "bt25103008 Aditya Gupta")
            // Match an alphanumeric string that has at least 4 digits (e.g. bt25103008, 20103008)
            if (preg_match('/\b([a-zA-Z]{0,5}\d{5,10})\b/i', $rawName, $matches)) {
                $rollNo = strtolower($matches[1]);
                // Remove the roll number from the name to clean it up
                $cleanName = trim(str_replace($matches[0], '', $rawName));
                // Remove any lingering newlines, hyphens, or extra spaces
                $cleanName = trim(preg_replace('/\s+/', ' ', $cleanName), " \t\n\r\0\x0B-");
            } else {
                // Fallback to email parsing if not found in name
                $emailParts = explode('@', $googleUser->email);
                $localPart = $emailParts[0];
                if (preg_match('/\.([a-zA-Z0-9]+)$/', $localPart, $matches)) {
                    $rollNo = strtolower($matches[1]);
                }
            }

            // Find or create the user
            $user = User::updateOrCreate(
                ['email' => $googleUser->email],
                [
                    'name' => $cleanName,
                    'google_id' => $googleUser->id,
                    'profile_photo' => $googleUser->avatar,
                ]
            );

            // Update roll no if we found a valid one
            if ($rollNo) {
                $user->roll_no = $rollNo;
                $user->save();
            }

            // Revoke any existing tokens for security (optional, but good for forcing single device login)
            // $user->tokens()->delete(); 

            // Create a new Sanctum API token
            $token = $user->createToken('MobileAppToken')->plainTextToken;

            return response()->json([
                'message' => 'Login successful',
                'token' => $token,
                'user' => $user->load('courseClass'), // Return user with their class info
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to authenticate with Google.',
                'error' => $e->getMessage()
            ], 401);
        }
    }

    /**
     * Logout the user by revoking their token
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ], 200);
    }

    /**
     * Get the authenticated user's profile
     */
    public function profile(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $request->user()->load(['courseClass.branch', 'courseClass.cr'])
        ], 200);
    }

    /**
     * Update the user's assigned class
     */
    public function updateClass(Request $request): JsonResponse
    {
        $request->validate([
            'class_id' => 'required|exists:classes,id',
        ]);

        $user = $request->user();
        
        // CRITICAL ROBUSTNESS: If a CR changes class, demote them to standard student to prevent abuse
        if ($user->role === 'cr' && $user->class_id !== $request->class_id) {
            $user->role = 'student';
            
            // Also nullify their CR status in the CourseClass model if they were the official CR for the old class
            if ($user->class_id) {
                $oldClass = \App\Models\CourseClass::find($user->class_id);
                if ($oldClass && $oldClass->cr_user_id === $user->id) {
                    $oldClass->cr_user_id = null;
                    $oldClass->save();
                }
            }
        }
        
        $user->class_id = $request->class_id;
        $user->save();

        return response()->json([
            'message' => 'Class assigned successfully',
            'user' => $user->load(['courseClass.branch', 'courseClass.cr'])
        ], 200);
    }

    /**
     * Register Expo Push Token
     */
    public function updatePushToken(Request $request): JsonResponse
    {
        $request->validate([
            'token' => 'required|string',
        ]);

        $user = $request->user();
        $user->expo_push_token = $request->token;
        $user->save();

        return response()->json([
            'message' => 'Push token registered successfully'
        ], 200);
    }
    /**
     * Guest/Reviewer Login for App Store Connect & Google Play Console
     */
    public function guestLogin(): JsonResponse
    {
        // Ensure a default class exists for the reviewer
        $class = \App\Models\CourseClass::first();
        
        $user = User::firstOrCreate(
            ['email' => 'apple.reviewer@pec.edu.in'],
            [
                'name' => 'App Reviewer',
                'password' => bcrypt(\Illuminate\Support\Str::random(16)),
                'google_id' => 'mock_reviewer_123',
                'role' => 'student',
                'class_id' => $class ? $class->id : null,
                'roll_no' => 'REV001'
            ]
        );

        // --- Mock Data Seeding for App Store Reviewers ---
        // If the reviewer has no attendance data, let's pre-populate some so the app looks alive
        if (\App\Models\AttendanceSubject::where('user_id', $user->id)->count() === 0) {
            $subj1 = \App\Models\AttendanceSubject::create([
                'user_id' => $user->id,
                'name' => 'Software Engineering',
                'target_percentage' => 75,
                'attended_classes' => 12,
                'total_classes' => 15
            ]);
            
            \App\Models\AttendanceSubject::create([
                'user_id' => $user->id,
                'name' => 'Computer Networks',
                'target_percentage' => 75,
                'attended_classes' => 5, // Dropped below 75% to show dynamic insights
                'total_classes' => 10
            ]);

            \App\Models\AttendanceLog::create([
                'subject_id' => $subj1->id,
                'status' => 'attended',
                'timestamp' => now()->subDays(1)
            ]);
            \App\Models\AttendanceLog::create([
                'subject_id' => $subj1->id,
                'status' => 'bunked',
                'timestamp' => now()->subDays(2)
            ]);
        }
        // -------------------------------------------------

        $token = $user->createToken('guest-token')->plainTextToken;

        return response()->json([
            'message' => 'Reviewer login successful',
            'token' => $token,
            'user' => $user->load(['courseClass.branch', 'courseClass.cr'])
        ], 200);
    }
}
