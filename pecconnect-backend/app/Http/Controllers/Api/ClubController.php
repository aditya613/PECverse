<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Club;
use App\Models\ClubMember;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ClubController extends Controller
{
    /**
     * Get all clubs / squads with membership status
     */
    public function index(Request $request): JsonResponse
    {
        $category = $request->query('category');
        $deviceId = $request->query('device_id');
        $user = $request->user();

        $query = Club::query();

        if ($category && strtolower($category) !== 'all') {
            $query->where('category', strtolower($category));
        }

        $clubs = $query->orderBy('members_count', 'desc')->get();

        // Check joined club IDs
        $joinedClubIds = [];
        if ($user) {
            $joinedClubIds = ClubMember::where('user_id', $user->id)->pluck('club_id')->toArray();
        } elseif ($deviceId) {
            $joinedClubIds = ClubMember::where('device_id', $deviceId)->pluck('club_id')->toArray();
        }

        $transformed = $clubs->map(function ($club) use ($joinedClubIds) {
            return [
                'id' => $club->id,
                'name' => $club->name,
                'code' => $club->code,
                'category' => ucfirst($club->category),
                'description' => $club->description,
                'long_description' => $club->long_description,
                'faculty_advisor' => $club->faculty_advisor,
                'join_link' => $club->join_link,
                'website_link' => $club->website_link,
                'members_count' => $club->members_count,
                'icon_name' => $club->icon_name,
                'color' => $club->color,
                'instagram_handle' => $club->instagram_handle,
                'is_joined' => in_array($club->id, $joinedClubIds),
            ];
        });

        return response()->json(['clubs' => $transformed], 200);
    }

    /**
     * Toggle join/leave club membership
     */
    public function toggleJoin(Request $request, $id): JsonResponse
    {
        $club = Club::findOrFail($id);
        $user = $request->user();
        $deviceId = $request->input('device_id');

        if (!$user && !$deviceId) {
            return response()->json(['message' => 'User ID or Device ID is required'], 400);
        }

        $query = ClubMember::where('club_id', $club->id);
        if ($user) {
            $query->where('user_id', $user->id);
        } else {
            $query->where('device_id', $deviceId);
        }

        $membership = $query->first();

        if ($membership) {
            $membership->delete();
            $club->decrement('members_count');
            return response()->json([
                'message' => 'Left club successfully',
                'is_joined' => false,
                'members_count' => max(0, $club->members_count),
            ], 200);
        } else {
            ClubMember::create([
                'club_id' => $club->id,
                'user_id' => $user ? $user->id : null,
                'device_id' => $deviceId,
            ]);
            $club->increment('members_count');
            return response()->json([
                'message' => 'Joined club successfully',
                'is_joined' => true,
                'members_count' => $club->members_count,
            ], 200);
        }
    }
}
