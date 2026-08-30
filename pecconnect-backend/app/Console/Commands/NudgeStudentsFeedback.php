<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Fresher;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

#[Signature('app:nudge-feedback 
    {--title= : Custom notification title} 
    {--body= : Custom notification message} 
    {--target=all : Target audience (all, users, freshers)} 
    {--url=/feedback : Deep link URL to open on tap}
    {--dry-run : Preview recipient count without sending}')]
#[Description('Nudge PEC students to explore features and submit feature requests via Profile > Feedback')]
class NudgeStudentsFeedback extends Command
{
    public function handle()
    {
        $defaultTitle = "Got ideas for PECverse? ✨";
        $defaultBody = "We're constantly building new features for PEC students! Let us know what tools or improvements you want next via Profile > Feedback.";

        $title = $this->option('title') ?: $defaultTitle;
        $body = $this->option('body') ?: $defaultBody;
        $target = strtolower($this->option('target') ?? 'all');
        $url = $this->option('url') ?? '/feedback';
        $dryRun = $this->option('dry-run');

        $this->newLine();
        $this->info("==================================================");
        $this->info("       🚀 PECverse Student Feedback Nudge         ");
        $this->info("==================================================");
        $this->line("<comment>Title:</comment>  {$title}");
        $this->line("<comment>Body:</comment>   {$body}");
        $this->line("<comment>Target:</comment> {$target}");
        $this->line("<comment>URL:</comment>    {$url}");
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

        // Deduplicate and filter valid tokens
        $uniqueTokens = array_values(array_unique($tokens));
        $validTokens = array_filter($uniqueTokens, function ($token) {
            return str_starts_with($token, 'ExponentPushToken') || str_starts_with($token, 'ExpoPushToken');
        });

        $totalCount = count($validTokens);

        if ($totalCount === 0) {
            $this->warn("⚠️  No active Expo push tokens found for target '{$target}'.");
            return Command::SUCCESS;
        }

        $this->info("✅ Found {$totalCount} unique student devices ready to receive notification.");

        if ($dryRun) {
            $this->warn("🔎 [DRY RUN] No notifications were sent.");
            return Command::SUCCESS;
        }

        if (!$this->confirm("Do you want to send this push notification to {$totalCount} students now?", true)) {
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
                    'url' => $url,
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
                    Log::error("Expo Push Batch Failed: " . $response->body());
                }
            } catch (\Exception $e) {
                $totalFailed += count($chunk);
                Log::error("Exception in Expo Push Nudge: " . $e->getMessage());
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);

        $this->info("🎉 Done! Successfully dispatched push notifications to {$totalSent} devices.");
        if ($totalFailed > 0) {
            $this->warn("⚠️ {$totalFailed} notifications failed to deliver (logged in laravel.log).");
        }

        return Command::SUCCESS;
    }
}
