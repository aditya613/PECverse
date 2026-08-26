<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LostAndFoundComment extends Model
{
    protected $fillable = [
        'item_id',
        'user_id',
        'content',
    ];

    protected $with = ['user'];

    public function item(): BelongsTo
    {
        return $this->belongsTo(LostAndFoundItem::class, 'item_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    protected static function booted(): void
    {
        static::created(function (LostAndFoundComment $comment) {
            // Send push notification to the item owner if someone else comments
            $item = $comment->item;
            if ($item && $item->user_id !== $comment->user_id) {
                $owner = $item->user;
                if ($owner && $owner->expo_push_token) {
                    $commenterName = $comment->user->name;
                    $titlePrefix = $item->type === 'lost' ? 'Lost Item Update' : 'Found Item Update';
                    
                    \App\Services\ExpoPushService::sendToTokens(
                        [$owner->expo_push_token],
                        "💬 {$titlePrefix}: {$item->title}",
                        "{$commenterName} commented: " . \Illuminate\Support\Str::limit($comment->content, 50),
                        ['url' => "/(tabs)/lost-found/{$item->id}"]
                    );
                }
            }
        });
    }
}
