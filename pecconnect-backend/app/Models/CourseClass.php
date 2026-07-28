<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CourseClass extends Model
{
    // Override the table name since 'class' is a reserved keyword in PHP
    protected $table = 'classes';

    protected $fillable = [
        'branch_id',
        'year',
        'group_name',
        'cr_user_id',
    ];

    // Eager load branch and CR by default since they are heavily requested
    protected $with = ['branch', 'cr'];

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function cr(): BelongsTo
    {
        return $this->belongsTo(User::class, 'cr_user_id');
    }

    public function students(): HasMany
    {
        return $this->hasMany(User::class, 'class_id');
    }

    public function timetables(): HasMany
    {
        return $this->hasMany(Timetable::class, 'class_id');
    }

    public function timetableExceptions(): HasMany
    {
        return $this->hasMany(TimetableException::class, 'class_id');
    }
}
