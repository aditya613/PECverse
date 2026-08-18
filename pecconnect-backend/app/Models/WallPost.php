<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WallPost extends Model
{
    use HasFactory;

    protected $fillable = [
        'fresher_id',
        'content',
        'likes_count',
        'comments_count',
        'is_anonymous',
    ];

    public function fresher()
    {
        return $this->belongsTo(Fresher::class);
    }

    public function comments()
    {
        return $this->hasMany(WallComment::class);
    }

    public function likes()
    {
        return $this->morphMany(WallLike::class, 'likable');
    }

    public function reports()
    {
        return $this->hasMany(ReportedPost::class);
    }
}
