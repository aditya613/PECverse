<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WallComment extends Model
{
    use HasFactory;

    protected $fillable = [
        'wall_post_id',
        'fresher_id',
        'content',
        'is_anonymous',
    ];

    public function post()
    {
        return $this->belongsTo(WallPost::class, 'wall_post_id');
    }

    public function fresher()
    {
        return $this->belongsTo(Fresher::class);
    }

    public function likes()
    {
        return $this->morphMany(WallLike::class, 'likable');
    }
}
