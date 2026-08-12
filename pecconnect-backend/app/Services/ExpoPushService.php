<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ExpoPushService
{
    /**
     * Send push notifications in batches of 100 to comply with Expo limits
     * and prevent Hostinger timeouts.
     */
    public static function sendToTokens(array $tokens, string $title, string $body, array $data = [])
    {
        // Filter out invalid token formats
        $validTokens = array_filter($tokens, function ($token) {
            return str_starts_with($token, 'ExponentPushToken') || str_starts_with($token, 'ExpoPushToken');
        });

        if (empty($validTokens)) {
            return;
        }

        // Expo allows a maximum of 100 messages per request
        $batches = array_chunk($validTokens, 100);

        foreach ($batches as $batch) {
            $messages = array_map(function ($token) use ($title, $body, $data) {
                return [
                    'to' => $token,
                    'sound' => 'default',
                    'title' => $title,
                    'body' => $body,
                    'data' => $data,
                ];
            }, $batch);

            try {
                // Synchronous request (extremely fast for ~100 tokens, safe for Hostinger)
                Http::post('https://exp.host/--/api/v2/push/send', $messages);
            } catch (\Exception $e) {
                // Log failure but do not crash the app
                Log::error('Expo Push Notification Failed: ' . $e->getMessage());
            }
        }
    }
}
