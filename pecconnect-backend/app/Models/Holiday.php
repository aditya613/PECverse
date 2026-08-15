<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Holiday extends Model
{
    use HasFactory;

    protected $fillable = [
        'class_id',
        'date',
        'reason',
        'declared_by',
    ];

    public function courseClass()
    {
        return $this->belongsTo(CourseClass::class, 'class_id');
    }

    public function declaredBy()
    {
        return $this->belongsTo(User::class, 'declared_by');
    }
}
