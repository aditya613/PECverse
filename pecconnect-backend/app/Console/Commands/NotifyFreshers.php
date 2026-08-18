<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use App\Models\Fresher;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

#[Signature('app:notify-freshers {title} {body} {--url=}')]
#[Description('Send a broadcast push notification to all registered freshers')]
class NotifyFreshers extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $title = $this->argument('title');
        $body = $this->argument('body');
        $url = $this->option('url') ?? '/orientation/(tabs)';

        $this->info("Fetching freshers with active push tokens...");

        $tokens = Fresher::whereNotNull('expo_push_token')
            ->where('expo_push_token', '!=', '')
            ->pluck('expo_push_token')
            ->unique()
            ->toArray();

        if (empty($tokens)) {
            $this->error("No freshers found with an active push token!");
            return Command::FAILURE;
        }

        $this->info("Found " . count($tokens) . " freshers. Preparing to send broadcast...");

        $messages = [];
        foreach ($tokens as $token) {
            if (str_starts_with($token, 'ExponentPushToken') || str_starts_with($token, 'ExpoPushToken')) {
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
        }

        if (empty($messages)) {
            $this->error("No valid Expo push tokens found.");
            return Command::FAILURE;
        }

        // Dispatch to Expo Push API in chunks of 50
        $chunks = array_chunk($messages, 50);
        $totalSent = 0;
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
                    Log::error("Expo Push API batch failed: " . $response->body());
                    $this->error("\nBatch failed: " . $response->body());
                }
            } catch (\Exception $e) {
                Log::error("Exception sending Expo push reminders: " . $e->getMessage());
                $this->error("\nException: " . $e->getMessage());
            }
            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);
        $this->info("✅ Successfully broadcasted notification to {$totalSent} freshers!");
        
        return Command::SUCCESS;
    }
}
