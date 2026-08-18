<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Club extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'category',
        'description',
        'members_count',
        'icon_name',
        'color',
        'instagram_handle',
        'long_description',
        'faculty_advisor',
        'join_link',
        'website_link',
    ];

    public function members()
    {
        return $this->hasMany(ClubMember::class);
    }
}
