<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LostAndFoundItem;
use App\Models\LostAndFoundComment;
use App\Models\LostAndFoundReport;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class LostAndFoundController extends Controller
{
    /**
     * Get feed of lost and found items
     */
    public function index(Request $request): JsonResponse
    {
        $type = $request->query('type'); // 'lost' or 'found'
        $status = $request->query('status', 'active');
        
        $query = LostAndFoundItem::with(['user:id,name,branch,profile_photo'])
            ->withCount('comments', 'reports')
            ->having('reports_count', '<', 3) // Hide automatically if reported >= 3 times
            ->where('status', $status);

        if ($type) {
            $query->where('type', $type);
        }

        $items = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json($items, 200);
    }

    /**
     * Create a new lost and found item
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'type' => 'required|in:lost,found',
            'title' => 'required|string|max:100',
            'description' => 'required|string|max:1000',
            'location' => 'nullable|string|max:100',
            'date_lost_or_found' => 'required|date',
            'image' => 'nullable|image|max:5120', // Max 5MB
        ]);

        $user = $request->user();
        
        $imageUrl = null;
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            // Store in storage/app/public/lost-found
            $path = $file->storeAs('lost-found', $filename, 'public');
            // Generate full URL
            $imageUrl = Storage::disk('public')->url($path);
        }

        $item = LostAndFoundItem::create([
            'user_id' => $user->id,
            'type' => $request->type,
            'title' => $request->title,
            'description' => $request->description,
            'location' => $request->location,
            'date_lost_or_found' => date('Y-m-d', strtotime($request->date_lost_or_found)),
            'image_url' => $imageUrl,
            'status' => 'active',
        ]);

        return response()->json([
            'message' => ucfirst($request->type) . ' item reported successfully',
            'item' => $item->load('user:id,name,branch,profile_photo')
        ], 201);
    }

    /**
     * Mark an item as resolved
     */
    public function resolve(Request $request, $id): JsonResponse
    {
        $item = LostAndFoundItem::findOrFail($id);

        if ($item->user_id !== $request->user()->id && $request->user()->role !== 'superadmin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $item->status = 'resolved';
        $item->save();

        return response()->json(['message' => 'Item marked as resolved', 'item' => $item], 200);
    }

    /**
     * Delete an item
     */
    public function destroy(Request $request, $id): JsonResponse
    {
        $item = LostAndFoundItem::findOrFail($id);

        if ($item->user_id !== $request->user()->id && $request->user()->role !== 'superadmin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Delete image if exists
        if ($item->image_url) {
            // Extract relative path from URL
            $path = str_replace(asset('storage/'), '', $item->image_url);
            Storage::disk('public')->delete($path);
        }

        $item->delete();

        return response()->json(['message' => 'Item deleted successfully'], 200);
    }

    /**
     * Get comments for an item
     */
    public function getComments(Request $request, $id): JsonResponse
    {
        $item = LostAndFoundItem::findOrFail($id);
        
        $comments = LostAndFoundComment::with(['user:id,name,branch,profile_photo'])
            ->where('item_id', $id)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json(['comments' => $comments], 200);
    }

    /**
     * Add a comment
     */
    public function storeComment(Request $request, $id): JsonResponse
    {
        $request->validate([
            'content' => 'required|string|max:500',
        ]);

        $item = LostAndFoundItem::findOrFail($id);
        $user = $request->user();

        $comment = LostAndFoundComment::create([
            'item_id' => $item->id,
            'user_id' => $user->id,
            'content' => $request->content,
        ]);

        return response()->json([
            'message' => 'Comment added',
            'comment' => $comment->load('user:id,name,branch,profile_photo')
        ], 201);
    }

    /**
     * Delete a comment
     */
    public function destroyComment(Request $request, $id): JsonResponse
    {
        $comment = LostAndFoundComment::findOrFail($id);

        if ($comment->user_id !== $request->user()->id && $request->user()->role !== 'superadmin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $comment->delete();

        return response()->json(['message' => 'Comment deleted successfully'], 200);
    }

    /**
     * Report an item
     */
    public function reportItem(Request $request, $id): JsonResponse
    {
        $request->validate([
            'reason' => 'required|string|max:255',
        ]);

        $item = LostAndFoundItem::findOrFail($id);
        $user = $request->user();

        // Prevent multiple reports from same user
        $existing = LostAndFoundReport::where('item_id', $item->id)
            ->where('user_id', $user->id)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'You have already reported this item'], 400);
        }

        LostAndFoundReport::create([
            'item_id' => $item->id,
            'user_id' => $user->id,
            'reason' => $request->reason,
        ]);

        return response()->json(['message' => 'Item reported successfully'], 201);
    }
}
