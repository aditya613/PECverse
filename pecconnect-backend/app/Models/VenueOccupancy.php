<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VenueOccupancy extends Model
{
    protected $fillable = [
        'venue_id',
        'day_of_week',
        'slot_index',
        'time_label',
        'start_time',
        'end_time',
        'is_occupied',
        'occupied_by',
    ];

    protected $casts = [
        'is_occupied' => 'boolean',
        'day_of_week' => 'integer',
        'slot_index' => 'integer',
    ];

    public function venue(): BelongsTo
    {
        return $this->belongsTo(Venue::class);
    }
}
