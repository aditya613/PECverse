<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Branch extends Model
{
    protected $fillable = [
        'name',
        'code',
    ];

    public function courseClasses(): HasMany
    {
        return $this->hasMany(CourseClass::class);
    }
}
