<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AnalyticsEvent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AnalyticsController extends Controller
{
    /**
     * Ingest a batch of telemetry events from mobile app
     */
    public function storeBatch(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'events' => 'required|array|max:50',
            'events.*.session_id' => 'required|string|max:64',
            'events.*.event_name' => 'required|string|max:64',
            'events.*.screen_name' => 'nullable|string|max:64',
            'events.*.properties' => 'nullable|array',
            'events.*.platform' => 'nullable|string|max:16',
            'events.*.app_version' => 'nullable|string|max:16',
            'events.*.created_at' => 'nullable|date',
        ]);

        $userId = $request->user('sanctum')?->id;
        $now = now();

        $records = array_map(function ($event) use ($userId, $now) {
            return [
                'user_id' => $userId,
                'session_id' => substr($event['session_id'], 0, 64),
                'event_name' => substr($event['event_name'], 0, 64),
                'screen_name' => isset($event['screen_name']) ? substr($event['screen_name'], 0, 64) : null,
                'properties' => isset($event['properties']) ? json_encode($event['properties']) : null,
                'platform' => $event['platform'] ?? 'android',
                'app_version' => $event['app_version'] ?? '1.0.1',
                'created_at' => isset($event['created_at']) ? date('Y-m-d H:i:s', strtotime($event['created_at'])) : $now,
            ];
        }, $validated['events']);

        try {
            AnalyticsEvent::insert($records);
        } catch (\Exception $e) {
            Log::error('Failed to insert analytics batch: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to log events'], 500);
        }

        return response()->json(['message' => 'Events logged successfully', 'count' => count($records)], 200);
    }

    /**
     * Analytics Summary & Insights for Superadmin
     */
    public function summary(Request $request): JsonResponse
    {
        $today = now()->startOfDay();
        $sevenDaysAgo = now()->subDays(7)->startOfDay();
        $thirtyDaysAgo = now()->subDays(30)->startOfDay();

        // Active Users (Logged in users + unique sessions)
        $dau = AnalyticsEvent::where('created_at', '>=', $today)
            ->distinct('session_id')
            ->count('session_id');

        $wau = AnalyticsEvent::where('created_at', '>=', $sevenDaysAgo)
            ->distinct('session_id')
            ->count('session_id');

        $mau = AnalyticsEvent::where('created_at', '>=', $thirtyDaysAgo)
            ->distinct('session_id')
            ->count('session_id');

        // Total Events
        $totalEvents = AnalyticsEvent::count();

        // Top 10 Most Visited Screens
        $topScreens = AnalyticsEvent::select('screen_name', DB::raw('count(*) as views'))
            ->whereNotNull('screen_name')
            ->groupBy('screen_name')
            ->orderByDesc('views')
            ->limit(10)
            ->get();

        // Top 10 Feature Events
        $topEvents = AnalyticsEvent::select('event_name', DB::raw('count(*) as count'))
            ->where('event_name', '!=', 'screen_view')
            ->groupBy('event_name')
            ->orderByDesc('count')
            ->limit(10)
            ->get();

        // Platform Breakdown
        $platforms = AnalyticsEvent::select('platform', DB::raw('count(*) as count'))
            ->groupBy('platform')
            ->get();

        // App Version Distribution
        $appVersions = AnalyticsEvent::select('app_version', DB::raw('count(*) as count'))
            ->whereNotNull('app_version')
            ->groupBy('app_version')
            ->orderByDesc('count')
            ->limit(5)
            ->get();

        return response()->json([
            'metrics' => [
                'dau' => $dau,
                'wau' => $wau,
                'mau' => $mau,
                'total_events' => $totalEvents,
            ],
            'top_screens' => $topScreens,
            'top_events' => $topEvents,
            'platforms' => $platforms,
            'app_versions' => $appVersions,
        ]);
    }
}
