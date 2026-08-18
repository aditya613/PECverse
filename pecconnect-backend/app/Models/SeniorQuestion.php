<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SeniorQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'question',
        'device_id',
        'user_id',
        'answer',
        'answered_by',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
