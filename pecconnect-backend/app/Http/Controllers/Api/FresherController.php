<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Fresher;
use Illuminate\Http\JsonResponse;

class FresherController extends Controller
{
    /**
     * Register a new fresher via device_id
     */
    public function register(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'branch' => 'required|string|max:50',
            'device_id' => 'required|string|max:255',
        ]);

        $fresher = Fresher::updateOrCreate(
            ['device_id' => $request->device_id],
            [
                'name' => $request->name,
                'branch' => $request->branch,
            ]
        );

        return response()->json([
            'message' => 'Registered successfully',
            'fresher' => $fresher
        ], 200);
    }

    /**
     * Get profile by device_id
     */
    public function profile($device_id): JsonResponse
    {
        $fresher = Fresher::where('device_id', $device_id)->first();

        if (!$fresher) {
            return response()->json(['message' => 'Not found'], 404);
        }

        return response()->json(['fresher' => $fresher], 200);
    }

    /**
     * Get live stats
     */
    public function stats(): JsonResponse
    {
        $total = Fresher::count();
        $byBranch = Fresher::select('branch', \DB::raw('count(*) as count'))
            ->groupBy('branch')
            ->get();

        return response()->json([
            'total' => $total,
            'by_branch' => $byBranch
        ], 200);
    }

    /**
     * Update Expo Push Token for fresher
     */
    public function updatePushToken(Request $request): JsonResponse
    {
        $request->validate([
            'device_id' => 'required|string|max:255',
            'token' => 'required|string|max:255',
        ]);

        $fresher = Fresher::where('device_id', $request->device_id)->first();
        if ($fresher) {
            $fresher->expo_push_token = $request->token;
            $fresher->save();
        }

        return response()->json(['message' => 'Token updated successfully'], 200);
    }
}
