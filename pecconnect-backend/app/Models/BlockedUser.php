<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BlockedUser extends Model
{
    protected $fillable = [
        'blocker_device_id',
        'blocked_device_id',
    ];
}
