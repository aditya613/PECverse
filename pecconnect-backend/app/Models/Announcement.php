<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Announcement extends Model
{
    protected $fillable = [
        'title',
        'body',
        'posted_by',
        'class_id',
        'branch_id',
        'attachment_url',
    ];

    // Eager load the author (posted_by) since announcements almost always show who posted it
    protected $with = ['author'];

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'posted_by');
    }

    public function courseClass(): BelongsTo
    {
        return $this->belongsTo(CourseClass::class, 'class_id');
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class, 'branch_id');
    }

    protected static function booted(): void
    {
        static::created(function (Announcement $announcement) {
            $query = \App\Models\User::whereNotNull('expo_push_token');
            
            if ($announcement->class_id) {
                $query->where('class_id', $announcement->class_id);
            } elseif ($announcement->branch_id) {
                $query->whereHas('courseClass', function($q) use ($announcement) {
                    $q->where('branch_id', $announcement->branch_id);
                });
            }
            
            $tokens = $query->pluck('expo_push_token')->toArray();

            if (count($tokens) > 0) {
                \App\Services\ExpoPushService::sendToTokens(
                    $tokens,
                    '📢 ' . $announcement->title,
                    $announcement->body,
                    ['url' => '/(tabs)/dashboard'] // Deep link payload
                );
            }
        });
    }
}
