<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AttendanceLog extends Model
{
    protected $fillable = ['user_id', 'attendance_subject_id', 'type'];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function subject() {
        return $this->belongsTo(AttendanceSubject::class, 'attendance_subject_id');
    }
}
