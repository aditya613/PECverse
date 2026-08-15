<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\WallPost;
use App\Models\WallComment;
use App\Models\Fresher;
use App\Models\WallLike;
use App\Models\ReportedPost;
use App\Models\BlockedUser;
use Illuminate\Http\JsonResponse;

class WallController extends Controller
{
    /**
     * Get feed of wall posts
     */
    public function index(Request $request): JsonResponse
    {
        // Simple Reddit 'hot' sort approximation: 
        // We will just order by created_at desc for now, or by likes for 'top'
        $sort = $request->query('sort', 'new'); // 'new' or 'hot'
        $deviceId = $request->query('device_id');
        
        $query = WallPost::with(['fresher:id,branch,device_id'])->withCount('comments');

        // Filter out posts from blocked users
        if ($deviceId) {
            $blockedDeviceIds = BlockedUser::where('blocker_device_id', $deviceId)
                ->pluck('blocked_device_id')
                ->toArray();

            if (!empty($blockedDeviceIds)) {
                $query->whereHas('fresher', function ($q) use ($blockedDeviceIds) {
                    $q->whereNotIn('device_id', $blockedDeviceIds);
                });
            }
        }

        if ($sort === 'hot') {
            // Very basic hot algorithm: likes - hours_since_posted
            // For now, just order by likes_count desc as a proxy for "hot/top"
            $query->orderBy('likes_count', 'desc')->orderBy('created_at', 'desc');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $posts = $query->paginate(20);

        // Fetch all likes by this device in one query to avoid N+1
        $likedPostIds = [];
        if ($deviceId) {
            $likedPostIds = WallLike::where('likable_type', WallPost::class)
                ->where('device_id', $deviceId)
                ->pluck('likable_id')
                ->toArray();
        }

        $posts->getCollection()->transform(function ($post) use ($likedPostIds) {
            $authorName = $post->is_anonymous 
                ? 'Fresher from ' . ($post->fresher->branch ?? 'PEC')
                : ($post->fresher->name ?? 'Student') . ' (' . ($post->fresher->branch ?? 'PEC') . ')';

            return [
                'id' => $post->id,
                'content' => $post->content,
                'likes_count' => $post->likes_count,
                'comments_count' => $post->comments_count,
                'created_at' => $post->created_at,
                'author' => $authorName,
                'is_anonymous' => $post->is_anonymous,
                'is_liked' => in_array($post->id, $likedPostIds),
            ];
        });

        return response()->json($posts, 200);
    }

    /**
     * Create a new post
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'device_id' => 'required|string',
            'content' => 'required|string|max:500',
            'is_anonymous' => 'nullable|boolean',
        ]);

        $fresher = Fresher::where('device_id', $request->device_id)->first();
        if (!$fresher) {
            return response()->json(['message' => 'Fresher not found'], 404);
        }

        $isAnonymous = $request->has('is_anonymous') ? $request->boolean('is_anonymous') : true;

        $post = WallPost::create([
            'fresher_id' => $fresher->id,
            'content' => $request->content,
            'likes_count' => 0,
            'comments_count' => 0,
            'is_anonymous' => $isAnonymous,
        ]);

        $authorName = $isAnonymous 
            ? 'Fresher from ' . $fresher->branch
            : $fresher->name . ' (' . $fresher->branch . ')';

        return response()->json([
            'message' => 'Posted successfully',
            'post' => [
                'id' => $post->id,
                'content' => $post->content,
                'likes_count' => $post->likes_count,
                'comments_count' => $post->comments_count,
                'created_at' => $post->created_at,
                'author' => $authorName,
                'is_anonymous' => $isAnonymous,
                'is_liked' => false,
            ]
        ], 201);
    }

    /**
     * Toggle like on a post
     */
    public function toggleLike(Request $request, $id): JsonResponse
    {
        $request->validate([
            'device_id' => 'required|string',
        ]);

        $post = WallPost::findOrFail($id);
        
        $like = WallLike::where('likable_type', WallPost::class)
            ->where('likable_id', $id)
            ->where('device_id', $request->device_id)
            ->first();

        if ($like) {
            $like->delete();
            $post->decrement('likes_count');
            return response()->json(['message' => 'Unliked', 'is_liked' => false, 'likes_count' => $post->likes_count], 200);
        } else {
            WallLike::create([
                'likable_type' => WallPost::class,
                'likable_id' => $id,
                'device_id' => $request->device_id,
            ]);
            $post->increment('likes_count');
            return response()->json(['message' => 'Liked', 'is_liked' => true, 'likes_count' => $post->likes_count], 200);
        }
    }

    /**
     * Get comments for a post
     */
    public function getComments(Request $request, $id): JsonResponse
    {
        $post = WallPost::findOrFail($id);
        $deviceId = $request->query('device_id');
        
        $query = WallComment::with(['fresher:id,branch,device_id'])
            ->where('wall_post_id', $id);

        if ($deviceId) {
            $blockedDeviceIds = BlockedUser::where('blocker_device_id', $deviceId)
                ->pluck('blocked_device_id')
                ->toArray();

            if (!empty($blockedDeviceIds)) {
                $query->whereHas('fresher', function ($q) use ($blockedDeviceIds) {
                    $q->whereNotIn('device_id', $blockedDeviceIds);
                });
            }
        }

        $comments = $query->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($comment) {
                $authorName = $comment->is_anonymous 
                    ? 'Fresher from ' . ($comment->fresher->branch ?? 'PEC')
                    : ($comment->fresher->name ?? 'Student') . ' (' . ($comment->fresher->branch ?? 'PEC') . ')';

                return [
                    'id' => $comment->id,
                    'content' => $comment->content,
                    'created_at' => $comment->created_at,
                    'author' => $authorName,
                    'is_anonymous' => $comment->is_anonymous,
                ];
            });

        return response()->json(['comments' => $comments], 200);
    }

    /**
     * Add a comment
     */
    public function storeComment(Request $request, $id): JsonResponse
    {
        $request->validate([
            'device_id' => 'required|string',
            'content' => 'required|string|max:500',
            'is_anonymous' => 'nullable|boolean',
        ]);

        $post = WallPost::findOrFail($id);
        $fresher = Fresher::where('device_id', $request->device_id)->first();
        
        if (!$fresher) {
            return response()->json(['message' => 'Fresher not found'], 404);
        }

        $isAnonymous = $request->has('is_anonymous') ? $request->boolean('is_anonymous') : true;

        $comment = WallComment::create([
            'wall_post_id' => $post->id,
            'fresher_id' => $fresher->id,
            'content' => $request->content,
            'is_anonymous' => $isAnonymous,
        ]);

        $post->increment('comments_count');

        $authorName = $isAnonymous 
            ? 'Fresher from ' . $fresher->branch
            : $fresher->name . ' (' . $fresher->branch . ')';

        return response()->json([
            'message' => 'Comment added',
            'comment' => [
                'id' => $comment->id,
                'content' => $comment->content,
                'created_at' => $comment->created_at,
                'author' => $authorName,
                'is_anonymous' => $isAnonymous,
            ]
        ], 201);
    }

    /**
     * Report a post
     */
    public function reportPost(Request $request, $id): JsonResponse
    {
        $request->validate([
            'device_id' => 'required|string',
            'reason' => 'required|string|max:255',
        ]);

        $post = WallPost::findOrFail($id);

        ReportedPost::firstOrCreate([
            'wall_post_id' => $post->id,
            'reporter_device_id' => $request->device_id,
        ], [
            'reason' => $request->reason,
        ]);

        return response()->json(['message' => 'Post reported successfully'], 201);
    }

    /**
     * Block a user
     */
    public function blockUser(Request $request, $id): JsonResponse
    {
        $request->validate([
            'device_id' => 'required|string', // The blocker
        ]);

        $post = WallPost::with('fresher')->findOrFail($id);
        
        if ($post->fresher->device_id === $request->device_id) {
            return response()->json(['message' => 'You cannot block yourself'], 400);
        }

        BlockedUser::firstOrCreate([
            'blocker_device_id' => $request->device_id,
            'blocked_device_id' => $post->fresher->device_id,
        ]);

        return response()->json(['message' => 'User blocked successfully'], 201);
    }
}
