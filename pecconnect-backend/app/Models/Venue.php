<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Venue extends Model
{
    protected $fillable = [
        'code',
        'name',
        'type',
        'floor',
        'capacity',
    ];

    public function occupancies(): HasMany
    {
        return $this->hasMany(VenueOccupancy::class);
    }
}
