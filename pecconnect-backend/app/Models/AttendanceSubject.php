<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AttendanceSubject extends Model
{
    protected $fillable = ['user_id', 'name', 'attended_classes', 'bunked_classes', 'target_percentage'];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function logs() {
        return $this->hasMany(AttendanceLog::class);
    }
}
