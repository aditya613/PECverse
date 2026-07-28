<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Timetable extends Model
{
    protected $fillable = [
        'class_id',
        'type',
        'day_of_week',
        'date',
        'original_timetable_id',
        'period_no',
        'start_time',
        'end_time',
        'subject',
        'teacher',
        'room',
        'reason',
    ];

    protected $casts = [
        'date' => 'date:Y-m-d',
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
    ];

    public function courseClass(): BelongsTo
    {
        return $this->belongsTo(CourseClass::class, 'class_id');
    }

    public function originalTimetable(): BelongsTo
    {
        return $this->belongsTo(Timetable::class, 'original_timetable_id');
    }
}
