<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LostAndFoundItem extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'title',
        'description',
        'location',
        'image_url',
        'status',
        'date_lost_or_found',
    ];

    protected $with = ['user'];

    protected $casts = [
        'date_lost_or_found' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(LostAndFoundComment::class, 'item_id');
    }

    public function reports(): HasMany
    {
        return $this->hasMany(LostAndFoundReport::class, 'item_id');
    }
}
