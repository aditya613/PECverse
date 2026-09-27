<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamDatesheet extends Model
{
    use HasFactory;

    protected $table = 'exam_datesheets';

    protected $fillable = [
        'notice_no',
        'notice_date',
        'exam_type',
        'academic_session',
        'exam_date',
        'day_name',
        'time_slot',
        'start_time',
        'end_time',
        'branch_key',
        'semester',
        'branch_name',
        'subject_code',
        'subject_name',
        'seating_rooms',
        'coordinator_duty',
        'is_backlog',
        'is_minor',
        'notes',
    ];

    protected $casts = [
        'exam_date' => 'date:Y-m-d',
        'notice_date' => 'date:Y-m-d',
        'is_backlog' => 'boolean',
        'is_minor' => 'boolean',
    ];
}
