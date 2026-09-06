<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Fresher;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

#[Signature('app:ask-rating 
    {--template=wholesome : Template to use (wholesome, sweet, attendance)} 
    {--title= : Custom notification title override} 
    {--body= : Custom notification message override} 
    {--target=all : Target audience (all, users, freshers)} 
    {--dry-run : Preview recipient count without sending}')]
#[Description('Send a cute, friendly push notification asking students to rate PECverse on the Google Play Store')]
class AskAppRating extends Command
{
    public function handle()
    {
        $templates = [
            'wholesome' => [
                'title' => "Enjoying PECverse? 🌟",
                'body'  => "If PECverse has helped your attendance or schedule, drop us a cute 5-star review on Play Store! It means the world to us 🥺❤️",
            ],
            'sweet' => [
                'title' => "A tiny favor for PECverse? 🥺👉👈",
                'body'  => "We're building this with love for PECians! Leaving a quick 5-star rating on Google Play would truly make our day ✨",
            ],
            'attendance' => [
                'title' => "Attendance above 75%? 🎒✨",
                'body'  => "If PECverse helped you stay safe on attendance this semester, show some love with a 5-star rating on Play Store! 🚀",
            ],
        ];

        $templateKey = strtolower($this->option('template') ?? 'wholesome');
        $selected = $templates[$templateKey] ?? $templates['wholesome'];

        $title = $this->option('title') ?: $selected['title'];
        $body = $this->option('body') ?: $selected['body'];
        $target = strtolower($this->option('target') ?? 'all');
        $playStoreUrl = "https://play.google.com/store/apps/details?id=in.edu.pec.connect";
        $dryRun = $this->option('dry-run');

        $this->newLine();
        $this->info("==================================================");
        $this->info("       ⭐ PECverse Play Store Rating Nudge        ");
        $this->info("==================================================");
        $this->line("<comment>Template:</comment> {$templateKey}");
        $this->line("<comment>Title:</comment>    {$title}");
        $this->line("<comment>Body:</comment>     {$body}");
        $this->line("<comment>Target:</comment>   {$target}");
        $this->line("<comment>Play Store:</comment> {$playStoreUrl}");
        $this->newLine();

        $tokens = [];

        // 1. Fetch from Users table
        if (in_array($target, ['all', 'users'])) {
            $userTokens = User::whereNotNull('expo_push_token')
                ->where('expo_push_token', '!=', '')
                ->pluck('expo_push_token')
                ->toArray();
            $tokens = array_merge($tokens, $userTokens);
            $this->line("• Users with push tokens: " . count(array_unique($userTokens)));
        }

        // 2. Fetch from Freshers table
        if (in_array($target, ['all', 'freshers'])) {
            $fresherTokens = Fresher::whereNotNull('expo_push_token')
                ->where('expo_push_token', '!=', '')
                ->pluck('expo_push_token')
                ->toArray();
            $tokens = array_merge($tokens, $fresherTokens);
            $this->line("• Freshers with push tokens: " . count(array_unique($fresherTokens)));
        }

        $uniqueTokens = array_values(array_unique($tokens));
        $validTokens = array_filter($uniqueTokens, function ($token) {
            return str_starts_with($token, 'ExponentPushToken') || str_starts_with($token, 'ExpoPushToken');
        });

        $totalCount = count($validTokens);

        if ($totalCount === 0) {
            $this->warn("⚠️  No active Expo push tokens found.");
            return Command::SUCCESS;
        }

        $this->info("✅ Found {$totalCount} unique student devices ready to receive notification.");

        if ($dryRun) {
            $this->warn("🔎 [DRY RUN] No notifications were sent.");
            return Command::SUCCESS;
        }

        if (!$this->confirm("Do you want to send this rating notification to {$totalCount} students now?", true)) {
            $this->line("Broadcast cancelled.");
            return Command::SUCCESS;
        }

        $messages = [];
        foreach ($validTokens as $token) {
            $messages[] = [
                'to' => $token,
                'sound' => 'default',
                'title' => $title,
                'body' => $body,
                'data' => [
                    'url' => $playStoreUrl,
                ],
            ];
        }

        // Dispatch in batches of 50 via Expo Push API
        $chunks = array_chunk($messages, 50);
        $totalSent = 0;
        $totalFailed = 0;

        $bar = $this->output->createProgressBar(count($chunks));
        $bar->start();

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
                    $totalFailed += count($chunk);
                    Log::error("Expo Push Rating Nudge Failed: " . $response->body());
                }
            } catch (\Exception $e) {
                $totalFailed += count($chunk);
                Log::error("Exception in Expo Push Rating Nudge: " . $e->getMessage());
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);

        $this->info("🎉 Done! Successfully dispatched rating push notifications to {$totalSent} devices.");
        if ($totalFailed > 0) {
            $this->warn("⚠️ {$totalFailed} notifications failed to deliver (logged in laravel.log).");
        }

        return Command::SUCCESS;
    }
}
