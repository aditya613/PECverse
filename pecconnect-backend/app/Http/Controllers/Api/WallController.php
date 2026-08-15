<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\WallPost;
use App\Models\WallComment;
use App\Models\Fresher;
use App\Models\WallLike;
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
        
        $query = WallPost::with(['fresher:id,branch'])->withCount('comments');

        if ($sort === 'hot') {
            // Very basic hot algorithm: likes - hours_since_posted
            // For now, just order by likes_count desc as a proxy for "hot/top"
            $query->orderBy('likes_count', 'desc')->orderBy('created_at', 'desc');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $posts = $query->paginate(20);

        // Map to ensure pseudo-anonymity and inject if the current device liked it
        $deviceId = $request->query('device_id');
        
        // Fetch all likes by this device in one query to avoid N+1
        $likedPostIds = [];
        if ($deviceId) {
            $likedPostIds = WallLike::where('likable_type', WallPost::class)
                ->where('device_id', $deviceId)
                ->pluck('likable_id')
                ->toArray();
        }

        $posts->getCollection()->transform(function ($post) use ($likedPostIds) {
            return [
                'id' => $post->id,
                'content' => $post->content,
                'likes_count' => $post->likes_count,
                'comments_count' => $post->comments_count,
                'created_at' => $post->created_at,
                'author' => 'Fresher from ' . ($post->fresher->branch ?? 'PEC'),
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
        ]);

        $fresher = Fresher::where('device_id', $request->device_id)->first();
        if (!$fresher) {
            return response()->json(['message' => 'Fresher not found'], 404);
        }

        $post = WallPost::create([
            'fresher_id' => $fresher->id,
            'content' => $request->content,
            'likes_count' => 0,
            'comments_count' => 0,
        ]);

        return response()->json([
            'message' => 'Posted successfully',
            'post' => [
                'id' => $post->id,
                'content' => $post->content,
                'likes_count' => $post->likes_count,
                'comments_count' => $post->comments_count,
                'created_at' => $post->created_at,
                'author' => 'Fresher from ' . $fresher->branch,
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
        
        $comments = WallComment::with(['fresher:id,branch'])
            ->where('wall_post_id', $id)
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($comment) {
                return [
                    'id' => $comment->id,
                    'content' => $comment->content,
                    'created_at' => $comment->created_at,
                    'author' => 'Fresher from ' . ($comment->fresher->branch ?? 'PEC'),
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
        ]);

        $post = WallPost::findOrFail($id);
        $fresher = Fresher::where('device_id', $request->device_id)->first();
        
        if (!$fresher) {
            return response()->json(['message' => 'Fresher not found'], 404);
        }

        $comment = WallComment::create([
            'wall_post_id' => $post->id,
            'fresher_id' => $fresher->id,
            'content' => $request->content,
        ]);

        $post->increment('comments_count');

        return response()->json([
            'message' => 'Comment added',
            'comment' => [
                'id' => $comment->id,
                'content' => $comment->content,
                'created_at' => $comment->created_at,
                'author' => 'Fresher from ' . $fresher->branch,
            ]
        ], 201);
    }
}
