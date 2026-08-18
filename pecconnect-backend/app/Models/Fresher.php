<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fresher extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'branch',
        'device_id',
        'secret_token',
        'expo_push_token',
    ];

    public function wallPosts()
    {
        return $this->hasMany(WallPost::class);
    }

    public function wallComments()
    {
        return $this->hasMany(WallComment::class);
    }
}
