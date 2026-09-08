<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use App\Models\User;
use App\Models\CourseClass;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

#[Signature('app:notify-branch-update 
    {--target=today : Target audience (today, 3rdyear, cse1styear, recent, all)} 
    {--title= : Custom notification title override} 
    {--body= : Custom notification message override} 
    {--dry-run : Preview recipient count without sending}')]
#[Description('Notify students (e.g. 3rd year CSE) to select the correct branch/class in Profile')]
class NotifyBranchUpdate extends Command
{
    public function handle()
    {
        $target = strtolower($this->option('target') ?? 'today');
        $dryRun = $this->option('dry-run');

        $defaultTitle = "📚 3rd Year CSE Timetable is Live!";
        $defaultBody = "Hey! 3rd Year CSE (5th Sem) timetable is now live. If you selected 1st Year by mistake, tap here to switch to 3rd Year in your Profile!";

        $title = $this->option('title') ?: $defaultTitle;
        $body = $this->option('body') ?: $defaultBody;
        $url = '/(tabs)/profile';

        $this->newLine();
        $this->info("==================================================");
        $this->info("   📢 PECverse Branch/Class Update Notification   ");
        $this->info("==================================================");
        $this->line("<comment>Target Filter:</comment> {$target}");
        $this->line("<comment>Title:</comment>         {$title}");
        $this->line("<comment>Body:</comment>          {$body}");
        $this->line("<comment>Deep Link:</comment>     {$url}");
        $this->newLine();

        $query = User::whereNotNull('expo_push_token')
            ->where('expo_push_token', '!=', '');

        switch ($target) {
            case 'today':
                // Users created today (since midnight)
                $query->whereDate('created_at', '>=', now()->toDateString());
                $this->line("🎯 Filtering: Users registered today (" . now()->toDateString() . ")");
                break;

            case 'recent':
                // Users registered in the last 24 hours
                $query->where('created_at', '>=', now()->subHours(24));
                $this->line("🎯 Filtering: Users registered in the last 24 hours");
                break;

            case '3rdyear':
                // Users with Batch 2023 emails (e.g., .bt23cse@pec.edu.in, .23103008) or in Year 3
                $query->where(function ($q) {
                    $q->where('email', 'like', '%.bt23%')
                      ->orWhere('email', 'like', '%2310%')
                      ->orWhere('roll_no', 'like', '%23%')
                      ->orWhereHas('courseClass', function ($cq) {
                          $cq->where('year', 3);
                      });
                });
                $this->line("🎯 Filtering: 3rd Year students (Batch 2023 / Year 3)");
                break;

            case 'cse1styear':
                // Users currently assigned to 1st year CSE classes
                $query->whereHas('courseClass', function ($cq) {
                    $cq->where('year', 1)
                       ->whereHas('branch', function ($bq) {
                           $bq->where('code', 'CSE');
                       });
                });
                $this->line("🎯 Filtering: Students currently assigned to 1st Year CSE");
                break;

            case 'all':
                $this->line("🎯 Filtering: All active push token users");
                break;

            default:
                $this->line("🎯 Filtering: Users registered today");
                $query->whereDate('created_at', '>=', now()->toDateString());
                break;
        }

        $users = $query->get(['id', 'name', 'email', 'expo_push_token', 'class_id', 'created_at']);
        $tokens = $users->pluck('expo_push_token')->unique()->toArray();

        $this->info("Found " . count($users) . " matching users (" . count($tokens) . " valid push tokens).");

        if (empty($tokens)) {
            $this->warn("No users found matching the filter criteria.");
            return Command::SUCCESS;
        }

        // Display sample recipients
        $sampleUsers = $users->take(5);
        $this->table(
            ['ID', 'Name', 'Email', 'Created At'],
            $sampleUsers->map(fn($u) => [$u->id, $u->name, $u->email, $u->created_at->format('Y-m-d H:i')])
        );

        if ($dryRun) {
            $this->warn("⚠️  Dry-run mode enabled. No notifications were sent.");
            return Command::SUCCESS;
        }

        if (!$this->confirm("Do you want to send this push notification to " . count($tokens) . " users now?", true)) {
            $this->line("Broadcast cancelled.");
            return Command::SUCCESS;
        }

        $messages = [];
        foreach ($tokens as $token) {
            if (str_starts_with($token, 'ExponentPushToken') || str_starts_with($token, 'ExpoPushToken')) {
                $messages[] = [
                    'to'    => $token,
                    'sound' => 'default',
                    'title' => $title,
                    'body'  => $body,
                    'data'  => [
                        'url'  => $url,
                        'link' => $url,
                        'path' => $url,
                    ],
                ];
            }
        }

        $chunks = array_chunk($messages, 50);
        $totalSent = 0;
        $bar = $this->output->createProgressBar(count($chunks));
        $bar->start();

        foreach ($chunks as $chunk) {
            try {
                $response = Http::timeout(10)
                    ->withHeaders([
                        'Accept'       => 'application/json',
                        'Content-Type' => 'application/json',
                    ])
                    ->post('https://exp.host/--/api/v2/push/send', $chunk);

                if ($response->successful()) {
                    $totalSent += count($chunk);
                } else {
                    Log::error("Expo Push batch failed: " . $response->body());
                }
            } catch (\Exception $e) {
                Log::error("Exception sending branch update push: " . $e->getMessage());
            }
            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);
        $this->info("✅ Successfully sent branch update notification to {$totalSent} students!");

        return Command::SUCCESS;
    }
}
