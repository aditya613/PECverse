<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LostAndFoundReport extends Model
{
    protected $fillable = [
        'item_id',
        'user_id',
        'reason',
    ];

    public function item(): BelongsTo
    {
        return $this->belongsTo(LostAndFoundItem::class, 'item_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
