<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WallLike extends Model
{
    use HasFactory;

    protected $fillable = [
        'likable_type',
        'likable_id',
        'device_id',
    ];

    public function likable()
    {
        return $this->morphTo();
    }
}
