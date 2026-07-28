<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\CourseClass;
use Illuminate\Http\Request;

class DataController extends Controller
{
    /**
     * Get all branches for selection
     */
    public function getBranches()
    {
        return response()->json(Branch::all(), 200);
    }

    /**
     * Get classes (optionally filtered by branch_id)
     */
    public function getClasses(Request $request)
    {
        $query = CourseClass::query();
        
        if ($request->has('branch_id')) {
            $query->where('branch_id', $request->branch_id);
        }
        
        return response()->json($query->get(), 200);
    }
}
