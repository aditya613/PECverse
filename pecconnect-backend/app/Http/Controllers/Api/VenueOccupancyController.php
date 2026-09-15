<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Venue;
use App\Models\VenueOccupancy;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VenueOccupancyController extends Controller
{
    /**
     * Standard slot time definitions
     */
    protected array $slotDefs = [
        ['slot_index' => 1, 'time_label' => '8-9', 'start_time' => '08:00', 'end_time' => '09:00', 'display_label' => '8:00 - 9:00 AM'],
        ['slot_index' => 2, 'time_label' => '9-10', 'start_time' => '09:00', 'end_time' => '10:00', 'display_label' => '9:00 - 10:00 AM'],
        ['slot_index' => 3, 'time_label' => '10-11', 'start_time' => '10:00', 'end_time' => '11:00', 'display_label' => '10:00 - 11:00 AM'],
        ['slot_index' => 4, 'time_label' => '11-12', 'start_time' => '11:00', 'end_time' => '12:00', 'display_label' => '11:00 AM - 12:00 PM'],
        ['slot_index' => 5, 'time_label' => '12-1', 'start_time' => '12:00', 'end_time' => '13:00', 'display_label' => '12:00 - 1:00 PM'],
        ['slot_index' => 6, 'time_label' => '2-3', 'start_time' => '14:00', 'end_time' => '15:00', 'display_label' => '2:00 - 3:00 PM'],
        ['slot_index' => 7, 'time_label' => '3-4', 'start_time' => '15:00', 'end_time' => '16:00', 'display_label' => '3:00 - 4:00 PM'],
        ['slot_index' => 8, 'time_label' => '4-5', 'start_time' => '16:00', 'end_time' => '17:00', 'display_label' => '4:00 - 5:00 PM'],
        ['slot_index' => 9, 'time_label' => '5-7 PM', 'start_time' => '17:00', 'end_time' => '19:00', 'display_label' => '5:00 - 7:00 PM'],
    ];

    /**
     * Get day-wise and slot-wise venue occupancy
     */
    public function index(Request $request): JsonResponse
    {
        $tz = config('app.timezone', 'Asia/Kolkata');
        $now = Carbon::now($tz);

        // Determine current ISO weekday (1=Mon ... 7=Sun)
        $currentIsoDay = $now->dayOfWeekIso;
        $defaultDay = ($currentIsoDay >= 1 && $currentIsoDay <= 5) ? $currentIsoDay : 1;

        $dayOfWeek = (int) $request->input('day', $defaultDay);
        if ($dayOfWeek < 1 || $dayOfWeek > 5) {
            $dayOfWeek = 1;
        }

        // Determine current active slot index based on real-time clock
        $currentSlotIndex = null;
        $currentTimeStr = $now->format('H:i');
        foreach ($this->slotDefs as $def) {
            if ($currentTimeStr >= $def['start_time'] && $currentTimeStr < $def['end_time']) {
                $currentSlotIndex = $def['slot_index'];
                break;
            }
        }

        // Target slot filter (if user selected a specific slot, otherwise default to current or slot 1)
        $selectedSlotIndex = $request->has('slot') ? (int) $request->input('slot') : ($currentSlotIndex ?? 1);

        // Fetch all venues with their occupancies for the selected day
        $venuesQuery = Venue::with(['occupancies' => function ($q) use ($dayOfWeek) {
            $q->where('day_of_week', $dayOfWeek)->orderBy('slot_index');
        }]);

        // Optional venue type filter
        $typeFilter = $request->input('type');
        if ($typeFilter && in_array($typeFilter, ['lecture_hall', 'classroom', 'lab'])) {
            $venuesQuery->where('type', $typeFilter);
        }

        // Optional search query
        $search = trim((string) $request->input('search', ''));
        if ($search !== '') {
            $venuesQuery->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                  ->orWhere('name', 'like', "%{$search}%")
                  ->orWhere('floor', 'like', "%{$search}%");
            });
        }

        $venues = $venuesQuery->orderByRaw("FIELD(type, 'lecture_hall', 'classroom', 'lab')")
            ->orderBy('code')
            ->get();

        $dayNames = [1 => 'Monday', 2 => 'Tuesday', 3 => 'Wednesday', 4 => 'Thursday', 5 => 'Friday'];

        $formattedVenues = [];
        $totalVacantInSelected = 0;
        $totalOccupiedInSelected = 0;

        foreach ($venues as $venue) {
            $slotsData = [];
            $occupiedMap = [];

            foreach ($venue->occupancies as $occ) {
                $occupiedMap[$occ->slot_index] = (bool) $occ->is_occupied;
            }

            $freeSlotsCount = 0;
            $isFreeInSelected = false;

            foreach ($this->slotDefs as $def) {
                $sIdx = $def['slot_index'];
                $isOcc = $occupiedMap[$sIdx] ?? false;
                if (!$isOcc) {
                    $freeSlotsCount++;
                }

                if ($sIdx === $selectedSlotIndex) {
                    $isFreeInSelected = !$isOcc;
                }

                $slotsData[] = [
                    'slot_index' => $sIdx,
                    'time_label' => $def['time_label'],
                    'display_label' => $def['display_label'],
                    'start_time' => $def['start_time'],
                    'end_time' => $def['end_time'],
                    'is_occupied' => $isOcc,
                ];
            }

            // Real-time status calculations
            $statusNow = 'vacant';
            if ($currentSlotIndex !== null && ($currentIsoDay === $dayOfWeek)) {
                $statusNow = ($occupiedMap[$currentSlotIndex] ?? false) ? 'occupied' : 'vacant';
            } elseif ($currentIsoDay !== $dayOfWeek || $currentTimeStr >= '19:00' || $currentTimeStr < '08:00') {
                $statusNow = 'closed';
            }

            // Consecutive free hours calculation starting from selected slot
            $consecutiveFreeHours = 0;
            if ($isFreeInSelected) {
                for ($i = $selectedSlotIndex; $i <= 9; $i++) {
                    if (!($occupiedMap[$i] ?? false)) {
                        $consecutiveFreeHours += ($i === 9 ? 2 : 1); // 5-7 PM is 2 hours
                    } else {
                        break;
                    }
                }
            }

            if ($isFreeInSelected) {
                $totalVacantInSelected++;
            } else {
                $totalOccupiedInSelected++;
            }

            $formattedVenues[] = [
                'id' => $venue->id,
                'code' => $venue->code,
                'name' => $venue->name,
                'type' => $venue->type,
                'floor' => $venue->floor,
                'capacity' => $venue->capacity,
                'slots' => $slotsData,
                'is_free_in_selected_slot' => $isFreeInSelected,
                'consecutive_free_hours' => $consecutiveFreeHours,
                'status_now' => $statusNow,
                'total_free_slots_today' => $freeSlotsCount,
                'total_occupied_slots_today' => 9 - $freeSlotsCount,
            ];
        }

        // Optional status filter: 'free' or 'occupied'
        $statusFilter = $request->input('status');
        if ($statusFilter === 'free' || $statusFilter === 'vacant') {
            $formattedVenues = array_values(array_filter($formattedVenues, fn($v) => $v['is_free_in_selected_slot']));
        } elseif ($statusFilter === 'occupied') {
            $formattedVenues = array_values(array_filter($formattedVenues, fn($v) => !$v['is_free_in_selected_slot']));
        }

        return response()->json([
            'day_of_week' => $dayOfWeek,
            'day_name' => $dayNames[$dayOfWeek] ?? 'Monday',
            'current_iso_day' => $currentIsoDay,
            'current_time' => $currentTimeStr,
            'current_slot_index' => $currentSlotIndex,
            'selected_slot_index' => $selectedSlotIndex,
            'summary' => [
                'total_venues' => count($venues),
                'vacant_count' => $totalVacantInSelected,
                'occupied_count' => $totalOccupiedInSelected,
            ],
            'slot_definitions' => $this->slotDefs,
            'venues' => $formattedVenues,
        ]);
    }

    /**
     * Get full week matrix for offline caching & fast day-switching
     */
    public function matrix(): JsonResponse
    {
        $venues = Venue::orderByRaw("FIELD(type, 'lecture_hall', 'classroom', 'lab')")
            ->orderBy('code')
            ->get();

        $allOccupancies = VenueOccupancy::all()
            ->groupBy(['day_of_week', 'venue_id', 'slot_index']);

        $days = [];
        $dayNames = [1 => 'Monday', 2 => 'Tuesday', 3 => 'Wednesday', 4 => 'Thursday', 5 => 'Friday'];

        for ($day = 1; $day <= 5; $day++) {
            $venueRows = [];

            foreach ($venues as $venue) {
                $slots = [];
                foreach ($this->slotDefs as $def) {
                    $sIdx = $def['slot_index'];
                    $occ = $allOccupancies[$day][$venue->id][$sIdx][0] ?? null;
                    $isOcc = $occ ? (bool) $occ->is_occupied : false;

                    $slots[] = [
                        'slot_index' => $sIdx,
                        'time_label' => $def['time_label'],
                        'is_occupied' => $isOcc,
                    ];
                }

                $venueRows[] = [
                    'id' => $venue->id,
                    'code' => $venue->code,
                    'name' => $venue->name,
                    'type' => $venue->type,
                    'floor' => $venue->floor,
                    'slots' => $slots,
                ];
            }

            $days[$day] = [
                'day_of_week' => $day,
                'day_name' => $dayNames[$day],
                'venues' => $venueRows,
            ];
        }

        return response()->json([
            'slot_definitions' => $this->slotDefs,
            'days' => $days,
        ]);
    }
}
