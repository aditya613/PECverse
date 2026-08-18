<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SeniorAdvice extends Model
{
    use HasFactory;

    protected $table = 'senior_advices';

    protected $fillable = [
        'title',
        'category',
        'content',
        'author_name',
        'author_batch',
        'likes_count',
    ];
}
