<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TimetableController;
use App\Http\Controllers\Api\AnnouncementController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\NoteController;
use App\Http\Controllers\Api\DataController;

// Public Routes
Route::post('/auth/google', [AuthController::class, 'googleLogin']);
Route::post('/auth/guest', [AuthController::class, 'guestLogin']);

// Fresher Portal Routes (No Auth Required, uses device_id)
// Apply a stricter throttle (e.g., 5 requests per minute) to public post/comment routes to prevent spam
Route::middleware('throttle:10,1')->group(function () {
    Route::post('/freshers/register', [\App\Http\Controllers\Api\FresherController::class, 'register']);
    Route::post('/wall', [\App\Http\Controllers\Api\WallController::class, 'store']);
    Route::post('/wall/{id}/like', [\App\Http\Controllers\Api\WallController::class, 'toggleLike']);
    Route::post('/wall/{id}/comments', [\App\Http\Controllers\Api\WallController::class, 'storeComment']);
});

Route::get('/freshers/profile/{device_id}', [\App\Http\Controllers\Api\FresherController::class, 'profile']);
Route::get('/freshers/stats', [\App\Http\Controllers\Api\FresherController::class, 'stats']);
Route::post('/freshers/push-token', [\App\Http\Controllers\Api\FresherController::class, 'updatePushToken'])->middleware('throttle:10,1');
Route::get('/wall', [\App\Http\Controllers\Api\WallController::class, 'index']);
Route::get('/wall/{id}/comments', [\App\Http\Controllers\Api\WallController::class, 'getComments']);

Route::middleware('auth:sanctum')->group(function () {
    
    // Auth / Profile
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/user/profile', [AuthController::class, 'profile']);
    Route::put('/user/class', [AuthController::class, 'updateClass']);
    Route::post('/user/push-token', [AuthController::class, 'updatePushToken']);
    
    // Master Data
    Route::get('/branches', [DataController::class, 'getBranches']);
    Route::get('/classes', [DataController::class, 'getClasses']);

    // Timetables
    Route::get('/timetables', [TimetableController::class, 'index']);
    Route::post('/timetables', [TimetableController::class, 'store']);
    Route::put('/timetables/{timetable}', [TimetableController::class, 'update']);
    Route::delete('/timetables/{timetable}', [TimetableController::class, 'destroy']);
    Route::post('/timetables/exceptions', [TimetableController::class, 'storeException']);

    // Announcements
    Route::apiResource('announcements', AnnouncementController::class)->only(['index', 'store', 'destroy']);

    // Attendance Tracker API
    Route::get('/attendance', [AttendanceController::class, 'index']);
    Route::post('/attendance', [AttendanceController::class, 'store']);
    Route::patch('/attendance/{id}', [AttendanceController::class, 'update']);
    Route::post('/attendance/{id}/reset', [AttendanceController::class, 'resetStats']);
    Route::patch('/attendance/{id}/log', [AttendanceController::class, 'updateLog']);
    Route::delete('/attendance/log/{logId}', [AttendanceController::class, 'destroyLog']);
    Route::delete('/attendance/{id}', [AttendanceController::class, 'destroy']);

    // Notes
    Route::get('/notes', [NoteController::class, 'index']);
    Route::post('/notes', [NoteController::class, 'store']);
    Route::post('/notes/{note}/download', [NoteController::class, 'incrementDownloads']);
    Route::delete('/notes/{note}', [NoteController::class, 'destroy']);
    // Mess Routes
    Route::get('/mess', [App\Http\Controllers\MessController::class, 'index']);
    Route::get('/mess/menu', [App\Http\Controllers\MessController::class, 'menu']);
});
