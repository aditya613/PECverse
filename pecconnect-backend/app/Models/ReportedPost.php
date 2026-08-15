<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReportedPost extends Model
{
    protected $fillable = [
        'wall_post_id',
        'reporter_device_id',
        'reason',
        'status',
    ];

    public function post()
    {
        return $this->belongsTo(WallPost::class, 'wall_post_id');
    }
}
