<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

#[Signature('app:broadcast {title} {body} {--url=}')]
#[Description('Send a broadcast push notification to all registered users')]
class BroadcastMessage extends Command
{
    public function handle()
    {
        $title = $this->argument('title');
        $body = $this->argument('body');
        $url = $this->option('url') ?? '/(tabs)/profile';

        $this->info("Fetching all users with active push tokens...");

        $tokens = User::whereNotNull('expo_push_token')
            ->where('expo_push_token', '!=', '')
            ->pluck('expo_push_token')
            ->unique()
            ->toArray();

        if (empty($tokens)) {
            $this->error("No users found with an active push token!");
            return Command::FAILURE;
        }

        $this->info("Found " . count($tokens) . " users. Preparing to send broadcast...");

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
                Log::error("Exception sending Expo broadcast: " . $e->getMessage());
                $this->error("\nException: " . $e->getMessage());
            }
            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);
        $this->info("✅ Successfully broadcasted notification to {$totalSent} users!");
        
        return Command::SUCCESS;
    }
}
