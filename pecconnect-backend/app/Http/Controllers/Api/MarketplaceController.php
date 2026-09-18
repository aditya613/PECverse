<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MarketplaceItem;
use App\Models\MarketplaceReport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MarketplaceController extends Controller
{
    /**
     * Get paginated marketplace feed with filters
     */
    public function index(Request $request): JsonResponse
    {
        $category = $request->query('category');
        $status = $request->query('status', 'available');
        $search = trim((string) $request->query('search', ''));
        $minPrice = $request->query('min_price');
        $maxPrice = $request->query('max_price');
        $condition = $request->query('condition');
        $sort = $request->query('sort', 'latest');

        $query = MarketplaceItem::with(['user:id,name,branch,profile_photo'])
            ->withCount('reports')
            ->has('reports', '<', 3); // Auto-hide spam / reported listings

        // Status filter
        if ($status !== 'all') {
            $query->where('status', $status);
        }

        // Category filter
        if ($category && $category !== 'all') {
            $query->where('category', $category);
        }

        // Condition filter
        if ($condition && in_array($condition, ['like_new', 'good', 'fair'])) {
            $query->where('condition', $condition);
        }

        // Price filters
        if (is_numeric($minPrice)) {
            $query->where('price', '>=', (int) $minPrice);
        }
        if (is_numeric($maxPrice)) {
            $query->where('price', '<=', (int) $maxPrice);
        }

        // Search filter (keyword in title, description, or location)
        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('location', 'like', "%{$search}%");
            });
        }

        // Sorting
        switch ($sort) {
            case 'price_asc':
                $query->orderBy('price', 'asc')->orderBy('created_at', 'desc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc')->orderBy('created_at', 'desc');
                break;
            case 'latest':
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        $items = $query->paginate(20);

        return response()->json($items, 200);
    }

    /**
     * Create a new marketplace listing
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'title' => 'required|string|max:100',
            'description' => 'required|string|max:2000',
            'price' => 'required|integer|min:0|max:1000000',
            'category' => 'required|string|in:cycles,academics,hostel,electronics,fashion,others',
            'condition' => 'required|string|in:like_new,good,fair',
            'location' => 'nullable|string|max:100',
            'contact_whatsapp' => 'nullable|string|max:25',
            'contact_phone' => 'nullable|string|max:25',
            'image' => 'nullable|image|max:8192', // Up to 8MB
        ]);

        $user = $request->user();

        $imageUrl = null;
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('marketplace', $filename, 'public');
            $imageUrl = Storage::disk('public')->url($path);
        }

        $item = MarketplaceItem::create([
            'user_id' => $user->id,
            'title' => trim($request->title),
            'description' => trim($request->description),
            'price' => (int) $request->price,
            'category' => $request->category,
            'condition' => $request->condition,
            'location' => $request->location ? trim($request->location) : null,
            'contact_whatsapp' => $request->contact_whatsapp ? trim($request->contact_whatsapp) : null,
            'contact_phone' => $request->contact_phone ? trim($request->contact_phone) : null,
            'image_url' => $imageUrl,
            'status' => 'available',
        ]);

        $item->load('user:id,name,branch,profile_photo');

        return response()->json([
            'message' => 'Listing posted successfully!',
            'item' => $item,
        ], 201);
    }

    /**
     * Get single marketplace item details
     */
    public function show(Request $request, $id): JsonResponse
    {
        $item = MarketplaceItem::with(['user:id,name,branch,profile_photo,created_at'])
            ->withCount('reports')
            ->find($id);

        if (!$item) {
            return response()->json(['message' => 'Item not found'], 404);
        }

        $userId = $request->user()?->id;
        $isOwner = ($userId === $item->user_id);

        // If reported 3 or more times, hide from other users
        if ($item->reports_count >= 3 && !$isOwner) {
            return response()->json(['message' => 'This listing has been flagged and is no longer available'], 404);
        }

        $itemData = $item->toArray();
        $itemData['is_owner'] = $isOwner;

        return response()->json($itemData, 200);
    }

    /**
     * Update listing status (available / sold)
     */
    public function updateStatus(Request $request, $id): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:available,sold',
        ]);

        $item = MarketplaceItem::find($id);

        if (!$item) {
            return response()->json(['message' => 'Item not found'], 404);
        }

        if ($item->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized. Only the seller can update this listing.'], 403);
        }

        $item->status = $request->status;
        $item->save();

        return response()->json([
            'message' => "Item marked as {$request->status} successfully!",
            'item' => $item,
        ], 200);
    }

    /**
     * Delete listing
     */
    public function destroy(Request $request, $id): JsonResponse
    {
        $item = MarketplaceItem::find($id);

        if (!$item) {
            return response()->json(['message' => 'Item not found'], 404);
        }

        if ($item->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Delete image file if stored locally
        if ($item->image_url) {
            $parsed = parse_url($item->image_url, PHP_URL_PATH);
            if ($parsed && str_contains($parsed, 'storage/marketplace/')) {
                $relative = 'marketplace/' . basename($parsed);
                Storage::disk('public')->delete($relative);
            }
        }

        $item->delete();

        return response()->json(['message' => 'Listing deleted successfully'], 200);
    }

    /**
     * Get listings posted by current user
     */
    public function myListings(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $items = MarketplaceItem::where('user_id', $userId)
            ->withCount('reports')
            ->orderBy('created_at', 'desc')
            ->get();

        $activeCount = $items->where('status', 'available')->count();
        $soldCount = $items->where('status', 'sold')->count();

        return response()->json([
            'summary' => [
                'total' => $items->count(),
                'active' => $activeCount,
                'sold' => $soldCount,
            ],
            'items' => $items,
        ], 200);
    }

    /**
     * Report an item for spam, inappropriate content, or scam
     */
    public function reportItem(Request $request, $id): JsonResponse
    {
        $request->validate([
            'reason' => 'required|string|max:255',
        ]);

        $item = MarketplaceItem::find($id);

        if (!$item) {
            return response()->json(['message' => 'Item not found'], 404);
        }

        $userId = $request->user()->id;

        // Check if already reported
        $existing = MarketplaceReport::where('marketplace_item_id', $id)
            ->where('user_id', $userId)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'You have already reported this listing'], 400);
        }

        MarketplaceReport::create([
            'marketplace_item_id' => $id,
            'user_id' => $userId,
            'reason' => trim($request->reason),
        ]);

        return response()->json(['message' => 'Report submitted. Thank you for keeping PECverse safe.'], 200);
    }
}
