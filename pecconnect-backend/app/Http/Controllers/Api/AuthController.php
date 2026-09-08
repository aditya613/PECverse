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
    /**
     * Handle Google Sign-in via API (Mobile App sends token / id_token)
     */
    public function googleLogin(Request $request): JsonResponse
    {
        $request->validate([
            'token' => 'nullable|string',
            'id_token' => 'nullable|string',
            'access_token' => 'nullable|string',
        ]);

        $token = $request->token ?: ($request->id_token ?: $request->access_token);

        if (!$token) {
            return response()->json([
                'message' => 'Missing Google authentication token.'
            ], 422);
        }

        $email = null;
        $name = null;
        $googleId = null;
        $avatar = null;

        // 1. Try Google ID Token verification via Google's official tokeninfo endpoint (JWT)
        // On iOS & Android, idToken is the most reliable OIDC token
        $tokensToCheck = array_unique(array_filter([
            $request->id_token,
            $token,
            $request->access_token,
        ]));

        foreach ($tokensToCheck as $candidateToken) {
            if ($email) break;

            // (A) Try verifying as an ID Token (JWT)
            try {
                $response = \Illuminate\Support\Facades\Http::timeout(8)
                    ->get("https://oauth2.googleapis.com/tokeninfo", [
                        'id_token' => $candidateToken
                    ]);

                if ($response->successful()) {
                    $payload = $response->json();
                    if (!empty($payload['email'])) {
                        $email = $payload['email'];
                        $name = $payload['name'] ?? ($payload['email'] ?? 'Student');
                        $googleId = $payload['sub'] ?? ($payload['user_id'] ?? null);
                        $avatar = $payload['picture'] ?? null;
                        break;
                    }
                }
            } catch (\Exception $e) {
                // Continue to next check
            }

            // (B) Try verifying as an Access Token via Google's userinfo endpoint
            try {
                $response = \Illuminate\Support\Facades\Http::timeout(8)
                    ->withToken($candidateToken)
                    ->get('https://www.googleapis.com/oauth2/v3/userinfo');

                if ($response->successful()) {
                    $payload = $response->json();
                    if (!empty($payload['email'])) {
                        $email = $payload['email'];
                        $name = $payload['name'] ?? ($payload['email'] ?? 'Student');
                        $googleId = $payload['sub'] ?? null;
                        $avatar = $payload['picture'] ?? null;
                        break;
                    }
                }
            } catch (\Exception $e) {
                // Continue
            }

            // (C) Try Laravel Socialite
            try {
                $googleUser = Socialite::driver('google')->stateless()->userFromToken($candidateToken);
                if ($googleUser && !empty($googleUser->email)) {
                    $email = $googleUser->email;
                    $name = $googleUser->name ?? 'Student';
                    $googleId = $googleUser->id;
                    $avatar = $googleUser->avatar;
                    break;
                }
            } catch (\Exception $e) {
                // Continue
            }
        }

        if (!$email) {
            return response()->json([
                'message' => 'Failed to authenticate with Google. Invalid or expired token.',
            ], 401);
        }

        try {
            // SECURITY: Ensure the email belongs to the pec.edu.in domain
            $lowerEmail = strtolower(trim($email));
            if (!Str::endsWith($lowerEmail, '@pec.edu.in')) {
                return response()->json([
                    'message' => 'Unauthorized. Please login with your official @pec.edu.in email address.'
                ], 403);
            }

            $rawName = $name ?: 'Student';
            $cleanName = $rawName;
            $rollNo = null;

            // Safe Roll Number Extraction (isolated so it NEVER interrupts login)
            try {
                // A valid PEC roll number MUST contain at least 4 continuous digits (to distinguish from branch codes like bt25cse)
                if (preg_match('/\b([a-zA-Z]{0,5}\d{4,10})\b/i', $rawName, $matches)) {
                    $rollNo = strtolower($matches[1]);
                    $cleanName = trim(str_replace($matches[0], '', $rawName));
                    $cleanName = trim(preg_replace('/\s+/', ' ', $cleanName), " \t\n\r\0\x0B-");
                } else {
                    $emailParts = explode('@', $lowerEmail);
                    $localPart = $emailParts[0];
                    if (preg_match('/\.([a-zA-Z]{0,5}\d{4,10})$/i', $localPart, $matches)) {
                        $rollNo = strtolower($matches[1]);
                    } elseif (preg_match('/^([a-zA-Z]{0,5}\d{4,10})$/i', $localPart, $matches)) {
                        $rollNo = strtolower($matches[1]);
                    }
                }
            } catch (\Throwable $e) {
                $rollNo = null;
            }

            // Find or create the user (100% resilient to column length limits or schema differences)
            $user = User::where('email', $lowerEmail)->first();
            if (!$user) {
                try {
                    $user = User::create([
                        'email' => $lowerEmail,
                        'name' => $cleanName ?: $rawName,
                        'google_id' => $googleId,
                        'profile_photo' => $avatar,
                        'role' => 'student',
                    ]);
                } catch (\Throwable $e) {
                    // Fallback: If DB profile_photo column is VARCHAR(255) and Google returned a >1000 char URL, create without photo so login ALWAYS succeeds!
                    $user = User::create([
                        'email' => $lowerEmail,
                        'name' => $cleanName ?: $rawName,
                        'google_id' => $googleId,
                        'profile_photo' => null,
                        'role' => 'student',
                    ]);
                }
            }

            // Safe secondary updates (isolated so any minor issue never fails login)
            try {
                $needsSave = false;
                if ($cleanName && $user->name !== $cleanName && ($user->name === 'Student' || empty($user->name))) {
                    $user->name = $cleanName;
                    $needsSave = true;
                }
                if ($googleId && empty($user->google_id)) {
                    $user->google_id = $googleId;
                    $needsSave = true;
                }
                if ($avatar && empty($user->profile_photo)) {
                    $user->profile_photo = $avatar;
                    $needsSave = true;
                }
                // Update roll no ONLY if valid, has digits, and is not already taken
                if ($rollNo && empty($user->roll_no)) {
                    $isRollTaken = User::where('roll_no', $rollNo)->where('id', '!=', $user->id)->exists();
                    if (!$isRollTaken) {
                        $user->roll_no = $rollNo;
                        $needsSave = true;
                    }
                }
                if ($needsSave) {
                    try {
                        $user->save();
                    } catch (\Throwable $saveError) {
                        // If save fails due to profile_photo string length on unmigrated DB, clear photo and save essential data
                        $user->profile_photo = null;
                        try {
                            $user->save();
                        } catch (\Throwable $ignored) {}
                    }
                }
            } catch (\Throwable $e) {
                // Secondary update error safely caught - user is already authenticated!
            }

            // Create a new Sanctum API token
            $token = $user->createToken('MobileAppToken')->plainTextToken;

            return response()->json([
                'message' => 'Login successful',
                'token' => $token,
                'user' => $user->load('courseClass'),
            ], 200);

        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('Login error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to complete login on server: ' . $e->getMessage(),
            ], 500);
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
        
        // Demote CR to regular student if they change their assigned class
        if ($user->role === 'cr' && $user->class_id !== $request->class_id) {
            $user->role = 'student';
            
            // Clear existing CR assignment across classes
            \App\Models\CourseClass::where('cr_user_id', $user->id)->update(['cr_user_id' => null]);
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
                'bunked_classes' => 3
            ]);
            
            \App\Models\AttendanceSubject::create([
                'user_id' => $user->id,
                'name' => 'Computer Networks',
                'target_percentage' => 75,
                'attended_classes' => 5, // Dropped below 75% to show dynamic insights
                'bunked_classes' => 5
            ]);

            $log1 = \App\Models\AttendanceLog::create([
                'user_id' => $user->id,
                'attendance_subject_id' => $subj1->id,
                'type' => 'attended'
            ]);
            $log1->created_at = now()->subDays(1);
            $log1->save();

            $log2 = \App\Models\AttendanceLog::create([
                'user_id' => $user->id,
                'attendance_subject_id' => $subj1->id,
                'type' => 'bunked'
            ]);
            $log2->created_at = now()->subDays(2);
            $log2->save();
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
