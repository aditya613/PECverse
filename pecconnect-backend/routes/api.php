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
Route::middleware(['throttle:10,1', \App\Http\Middleware\FresherAuthMiddleware::class])->group(function () {
    Route::post('/wall', [\App\Http\Controllers\Api\WallController::class, 'store']);
    Route::delete('/wall/{id}', [\App\Http\Controllers\Api\WallController::class, 'destroy']);
    Route::post('/wall/{id}/like', [\App\Http\Controllers\Api\WallController::class, 'toggleLike']);
    Route::post('/wall/{id}/comments', [\App\Http\Controllers\Api\WallController::class, 'storeComment']);
    Route::delete('/wall/comments/{id}', [\App\Http\Controllers\Api\WallController::class, 'destroyComment']);
    Route::post('/wall/{id}/report', [\App\Http\Controllers\Api\WallController::class, 'reportPost']);
    Route::post('/wall/{id}/block', [\App\Http\Controllers\Api\WallController::class, 'blockUser']);
    
    Route::post('/senior-advice/questions', [\App\Http\Controllers\Api\SeniorAdviceController::class, 'askQuestion']);
    Route::delete('/senior-advice/questions/{id}', [\App\Http\Controllers\Api\SeniorAdviceController::class, 'deleteQuestion']);
});

// Fresher registration shouldn't require auth token
Route::post('/freshers/register', [\App\Http\Controllers\Api\FresherController::class, 'register'])->middleware('throttle:10,1');
Route::get('/freshers/profile/{device_id}', [\App\Http\Controllers\Api\FresherController::class, 'profile']);
Route::get('/freshers/stats', [\App\Http\Controllers\Api\FresherController::class, 'stats']);
Route::post('/freshers/push-token', [\App\Http\Controllers\Api\FresherController::class, 'updatePushToken'])->middleware('throttle:10,1', \App\Http\Middleware\FresherAuthMiddleware::class);
Route::get('/wall', [\App\Http\Controllers\Api\WallController::class, 'index']);
Route::get('/wall/{id}/comments', [\App\Http\Controllers\Api\WallController::class, 'getComments']);

// Clubs / Squads & Communities (Works for both freshers and logged-in students)
Route::get('/clubs', [\App\Http\Controllers\Api\ClubController::class, 'index']);
Route::post('/clubs/{id}/toggle-join', [\App\Http\Controllers\Api\ClubController::class, 'toggleJoin'])->middleware('throttle:10,1');

// Senior Advice & Survival Guides
Route::get('/senior-advice', [\App\Http\Controllers\Api\SeniorAdviceController::class, 'index']);
Route::post('/senior-advice/{id}/like', [\App\Http\Controllers\Api\SeniorAdviceController::class, 'like'])->middleware('throttle:10,1');
Route::get('/senior-advice/questions', [\App\Http\Controllers\Api\SeniorAdviceController::class, 'getQuestions']);

Route::middleware('auth:sanctum')->group(function () {
    // Senior Advice (Answering questions)
    Route::get('/senior-advice/questions/pending', [\App\Http\Controllers\Api\SeniorAdviceController::class, 'getPendingQuestions']);
    Route::post('/senior-advice/questions/{id}/answer', [\App\Http\Controllers\Api\SeniorAdviceController::class, 'answerQuestion']);
    Route::delete('/senior-advice/{id}', [\App\Http\Controllers\Api\SeniorAdviceController::class, 'deleteAdvice']);
    
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
    Route::post('/timetables/holiday', [TimetableController::class, 'declareHoliday']);
    Route::delete('/timetables/holiday/{id}', [TimetableController::class, 'destroyHoliday']);

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
