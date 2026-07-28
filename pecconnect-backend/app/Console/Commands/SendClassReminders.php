<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Timetable;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SendClassReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:send-class-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send push notifications to students 15 minutes before their class starts';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $now = Carbon::now();
        $targetTime = $now->copy()->addMinutes(15);
        
        // Match exact HH:MM in DB (whether stored as HH:mm:00 or HH:mm)
        $targetTimeStr = $targetTime->format('H:i:00');
        $targetTimeShort = $targetTime->format('H:i');
        
        $todayStr = $now->format('Y-m-d');
        
        // In our DB, day_of_week is 1-7 (1=Monday ... 7=Sunday).
        // Carbon dayOfWeekIso returns exactly 1 (Monday) to 7 (Sunday).
        $dayOfWeek = $now->dayOfWeekIso;

        $this->info("[$now] Checking reminders for classes starting around {$targetTimeShort} (Day: {$dayOfWeek}, Date: {$todayStr})");

        // 1. Find all candidate classes starting in 15 minutes today:
        // A class is due if:
        // (a) It is a regular weekly class for today's day of week
        // (b) It is a single/extra class scheduled specifically for today's date
        // (c) It is a rescheduled class moved specifically to today's date
        $candidateClasses = Timetable::where(function ($q) use ($dayOfWeek, $todayStr) {
                $q->where(function ($sub) use ($dayOfWeek) {
                    $sub->where('type', 'weekly')
                        ->where('day_of_week', $dayOfWeek);
                })->orWhere(function ($sub) use ($todayStr) {
                    $sub->whereIn('type', ['single', 'rescheduled'])
                        ->where('date', $todayStr);
                });
            })
            ->where(function ($q) use ($targetTimeStr, $targetTimeShort) {
                $q->where('start_time', $targetTimeStr)
                  ->orWhere('start_time', 'like', $targetTimeShort . '%');
            })
            ->get();

        if ($candidateClasses->isEmpty()) {
            $this->info("No classes scheduled to start at {$targetTimeShort}.");
            return;
        }

        $messages = [];
        $processedClassesCount = 0;

        foreach ($candidateClasses as $class) {
            // If the row itself is marked cancelled, ignore it
            if ($class->type === 'cancelled') {
                continue;
            }

            // 2. EXCEPTION CHECK: For weekly classes, check if an admin/CR cancelled it for today
            if ($class->type === 'weekly') {
                $isCancelledToday = Timetable::where('original_timetable_id', $class->id)
                    ->where('date', $todayStr)
                    ->where('type', 'cancelled')
                    ->exists();

                if ($isCancelledToday) {
                    $this->info("Skipping weekly class ID {$class->id} ({$class->subject}) as it is cancelled for today.");
                    continue;
                }
            }

            // 3. Find all students belonging to this class group who have a push token
            $tokens = User::where('class_id', $class->class_id)
                ->whereNotNull('expo_push_token')
                ->where('expo_push_token', '!=', '')
                ->pluck('expo_push_token')
                ->unique()
                ->toArray();

            if (empty($tokens)) {
                $this->info("Class ID {$class->id} ({$class->subject}) has no students with active push tokens.");
                continue;
            }

            $processedClassesCount++;
            $roomText = $class->room ? " in {$class->room}" : "";
            $teacherText = $class->teacher ? " with {$class->teacher}" : "";

            foreach ($tokens as $token) {
                if (str_starts_with($token, 'ExponentPushToken') || str_starts_with($token, 'ExpoPushToken')) {
                    $messages[] = [
                        'to' => $token,
                        'sound' => 'default',
                        'title' => '⏳ Class Starting Soon!',
                        'body' => "Your {$class->subject} class{$teacherText} starts in 15 minutes{$roomText}.",
                        'data' => [
                            'url' => '/(tabs)/timetable',
                            'class_id' => $class->id,
                            'subject' => $class->subject,
                        ],
                    ];
                }
            }
        }

        // 4. Dispatch to Expo Push API in chunks of 50 (Expo API recommended limit per batch)
        if (!empty($messages)) {
            $chunks = array_chunk($messages, 50);
            $totalSent = 0;

            foreach ($chunks as $chunk) {
                try {
                    $response = Http::timeout(10)
                        ->withHeaders([
                            'Accept' => 'application/json',
                            'Content-Type' => 'application/json',
                        ])
                        ->post('https://exp.host/--/api/v2/push/send', $chunk);

                    if ($response->successful()) {
                        $totalSent += count($chunk);
                    } else {
                        Log::error("Expo Push API batch failed: " . $response->body());
                    }
                } catch (\Exception $e) {
                    Log::error("Exception sending Expo push reminders: " . $e->getMessage());
                }
            }

            $this->info("Successfully dispatched {$totalSent} reminder notifications across {$processedClassesCount} classes.");
        } else {
            $this->info('No reminders needed to be sent.');
        }
    }
}
